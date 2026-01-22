import path from "path";
import { promises as fs } from "fs";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import type { File } from "@babel/types";
import { FigmaClient } from "../services/figmaClient";
import { CliOptions, SectionPlan } from "../types";
import { convertTailwindToInline } from "../conversion/tailwindToInline";
import { locateRootComponent } from "../analyzer/rootComponent";
import { computeMetrics } from "../analyzer/jsxMetrics";
import { extractSections } from "../extraction/structure";
import { ensureNamedImports } from "../extraction/imports";
import { writeComponentFile } from "../extraction/componentWriter";
import { buildManifest, manifestPath } from "../manifest";
import { DEFAULT_SCREEN_FILE, RAW_FILE, UNMAPPED_LOG } from "../config";
import { ensureDir, writeFile } from "../utils/fs";
import { formatTsx } from "../utils/format";

export interface PipelineOptions extends CliOptions {}

export async function runPipeline(options: PipelineOptions): Promise<void> {
  const { figmaNode, outputDir } = options;
  await ensureDir(outputDir);
  const client = new FigmaClient({
    workspaceDir: process.cwd(),
    mcpEndpoint: process.env.MCP_FIGMA_ENDPOINT,
  });
  const rawSource = await client.fetchNodeComponent(figmaNode);

  if (looksLikeFigmaXml(rawSource)) {
    throw new Error(
      "MCP returned Figma XML instead of React/Tailwind code. Upewnij się, że korzystasz z MCP Dev Mode w Figma, a endpoint zwraca kod (nie XML).",
    );
  }

  await writeFile(path.join(outputDir, RAW_FILE), rawSource);

  const ast = parseSource(rawSource);
  const conversionResult = convertTailwindToInline(ast);
  const rootContext = locateRootComponent(ast);
  const metrics = computeMetrics(rootContext.jsxPath.node);
  console.log("JSX metrics", metrics);

  const sections = extractSections(rootContext.jsxPath, rootContext.exportName);
  ensureNamedImports(
    ast,
    sections.map((section) => ({
      name: section.name,
      source: `./${section.name}`,
    })),
  );

  await emitRootFile(ast, outputDir);
  await emitSections(outputDir, sections);
  await emitManifest(outputDir, rootContext.exportName, sections);

  await writeUnmappedLog(outputDir, conversionResult.unmappedClasses);
}

function parseSource(source: string): File {
  return parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}

async function emitRootFile(ast: File, outputDir: string): Promise<void> {
  const { code } = generate(ast, { retainLines: false });
  const formatted = await formatTsx(code);
  await writeFile(path.join(outputDir, DEFAULT_SCREEN_FILE), formatted);
}

async function emitSections(
  outputDir: string,
  sections: SectionPlan[],
): Promise<void> {
  for (const section of sections) {
    const sectionPath = path.join(outputDir, `${section.name}.tsx`);
    await writeComponentFile({
      name: section.name,
      jsx: section.jsx,
      outputPath: sectionPath,
      importBlocks: section.blocks.map((block) => block.name),
    });

    for (const block of section.blocks) {
      const blockPath = path.join(outputDir, `${block.name}.tsx`);
      await writeComponentFile({
        name: block.name,
        jsx: block.jsx,
        outputPath: blockPath,
      });
    }
  }
}

async function emitManifest(
  outputDir: string,
  exportName: string,
  sections: SectionPlan[],
): Promise<void> {
  const screenId = deriveScreenId(outputDir);
  const manifest = buildManifest(
    screenId,
    DEFAULT_SCREEN_FILE,
    exportName,
    sections,
  );
  const manifestContent = JSON.stringify(manifest, null, 2);
  await writeFile(manifestPath(outputDir), manifestContent + "\n");
}

function deriveScreenId(outputDir: string): string {
  const base = path.basename(path.resolve(outputDir));
  return base.replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase();
}

function looksLikeFigmaXml(source: string): boolean {
  const trimmed = source.trim();
  if (!trimmed.startsWith("<")) {
    return false;
  }

  return (
    /<section[^>]*name=/.test(trimmed) ||
    /<frame[^>]*name=/.test(trimmed) ||
    /<text[^>]*name=/.test(trimmed)
  );
}

async function writeUnmappedLog(
  outputDir: string,
  unmappedClasses: Set<string>,
): Promise<void> {
  if (unmappedClasses.size === 0) {
    console.log("All Tailwind classes mapped successfully");
    return;
  }

  const lines = Array.from(unmappedClasses).sort();
  const logPath = path.join(outputDir, UNMAPPED_LOG);
  await fs.writeFile(logPath, lines.join("\n") + "\n", "utf8");
  console.warn(
    `Encountered ${lines.length} unmapped Tailwind classes. See ${logPath}`,
  );
}

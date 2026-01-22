import { promises as fs } from "fs";
import path from "path";
import {
  COMPONENTS_DIR,
  MANIFEST_FILE,
  METADATA_FILE,
  RAW_SOURCE_FILE,
  SCREEN_ENTRY_FILE,
  UNMAPPED_LOG,
} from "../constants";
import {
  ComponentDetails,
  ComponentSummary,
  ComponentStats,
  FileNode,
  Manifest,
} from "../types";

interface MetadataFile extends ComponentSummary {}

export async function scanComponents(
  baseDir: string = COMPONENTS_DIR,
): Promise<ComponentSummary[]> {
  const entries = await safeReadDir(baseDir);
  const components: ComponentSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const dir = path.join(baseDir, entry.name);
    const manifest = await readManifest(dir);
    if (!manifest) {
      continue;
    }
    const metadata = await ensureMetadata(dir, manifest);
    components.push(metadata);
  }

  return components.sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  );
}

export async function getComponentDetails(
  id: string,
  baseDir: string = COMPONENTS_DIR,
): Promise<ComponentDetails> {
  const dir = path.join(baseDir, id);
  const manifest = await readManifest(dir);
  if (!manifest) {
    throw new Error(`Component manifest missing for ${id}`);
  }

  const metadata = await ensureMetadata(dir, manifest);
  const { tree, fileCount } = await buildFileTree(dir);
  const stats: ComponentStats = {
    ...metadata.stats,
    files: fileCount,
  };

  return {
    ...metadata,
    manifest,
    files: tree,
    path: dir,
    stats,
  };
}

async function ensureMetadata(
  dir: string,
  manifest: Manifest,
): Promise<ComponentSummary> {
  const metaPath = path.join(dir, METADATA_FILE);
  const persisted = await readMetadata(metaPath);
  if (persisted) {
    return persisted;
  }

  const metadata = await buildMetadata(dir, manifest);
  await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2) + "\n", "utf8");
  return metadata;
}

async function buildMetadata(
  dir: string,
  manifest: Manifest,
): Promise<ComponentSummary> {
  const stat = await fs.stat(dir);
  const id = manifest.screenId || path.basename(dir);
  const name = deriveComponentName(id);
  const figmaNodeId =
    manifest.components.find((item) => item.figmaNodeId)?.figmaNodeId ??
    deriveNodeIdFromDir(dir) ??
    "unknown";

  const unmappedClasses = await countUnmapped(dir);
  const { fileCount } = await buildFileTree(dir);
  const { sections, blocks } = countManifestEntries(manifest);

  return {
    id,
    name,
    figmaNodeId,
    generatedAt: stat.mtime.toISOString(),
    stats: {
      files: fileCount,
      sections,
      blocks,
      unmappedClasses,
    },
  };
}

async function readManifest(dir: string): Promise<Manifest | null> {
  try {
    const content = await fs.readFile(path.join(dir, MANIFEST_FILE), "utf8");
    return JSON.parse(content) as Manifest;
  } catch {
    return null;
  }
}

async function readMetadata(metaPath: string): Promise<ComponentSummary | null> {
  try {
    const content = await fs.readFile(metaPath, "utf8");
    return JSON.parse(content) as MetadataFile;
  } catch {
    return null;
  }
}

async function safeReadDir(dir: string) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function deriveComponentName(id: string): string {
  const match = id.match(/^(.*?)-\d+-\d+$/);
  if (match?.[1]) {
    return match[1];
  }
  return id;
}

function deriveNodeIdFromDir(dir: string): string | null {
  const base = path.basename(dir);
  const match = base.match(/(\d+)-(\d+)$/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return null;
}

async function countUnmapped(dir: string): Promise<number> {
  const logPath = path.join(dir, UNMAPPED_LOG);
  try {
    const content = await fs.readFile(logPath, "utf8");
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length;
  } catch {
    return 0;
  }
}

function countManifestEntries(manifest: Manifest): {
  sections: number;
  blocks: number;
} {
  const sections = manifest.components.filter((c) => c.kind === "section").length;
  const blocks = manifest.components.filter((c) => c.kind === "block").length;
  return { sections, blocks };
}

async function buildFileTree(dir: string): Promise<{
  tree: FileNode[];
  fileCount: number;
}> {
  const entries = await safeReadDir(dir);
  const nodes: FileNode[] = [];
  let fileCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const result = await buildFileTree(fullPath);
      nodes.push({
        name: entry.name,
        type: "directory",
        path: fullPath,
        children: result.tree,
      });
      fileCount += result.fileCount;
    } else {
      const stat = await fs.stat(fullPath);
      nodes.push({
        name: entry.name,
        type: "file",
        path: fullPath,
        size: stat.size,
      });
      fileCount += 1;
    }
  }

  return { tree: nodes, fileCount };
}

export function resolveComponentPaths(
  id: string,
  baseDir: string = COMPONENTS_DIR,
): { dir: string; manifest: string; entry: string; raw: string } {
  const dir = path.join(baseDir, id);
  return {
    dir,
    manifest: path.join(dir, MANIFEST_FILE),
    entry: path.join(dir, SCREEN_ENTRY_FILE),
    raw: path.join(dir, RAW_SOURCE_FILE),
  };
}

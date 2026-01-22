import { MANIFEST_FILE } from "./config";
import { ScreenManifest, SectionPlan } from "./types";

export function buildManifest(
  screenId: string,
  rootFile: string,
  rootExport: string,
  sections: SectionPlan[]
): ScreenManifest {
  const components = sections.flatMap((section) => {
    const sectionEntry = {
      kind: "section" as const,
      name: section.name,
      file: `${section.name}.tsx`,
      exportName: section.name,
      figmaNodeId: section.figmaNodeId,
    };

    const blockEntries = section.blocks.map((block) => ({
      kind: "block" as const,
      name: block.name,
      file: `${block.name}.tsx`,
      exportName: block.name,
      figmaNodeId: block.figmaNodeId,
      parent: block.parent,
    }));

    return [sectionEntry, ...blockEntries];
  });

  return {
    screenId,
    rootFile,
    rootExport,
    components,
  };
}

export function manifestPath(outputDir: string): string {
  return `${outputDir}/${MANIFEST_FILE}`;
}

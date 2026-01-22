export interface CliOptions {
  figmaNode: string;
  outputDir: string;
}

export interface TailwindConversionResult {
  unmappedClasses: Set<string>;
}

export interface Metrics {
  nodeCount: number;
  maxDepth: number;
}

import type { JSXElement } from "@babel/types";

export interface SectionPlan {
  name: string;
  jsx: JSXElement;
  figmaNodeId?: string;
  blocks: BlockPlan[];
}

export interface BlockPlan {
  name: string;
  jsx: JSXElement;
  figmaNodeId?: string;
  parent: string;
}

export interface ManifestComponent {
  kind: "section" | "block";
  name: string;
  file: string;
  exportName: string;
  figmaNodeId?: string;
  parent?: string;
}

export interface ScreenManifest {
  screenId: string;
  rootFile: string;
  rootExport: string;
  components: ManifestComponent[];
}

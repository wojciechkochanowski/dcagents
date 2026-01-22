export interface ComponentStats {
  files: number;
  sections: number;
  blocks: number;
  unmappedClasses: number;
}

export interface ComponentSummary {
  id: string;
  name: string;
  figmaNodeId: string;
  figmaUrl?: string;
  generatedAt: string;
  stats: ComponentStats;
}

export interface ManifestComponent {
  kind: "section" | "block";
  name: string;
  file: string;
  exportName: string;
  figmaNodeId?: string;
  parent?: string;
}

export interface Manifest {
  screenId: string;
  rootFile: string;
  rootExport: string;
  components: ManifestComponent[];
}

export interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  children?: FileNode[];
}

export interface ComponentDetails extends ComponentSummary {
  manifest: Manifest;
  files: FileNode[];
  path: string;
}

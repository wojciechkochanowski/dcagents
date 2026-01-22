import type { Component, ComponentDetails } from "./types";

type ProgressEvent = {
  percent: number;
  message: string;
};

type GenerateCompleteEvent = {
  componentId: string;
};

type GenerateErrorEvent = {
  error: string;
};

type ElectronAPI = {
  listComponents: () => Promise<Component[]>;
  getComponent: (id: string) => Promise<ComponentDetails>;
  deleteComponent: (id: string) => Promise<void>;
  generateComponent: (payload: { url: string; name?: string }) => Promise<{
    componentId: string;
  }>;
  bundleComponent: (id: string) => Promise<string>;
  readComponentFile: (payload: { id: string; path: string }) => Promise<{ content: string }>;
  onGenerateProgress: (
    callback: (payload: ProgressEvent) => void,
  ) => () => void;
  onGenerateComplete: (
    callback: (payload: GenerateCompleteEvent) => void,
  ) => () => void;
  onGenerateError: (
    callback: (payload: GenerateErrorEvent) => void,
  ) => () => void;
};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};

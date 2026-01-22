import { contextBridge, ipcRenderer } from "electron";

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

const api = {
  listComponents: () => ipcRenderer.invoke("components:list"),
  getComponent: (id: string) => ipcRenderer.invoke("components:get", id),
  deleteComponent: (id: string) => ipcRenderer.invoke("components:delete", id),
  generateComponent: (payload: { url: string; name?: string }) =>
    ipcRenderer.invoke("components:generate", payload),
  bundleComponent: (id: string) => ipcRenderer.invoke("component:bundle", id),
  readComponentFile: (payload: { id: string; path: string }) =>
    ipcRenderer.invoke("component:file", payload),
  onGenerateProgress: (callback: (payload: ProgressEvent) => void) => {
    const listener = (_event: unknown, payload: ProgressEvent) => callback(payload);
    ipcRenderer.removeAllListeners("generate:progress");
    ipcRenderer.on("generate:progress", listener);
    return () => ipcRenderer.removeListener("generate:progress", listener);
  },
  onGenerateComplete: (callback: (payload: GenerateCompleteEvent) => void) => {
    const listener = (_event: unknown, payload: GenerateCompleteEvent) =>
      callback(payload);
    ipcRenderer.removeAllListeners("generate:complete");
    ipcRenderer.on("generate:complete", listener);
    return () => ipcRenderer.removeListener("generate:complete", listener);
  },
  onGenerateError: (callback: (payload: GenerateErrorEvent) => void) => {
    const listener = (_event: unknown, payload: GenerateErrorEvent) => callback(payload);
    ipcRenderer.removeAllListeners("generate:error");
    ipcRenderer.on("generate:error", listener);
    return () => ipcRenderer.removeListener("generate:error", listener);
  },
};

export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld("electronAPI", api);

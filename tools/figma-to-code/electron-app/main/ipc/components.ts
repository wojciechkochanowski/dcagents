import { ipcMain } from "electron";
import { promises as fs } from "fs";
import path from "path";
import { COMPONENTS_DIR } from "../constants";
import {
  getComponentDetails,
  resolveComponentPaths,
  scanComponents,
} from "../utils/scanner";

export function registerComponentsIpc(): void {
  ipcMain.handle("components:list", async () => {
    return scanComponents(COMPONENTS_DIR);
  });

  ipcMain.handle("components:get", async (_event, id: string) => {
    return getComponentDetails(id, COMPONENTS_DIR);
  });

  ipcMain.handle("components:delete", async (event, id: string) => {
    const { dir } = resolveComponentPaths(id, COMPONENTS_DIR);
    await fs.rm(dir, { recursive: true, force: true });
    event.sender.send("component:deleted", id);
  });

  ipcMain.handle("component:file", async (_event, payload: { id: string; path: string }) => {
    const { dir } = resolveComponentPaths(payload.id, COMPONENTS_DIR);
    const target = path.resolve(payload.path);
    if (!target.startsWith(dir)) {
      throw new Error("File access outside component directory is not allowed");
    }
    const content = await fs.readFile(target, "utf8");
    return { content };
  });
}

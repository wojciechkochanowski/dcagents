import { ipcMain } from "electron";
import path from "path";
import { build } from "esbuild";
import { promises as fs } from "fs";
import { COMPONENTS_DIR } from "../constants";
import { resolveComponentPaths } from "../utils/scanner";

const bundleCache = new Map<string, { mtimeMs: number; code: string }>();

export function registerBundlerIpc(): void {
  ipcMain.handle("component:bundle", async (_event, id: string) => {
    const { entry } = resolveComponentPaths(id, COMPONENTS_DIR);
    return bundleEntry(entry);
  });
}

async function bundleEntry(entry: string): Promise<string> {
  const stat = await fs.stat(entry);
  const cached = bundleCache.get(entry);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.code;
  }

  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: "cjs",
    jsx: "automatic",
    write: false,
    platform: "browser",
    target: "es2018",
    absWorkingDir: path.dirname(entry),
    nodePaths: [
      // Prefer electron-app dependencies (React runtime, etc.)
      path.resolve(__dirname, "../../..", "node_modules"),
      // Fallback to repo root node_modules
      path.resolve(__dirname, "../../../..", "node_modules"),
    ],
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
      ".js": "js",
      ".jsx": "jsx",
      ".css": "css",
      ".json": "json",
      ".svg": "dataurl",
      ".png": "dataurl",
      ".jpg": "dataurl",
      ".jpeg": "dataurl",
    },
  });

  const output = result.outputFiles?.[0]?.text;
  if (!output) {
    throw new Error("Bundling failed: no output");
  }
  bundleCache.set(entry, { mtimeMs: stat.mtimeMs, code: output });
  return output;
}

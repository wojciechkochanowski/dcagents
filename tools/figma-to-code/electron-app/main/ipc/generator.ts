import { ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import { promises as fs } from "fs";
import { COMPONENTS_DIR } from "../constants";
import { scanComponents } from "../utils/scanner";

interface GeneratePayload {
  url: string;
  name?: string;
}

export function registerGeneratorIpc(): void {
  ipcMain.handle("components:generate", async (event, payload: GeneratePayload) => {
    const nodeId = extractNodeId(payload.url);
    if (!nodeId) {
      throw new Error("Nieprawidłowy URL/node-id Figmy");
    }

    const componentId =
      payload.name?.trim() && payload.name.trim().length > 0
        ? slugify(payload.name.trim())
        : `component-${nodeId.replace(":", "-")}`;

    const outputDir = path.join(COMPONENTS_DIR, componentId);
    await fs.mkdir(outputDir, { recursive: true });

    await runGenerator({
      nodeRef: payload.url,
      outputDir,
      send: (channel, data) => event.sender.send(channel, data),
    });

    // ensure metadata generated/refreshed for new component
    await scanComponents(COMPONENTS_DIR);

    return { componentId };
  });
}

function extractNodeId(input: string): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    const param = url.searchParams.get("node-id");
    if (param) {
      const decoded = decodeURIComponent(param);
      return normalizeNodeId(decoded);
    }
  } catch {
    // not a URL, fall through
  }

  if (/^[0-9]+[:-][0-9]+$/.test(input.trim())) {
    return normalizeNodeId(input.trim());
  }

  const trailing = input.match(/(\\d+)[:-](\\d+)$/);
  if (trailing) {
    return normalizeNodeId(`${trailing[1]}:${trailing[2]}`);
  }

  return null;
}

function normalizeNodeId(value: string): string {
  return value.replace(/%3a/gi, ":").replace(/-/g, ":");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function runGenerator({
  nodeRef,
  outputDir,
  send,
}: {
  nodeRef: string;
  outputDir: string;
  send: (channel: string, payload: unknown) => void;
}): Promise<void> {
  const cliPath = path.resolve(__dirname, "../../../../dist/cli.js");
  const cwd = path.resolve(__dirname, "../../../../");

  send("generate:progress", { percent: 10, message: "Launching generator..." });

  await new Promise<void>((resolve, reject) => {
    const child = spawn("node", [cliPath, "--figma-node", nodeRef, "--output-dir", outputDir], {
      cwd,
      env: process.env,
    });

    let lastStdout = "";
    let lastStderr = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();
      lastStdout = text;
      send("generate:progress", { percent: 50, message: text.trim() });
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      lastStderr = text;
      send("generate:progress", { percent: 70, message: text.trim() });
    });

    child.on("error", (error) => {
      send("generate:error", { error: error.message });
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        send("generate:complete", { componentId: path.basename(outputDir) });
        resolve();
      } else {
        const details = (lastStderr || lastStdout).trim();
        const message = details
          ? `Generator exited with code ${code}: ${details}`
          : `Generator exited with code ${code}`;
        send("generate:error", { error: message });
        reject(new Error(message));
      }
    });
  });
}

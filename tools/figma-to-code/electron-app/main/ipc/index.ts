import { registerBundlerIpc } from "./bundler";
import { registerComponentsIpc } from "./components";
import { registerGeneratorIpc } from "./generator";

export function registerIpcHandlers(): void {
  registerComponentsIpc();
  registerGeneratorIpc();
  registerBundlerIpc();
}

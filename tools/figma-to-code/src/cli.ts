#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import { runPipeline } from "./pipeline";

const program = new Command();
const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "..", "components");

program
  .name("figma-screen-extract")
  .description("Pobiera kod ekranu z Figmy, konwertuje Tailwind na inline styles i rozbija na komponenty")
  .requiredOption(
    "--figma-node <node>",
    "Adres node'a Figmy lub ścieżka do lokalnego pliku TSX"
  )
  .option(
    "--output-dir <dir>",
    "Katalog wyjściowy dla wygenerowanych plików",
    DEFAULT_OUTPUT_DIR
  )
  .action(async (opts) => {
    const outputDir = path.resolve(opts.outputDir ?? DEFAULT_OUTPUT_DIR);
    try {
      await runPipeline({
        figmaNode: opts.figmaNode,
        outputDir,
      });
      console.log(`Wygenerowano strukturę w ${outputDir}`);
    } catch (error) {
      console.error("Błąd wykonywania:", error);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);

import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

const LOG_FILE_NAME = "overview.log"
const REQUIRED_INSTRUCTION = "figma.md"
const FIGMA_MATCH = "figma"

const denialMessage = `REPEAT THIS COMMAND but first you must read the instructions in @instructions/${REQUIRED_INSTRUCTION} before you can use Figma tools. Read the file and try again.`

async function wasInstructionRead(logFile: string) {
  try {
    const content = await fs.readFile(logFile, "utf8")
    return content.includes(`READ ${REQUIRED_INSTRUCTION}`)
  } catch {
    return false
  }
}

export const PreFigma: Plugin = async ({ directory }) => {
  const baseDir = directory ?? process.cwd()
  const logFile = path.join(baseDir, "logs", LOG_FILE_NAME)

  return {
    "tool.execute.before": async ({ tool }) => {
      if (!tool.includes(FIGMA_MATCH)) return

      const read = await wasInstructionRead(logFile)
      if (!read) {
        throw new Error(denialMessage)
      }
    },
  }
}

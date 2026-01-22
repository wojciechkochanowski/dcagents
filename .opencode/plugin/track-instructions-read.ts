import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

const INSTRUCTION_FILES = new Set([
  "agent-instructions.md",
  "react-components.md",
  "api-requests.md",
  "translations.md",
  "less-styles.md",
  "figma.md",
])

const formatTimestamp = () => {
  const now = new Date()
  const pad = (val: number) => val.toString().padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

async function logRead(baseDir: string, filename: string) {
  const logsDir = path.join(baseDir, "logs")
  const overviewLog = path.join(logsDir, "overview.log")

  await fs.mkdir(logsDir, { recursive: true })
  await fs.appendFile(overviewLog, `READ ${filename} ${formatTimestamp()} agent\n`)
}

export const TrackInstructionsRead: Plugin = async ({ directory }) => {
  const baseDir = directory ?? process.cwd()

  return {
    "tool.execute.before": async ({ tool }, output) => {
      if (tool !== "read") return

      const filePath =
        typeof output?.args?.filePath === "string"
          ? output.args.filePath
          : typeof output?.args?.filepath === "string"
            ? output.args.filepath
            : undefined

      if (!filePath) return

      const filename = path.basename(filePath)
      if (!INSTRUCTION_FILES.has(filename)) return

      try {
        await logRead(baseDir, filename)
      } catch {
        // Ignore logging failures to avoid blocking the tool execution
      }
    },
  }
}

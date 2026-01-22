import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

const formatTimestamp = () => {
  const now = new Date()
  const pad = (val: number) => val.toString().padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

async function resetLogs(baseDir: string, reason: "START" | "CLEAR") {
  const logsDir = path.join(baseDir, "logs")
  const overviewLog = path.join(logsDir, "overview.log")
  const hooksLog = path.join(logsDir, "hooks.log")
  const header = `SESSION_${reason} ${formatTimestamp()}\n`

  await fs.mkdir(logsDir, { recursive: true })
  await fs.writeFile(overviewLog, header)
  await fs.writeFile(hooksLog, "")
}

export const ClearLogs: Plugin = async ({ directory }) => {
  const baseDir = directory ?? process.cwd()

  // Clear immediately on plugin load to cover app startup
  try {
    await resetLogs(baseDir, "START")
  } catch {
    // ignore
  }

  return {
    event: async ({ event }) => {
      try {
        if (event.type === "session.created") {
          await resetLogs(baseDir, "START")
        }
        if (event.type === "session.compacted" || event.type === "session.deleted") {
          await resetLogs(baseDir, "CLEAR")
        }
      } catch {
        // Do not block session on logging failure
      }
    },
  }
}

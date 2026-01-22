import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

const LOG_FILE_NAME = "overview.log"
const REACT_INSTRUCTIONS = "react-components.md"
const REQUESTS_INSTRUCTIONS = "api-requests.md"
const TRANSLATIONS_INSTRUCTIONS = "translations.md"
const LESS_INSTRUCTIONS = "less-styles.md"

const denialMessage = (instruction: string) =>
  `REPEAT THIS COMMAND but first you must read the instructions in @instructions/${instruction} before you can edit this type of file. Read the file and try again.`

async function wasInstructionRead(logFile: string, instruction: string): Promise<boolean> {
  try {
    const content = await fs.readFile(logFile, "utf8")
    return content.includes(`READ ${instruction}`)
  } catch {
    return false
  }
}

function resolvePath(baseDir: string, filePath: string) {
  return path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(baseDir, filePath)
}

function isInside(baseDir: string, target: string) {
  const relative = path.relative(baseDir, target)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function extractPatchPaths(patchText: string): string[] {
  const paths = new Set<string>()
  const lines = patchText.split("\n")
  for (const line of lines) {
    const addMatch = line.match(/^\*\*\* Add File: (.+)$/)
    if (addMatch?.[1]) {
      paths.add(addMatch[1])
      continue
    }
    const updateMatch = line.match(/^\*\*\* Update File: (.+)$/)
    if (updateMatch?.[1]) {
      paths.add(updateMatch[1])
      continue
    }
    const deleteMatch = line.match(/^\*\*\* Delete File: (.+)$/)
    if (deleteMatch?.[1]) {
      paths.add(deleteMatch[1])
      continue
    }
    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/)
    if (moveMatch?.[1]) {
      paths.add(moveMatch[1])
      continue
    }
    const plusMatch = line.match(/^\+\+\+ [ab]\/(.+)$/)
    if (plusMatch?.[1]) {
      paths.add(plusMatch[1])
      continue
    }
    const minusMatch = line.match(/^\-\-\- [ab]\/(.+)$/)
    if (minusMatch?.[1]) {
      paths.add(minusMatch[1])
      continue
    }
  }
  return Array.from(paths)
}

function extractFilePaths(tool: string, args: Record<string, any>): string[] {
  const paths = new Set<string>()
  const direct = [args.filePath, args.filepath]
  for (const candidate of direct) {
    if (typeof candidate === "string" && candidate.trim()) {
      paths.add(candidate)
    }
  }
  if (tool === "patch" && typeof args.patchText === "string") {
    extractPatchPaths(args.patchText).forEach((p) => paths.add(p))
  }
  return Array.from(paths)
}

export const PreEdit: Plugin = async ({ directory }) => {
  const baseDir = directory ?? process.cwd()
  const logFile = path.join(baseDir, "logs", LOG_FILE_NAME)

  const ensureInstruction = async (instruction: string) => {
    const read = await wasInstructionRead(logFile, instruction)
    if (!read) throw new Error(denialMessage(instruction))
  }

  const checkFileGuards = async (filePath: string) => {
    if (!filePath) return
    const resolved = resolvePath(baseDir, filePath)

    if (!isInside(baseDir, resolved) && filePath.includes("frontend")) {
      throw new Error(`Your frontend code is in ${baseDir}. Please move it there and try again.`)
    }

    if (resolved.endsWith(".tsx")) {
      await ensureInstruction(REACT_INSTRUCTIONS)
    }

    if (resolved.includes(`${path.sep}common${path.sep}requests${path.sep}`)) {
      await ensureInstruction(REQUESTS_INSTRUCTIONS)
    }

    if (resolved.includes(`${path.sep}common${path.sep}intl${path.sep}`)) {
      await ensureInstruction(TRANSLATIONS_INSTRUCTIONS)
    }

    if (resolved.endsWith(".less")) {
      await ensureInstruction(LESS_INSTRUCTIONS)
    }
  }

  return {
    "tool.execute.before": async ({ tool }, output) => {
      const args = (output as { args?: Record<string, any> })?.args ?? {}

      const isEditTool = tool === "write" || tool === "edit" || tool === "patch"
      if (!isEditTool) {
        if (tool === "bash" && typeof args.command === "string" && args.command.includes("language-check-tool")) {
          await ensureInstruction(TRANSLATIONS_INSTRUCTIONS)
        }
        return
      }

      const filePaths = extractFilePaths(tool, args)
      for (const filePath of filePaths) {
        await checkFileGuards(filePath)
      }
    },
  }
}

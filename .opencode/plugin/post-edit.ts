import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

type CmdResult = { exitCode: number; stdout: string; stderr: string }

async function runCmd(cmd: ReturnType<typeof $>, cwd: string): Promise<CmdResult> {
  const res = await cmd.cwd(cwd).quiet().nothrow()
  return {
    exitCode: res.exitCode ?? 0,
    stdout: (res.stdout ?? "").toString(),
    stderr: (res.stderr ?? "").toString(),
  }
}

function extractPatchPaths(patchText: string): string[] {
  const paths = new Set<string>()
  for (const line of patchText.split("\n")) {
    const add = line.match(/^\*\*\* Add File: (.+)$/)
    if (add?.[1]) {
      paths.add(add[1])
      continue
    }
    const update = line.match(/^\*\*\* Update File: (.+)$/)
    if (update?.[1]) {
      paths.add(update[1])
      continue
    }
    const del = line.match(/^\*\*\* Delete File: (.+)$/)
    if (del?.[1]) {
      paths.add(del[1])
      continue
    }
    const move = line.match(/^\*\*\* Move to: (.+)$/)
    if (move?.[1]) {
      paths.add(move[1])
      continue
    }
    const plus = line.match(/^\+\+\+ [ab]\/(.+)$/)
    if (plus?.[1]) {
      paths.add(plus[1])
      continue
    }
    const minus = line.match(/^\-\-\- [ab]\/(.+)$/)
    if (minus?.[1]) {
      paths.add(minus[1])
      continue
    }
  }
  return Array.from(paths)
}

function collectFiles(tool: string, args: Record<string, any>, baseDir: string): string[] {
  const files = new Set<string>()
  const candidates = [args.filePath, args.filepath]
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) {
      files.add(path.isAbsolute(c) ? c : path.join(baseDir, c))
    }
  }
  if (tool === "patch" && typeof args.patchText === "string") {
    for (const p of extractPatchPaths(args.patchText)) {
      files.add(path.isAbsolute(p) ? p : path.join(baseDir, p))
    }
  }
  return Array.from(files)
}

export const PostEdit: Plugin = async ({ directory, $ }) => {
  const baseDir = directory ?? process.cwd()

  return {
    "tool.execute.after": async ({ tool }, result) => {
      if (!["write", "edit", "patch"].includes(tool)) return
      const args = (result as { args?: Record<string, any> })?.args ?? {}
      const files = collectFiles(tool, args, baseDir)
      if (!files.length) return

      const errors: string[] = []
      const warnings: string[] = []

      for (const file of files) {
        const exists = await fs
          .stat(file)
          .then((s) => s.isFile())
          .catch(() => false)
        if (!exists) continue

        const rel = path.relative(baseDir, file)

        // Prettier
        const prettierRes = await runCmd($`pnpm prettier --write ${file}`, baseDir)
        if (prettierRes.exitCode !== 0) {
          errors.push(`Prettier failed for ${rel}:\n${prettierRes.stderr || prettierRes.stdout}`)
          continue
        }

        const ext = path.extname(file).toLowerCase()
        const eslintNeeded = [".ts", ".tsx", ".js", ".jsx"].includes(ext)
        const tsCheckNeeded = [".ts", ".tsx"].includes(ext)

        if (eslintNeeded) {
          const eslintRes = await runCmd($`pnpm eslint ${file}`, baseDir)
          if (eslintRes.exitCode !== 0 && (eslintRes.stderr || eslintRes.stdout)) {
            errors.push(`ESLint failed for ${rel}:\n${eslintRes.stderr || eslintRes.stdout}`)
          }
        }

        if (tsCheckNeeded) {
          const tsgo = path.join(baseDir, ".claude/ts/tsgo")
          const tsRes = await runCmd($`${tsgo} --project ${path.join(baseDir, ".claude/ts/tsconfig.json")} --noEmit`, baseDir)
          if (tsRes.exitCode !== 0 && (tsRes.stderr || tsRes.stdout)) {
            errors.push(`TypeScript check failed for ${rel}:\n${tsRes.stderr || tsRes.stdout}`)
          }
        }

        if (ext === ".less") {
          warnings.push(
            [
              `LESS design-system check required for ${rel}:`,
              "- Replace undefined variables with correct ones.",
              "- Replace hardcoded values with design system variables (if available).",
            ].join("\n"),
          )
        }
      }

      if (errors.length || warnings.length) {
        throw new Error([...errors, ...warnings].join("\n\n"))
      }
    },
  }
}

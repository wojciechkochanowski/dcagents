import * as t from "@babel/types";
import type { File } from "@babel/types";

export function ensureNamedImports(
  ast: File,
  items: Array<{ name: string; source: string }>
): void {
  if (items.length === 0) return;

  const existing = new Map<string, Set<string>>();
  const body = ast.program.body;
  let lastImportIndex = -1;

  body.forEach((node, index) => {
    if (t.isImportDeclaration(node)) {
      lastImportIndex = index;
      const source = node.source.value;
      const names = existing.get(source) ?? new Set<string>();
      node.specifiers.forEach((spec) => {
        if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
          names.add(spec.local.name);
        }
      });
      existing.set(source, names);
    }
  });

  const newImports: t.ImportDeclaration[] = [];

  for (const item of items) {
    const already = existing.get(item.source);
    if (already && already.has(item.name)) {
      continue;
    }
    newImports.push(
      t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier(item.name),
            t.identifier(item.name)
          ),
        ],
        t.stringLiteral(item.source)
      )
    );
  }

  if (newImports.length === 0) {
    return;
  }

  if (lastImportIndex === -1) {
    body.unshift(...newImports);
  } else {
    body.splice(lastImportIndex + 1, 0, ...newImports);
  }
}

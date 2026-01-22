import generate from "@babel/generator";
import * as t from "@babel/types";
import { formatTsx } from "../utils/format";
import { writeFile } from "../utils/fs";

interface ComponentWriterOptions {
  name: string;
  jsx: t.JSXElement | t.JSXFragment;
  outputPath: string;
  importBlocks?: string[];
}

export async function writeComponentFile({
  name,
  jsx,
  outputPath,
  importBlocks = [],
}: ComponentWriterOptions): Promise<void> {
  const programBody: t.Statement[] = [createReactImport()];

  // Ensure any image placeholders referenced in the JSX won't throw at runtime.
  const imageNames = Array.from(collectImageIdentifiers(jsx));
  for (const imgName of imageNames) {
    programBody.push(createImagePlaceholder(imgName));
  }

  const uniqueBlocks = Array.from(new Set(importBlocks));
  for (const blockName of uniqueBlocks) {
    programBody.push(createNamedImport(blockName));
  }

  const funcDeclaration = t.exportNamedDeclaration(
    t.functionDeclaration(
      t.identifier(name),
      [],
      t.blockStatement([t.returnStatement(jsx as t.Expression)]),
      false,
      false
    )
  );

  programBody.push(funcDeclaration);

  const fileAst = t.file(t.program(programBody));

  const generated = generate(fileAst, { retainLines: false }).code;
  const formatted = await formatTsx(generated);
  await writeFile(outputPath, formatted);
}

function createReactImport(): t.ImportDeclaration {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier("React"))],
    t.stringLiteral("react")
  );
}

function createNamedImport(name: string): t.ImportDeclaration {
  return t.importDeclaration(
    [t.importSpecifier(t.identifier(name), t.identifier(name))],
    t.stringLiteral(`./${name}`)
  );
}

function createImagePlaceholder(name: string): t.VariableDeclaration {
  const placeholder =
    "data:image/gif;base64,R0lGODlhAQABAAAAACw="; // 1x1 transparent gif
  return t.variableDeclaration("const", [
    t.variableDeclarator(t.identifier(name), t.stringLiteral(placeholder)),
  ]);
}

function collectImageIdentifiers(
  node: t.JSXElement | t.JSXFragment,
): Set<string> {
  const names = new Set<string>();

  function visit(n: t.Node | null | undefined): void {
    if (!n) return;

    if (t.isIdentifier(n) && /^img\w*$/.test(n.name)) {
      names.add(n.name);
      return;
    }

    if (t.isJSXElement(n)) {
      if (n.openingElement) {
        for (const attr of n.openingElement.attributes) {
          if (t.isJSXAttribute(attr) && attr.value) {
            if (t.isJSXExpressionContainer(attr.value)) {
              visit(attr.value.expression);
            }
          }
        }
      }
      n.children.forEach((child) => visit(child));
      return;
    }

    if (t.isJSXFragment(n)) {
      n.children.forEach((child) => visit(child));
      return;
    }

    if (t.isJSXExpressionContainer(n)) {
      visit(n.expression);
      return;
    }

    if (t.isArrayExpression(n)) {
      n.elements.forEach((el) => {
        if (t.isExpression(el)) visit(el);
      });
      return;
    }

    if (t.isObjectExpression(n)) {
      n.properties.forEach((prop) => {
        if (t.isObjectProperty(prop)) {
          visit(prop.value as t.Node);
        }
      });
      return;
    }
  }

  visit(node);
  return names;
}

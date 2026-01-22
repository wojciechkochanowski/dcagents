import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import type { File } from "@babel/types";

export interface RootComponentContext {
  exportName: string;
  jsxPath: NodePath<t.JSXElement | t.JSXFragment>;
}

export function locateRootComponent(ast: File): RootComponentContext {
  let context: RootComponentContext | null = null;

  traverse(ast, {
    ExportDefaultDeclaration(exportPath) {
      if (context) {
        exportPath.stop();
        return;
      }

      const declPath = exportPath.get("declaration");
      const root = extractFromDeclaration(declPath);
      if (root) {
        context = root;
        exportPath.stop();
        return;
      }

      // Handle `export default Component;` where Component is defined elsewhere
      if (declPath.isIdentifier()) {
        const binding = exportPath.scope.getBinding(declPath.node.name);
        if (binding) {
          const bindingPath = binding.path;

          if (bindingPath.isFunctionDeclaration()) {
            const exportName = bindingPath.node.id?.name ?? "Screen";
            const jsxPath = findJsxInFunction(bindingPath);
            if (jsxPath) {
              context = { exportName, jsxPath };
              exportPath.stop();
            }
          }

          if (bindingPath.isVariableDeclarator()) {
            const initPath = bindingPath.get("init");
            if (
              initPath.isFunctionExpression() ||
              initPath.isArrowFunctionExpression()
            ) {
              const exportName = declPath.node.name;
              const jsxPath = findJsxInFunction(
                initPath as NodePath<
                  t.FunctionExpression | t.ArrowFunctionExpression
                >,
              );
              if (jsxPath) {
                context = { exportName, jsxPath };
                exportPath.stop();
              }
            }
          }
        }
      }
    },
    ExportNamedDeclaration(exportPath) {
      if (context) {
        exportPath.stop();
        return;
      }

      const declPath = exportPath.get("declaration");
      if (!declPath.node) {
        return;
      }

      if (declPath.isFunctionDeclaration()) {
        const exportName = declPath.node.id?.name ?? "Screen";
        const jsxPath = findJsxInFunction(declPath);
        if (jsxPath) {
          context = { exportName, jsxPath };
          exportPath.stop();
        }
      }
    },
  });

  if (!context) {
    throw new Error(
      "Unable to find exported component returning JSX in provided source"
    );
  }

  return context;
}

function extractFromDeclaration(
  declPath: NodePath<t.Node>
): RootComponentContext | null {
  if (declPath.isFunctionDeclaration()) {
    const exportName = declPath.node.id?.name ?? "Screen";
    const jsxPath = findJsxInFunction(declPath);
    if (jsxPath) {
      return { exportName, jsxPath };
    }
    return null;
  }

  if (declPath.isFunctionExpression() || declPath.isArrowFunctionExpression()) {
    const exportName = "Screen";
    const jsxPath = findJsxInFunction(declPath);
    if (jsxPath) {
      return { exportName, jsxPath };
    }
    return null;
  }

  return null;
}

function findJsxInFunction(
  fnPath: NodePath<
    | t.FunctionDeclaration
    | t.FunctionExpression
    | t.ArrowFunctionExpression
  >
): NodePath<t.JSXElement | t.JSXFragment> | null {
  if (!t.isBlockStatement(fnPath.node.body)) {
    const bodyPath = fnPath.get("body");
    if (bodyPath.isJSXElement() || bodyPath.isJSXFragment()) {
      return bodyPath as NodePath<t.JSXElement | t.JSXFragment>;
    }
    return null;
  }

  let jsxPath: NodePath<t.JSXElement | t.JSXFragment> | null = null;
  fnPath.get("body").traverse({
    ReturnStatement(returnPath) {
      if (jsxPath) {
        returnPath.stop();
        return;
      }
      const argument = returnPath.get("argument");
      if (
        argument.isJSXElement() ||
        argument.isJSXFragment()
      ) {
        jsxPath = argument as NodePath<t.JSXElement | t.JSXFragment>;
        returnPath.stop();
      }
    },
  });

  return jsxPath;
}

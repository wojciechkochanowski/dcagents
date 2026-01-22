import * as t from "@babel/types";
import { Metrics } from "../types";

export function computeMetrics(node: t.JSXElement | t.JSXFragment): Metrics {
  return walk(node, 1);
}

function walk(node: t.JSXElement | t.JSXFragment, depth: number): Metrics {
  const children = getChildren(node);
  let nodeCount = 1;
  let maxDepth = depth;

  for (const child of children) {
    const childMetrics = walk(child, depth + 1);
    nodeCount += childMetrics.nodeCount;
    maxDepth = Math.max(maxDepth, childMetrics.maxDepth);
  }

  return { nodeCount, maxDepth };
}

export function getChildren(
  node: t.JSXElement | t.JSXFragment
): Array<t.JSXElement | t.JSXFragment> {
  const children: Array<t.JSXElement | t.JSXFragment> = [];
  const rawChildren = t.isJSXElement(node)
    ? node.children
    : node.children ?? [];

  for (const child of rawChildren) {
    if (t.isJSXElement(child) || t.isJSXFragment(child)) {
      children.push(child);
    }
  }

  return children;
}

export function findFigmaNodeId(
  node: t.JSXElement
): string | undefined {
  const opening = node.openingElement;
  for (const attr of opening.attributes) {
    if (
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === "data-figma-id" &&
      attr.value &&
      t.isStringLiteral(attr.value)
    ) {
      return attr.value.value;
    }
  }

  return undefined;
}

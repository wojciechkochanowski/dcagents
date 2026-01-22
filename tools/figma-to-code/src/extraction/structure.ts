import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  BLOCK_NODE_THRESHOLD,
  SECTION_NODE_THRESHOLD,
} from "../config";
import { computeMetrics, findFigmaNodeId } from "../analyzer/jsxMetrics";
import { BlockPlan, SectionPlan } from "../types";

export function extractSections(
  rootPath: NodePath<t.JSXElement | t.JSXFragment>,
  screenName: string
): SectionPlan[] {
  const sections: SectionPlan[] = [];
  const childPaths = rootPath.get("children");
  let sectionIndex = 1;

  childPaths.forEach((childPath) => {
    if (!childPath.isJSXElement()) {
      return;
    }

    const metrics = computeMetrics(childPath.node);
    if (metrics.nodeCount < SECTION_NODE_THRESHOLD) {
      return;
    }

    const sectionName = `${screenName}Section${sectionIndex++}`;
    const figmaNodeId = findFigmaNodeId(childPath.node);
    const clonedElement = t.cloneNode(childPath.node, true);
    const { updatedNode, blocks } = extractBlocks(clonedElement, sectionName);

    sections.push({
      name: sectionName,
      figmaNodeId,
      jsx: updatedNode,
      blocks,
    });

    childPath.replaceWith(createComponentReference(sectionName));
  });

  return sections;
}

function extractBlocks(
  sectionNode: t.JSXElement,
  sectionName: string
): { updatedNode: t.JSXElement; blocks: BlockPlan[] } {
  const blocks: BlockPlan[] = [];
  const newChildren: t.JSXElement["children"] = [];
  let blockIndex = 1;

  for (const child of sectionNode.children) {
    if (t.isJSXElement(child)) {
      const metrics = computeMetrics(child);
      if (metrics.nodeCount >= BLOCK_NODE_THRESHOLD) {
        const blockName = `${sectionName}Block${blockIndex++}`;
        const figmaNodeId = findFigmaNodeId(child);
        blocks.push({
          name: blockName,
          parent: sectionName,
          figmaNodeId,
          jsx: t.cloneNode(child, true),
        });
        newChildren.push(createComponentReference(blockName));
        continue;
      }
    }

    newChildren.push(child);
  }

  sectionNode.children = newChildren;
  return { updatedNode: sectionNode, blocks };
}

function createComponentReference(name: string): t.JSXElement {
  const identifier = t.jsxIdentifier(name);
  return t.jsxElement(
    t.jsxOpeningElement(identifier, [], true),
    null,
    [],
    true
  );
}

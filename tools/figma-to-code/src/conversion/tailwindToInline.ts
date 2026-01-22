import type { File } from "@babel/types";
import * as t from "@babel/types";
import traverse from "@babel/traverse";

const spacingScale: Record<string, string> = {
  "0": "0px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
};

const simpleMap: Record<string, Record<string, string>> = {
  // Display & Layout
  flex: { display: "flex" },
  "inline-flex": { display: "inline-flex" },
  block: { display: "block" },
  "flex-col": { flexDirection: "column" },
  "flex-row": { flexDirection: "row" },
  "items-center": { alignItems: "center" },
  "items-start": { alignItems: "flex-start" },
  "items-end": { alignItems: "flex-end" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "justify-start": { justifyContent: "flex-start" },
  "justify-end": { justifyContent: "flex-end" },
  "content-stretch": { alignContent: "stretch" },

  // Flex properties
  "basis-0": { flexBasis: "0" },
  "flex-none": { flex: "none" },
  grow: { flexGrow: "1" },
  "shrink-0": { flexShrink: "0" },
  "self-stretch": { alignSelf: "stretch" },

  // Position
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  "inset-0": { inset: "0" },
  "top-0": { top: "0" },
  "bottom-0": { bottom: "0" },
  "left-0": { left: "0" },
  "right-0": { right: "0" },
  "left-1/2": { left: "50%" },
  "top-1/4": { top: "25%" },
  "left-1/4": { left: "25%" },
  "right-1/4": { right: "25%" },
  "bottom-1/4": { bottom: "25%" },

  // Text
  "text-center": { textAlign: "center" },
  "text-left": { textAlign: "left" },
  "text-right": { textAlign: "right" },
  "text-nowrap": { whiteSpace: "nowrap" },
  "whitespace-pre": { whiteSpace: "pre" },
  "not-italic": { fontStyle: "normal" },

  // Font
  "font-bold": { fontWeight: "700" },
  "font-semibold": { fontWeight: "600" },
  "font-medium": { fontWeight: "500" },
  "font-normal": { fontWeight: "400" },
  "font-light": { fontWeight: "300" },

  // Colors
  "bg-white": { backgroundColor: "#ffffff" },
  "bg-black": { backgroundColor: "#000000" },
  "bg-gray-100": { backgroundColor: "#f5f5f5" },
  "bg-gray-200": { backgroundColor: "#e5e7eb" },
  "bg-gray-800": { backgroundColor: "#1f2937" },
  "text-white": { color: "#ffffff" },
  "text-black": { color: "#000000" },
  "text-gray-500": { color: "#6b7280" },
  "text-gray-800": { color: "#1f2937" },

  // Border radius
  rounded: { borderRadius: "0.25rem" },
  "rounded-md": { borderRadius: "0.375rem" },
  "rounded-lg": { borderRadius: "0.5rem" },
  "rounded-full": { borderRadius: "9999px" },
  "rounded-[inherit]": { borderRadius: "inherit" },

  // Border
  border: { borderWidth: "1px", borderStyle: "solid" },
  "border-solid": { borderStyle: "solid" },
  "border-dashed": { borderStyle: "dashed" },

  // Sizing
  "w-full": { width: "100%" },
  "h-full": { height: "100%" },
  "size-full": { width: "100%", height: "100%" },
  "w-px": { width: "1px" },
  "h-px": { height: "1px" },
  "min-w-px": { minWidth: "1px" },
  "min-h-px": { minHeight: "1px" },
  "max-w-none": { maxWidth: "none" },

  // Box
  "box-border": { boxSizing: "border-box" },

  // Overflow
  "overflow-hidden": { overflow: "hidden" },
  "overflow-clip": { overflow: "clip" },
  "overflow-ellipsis": { textOverflow: "ellipsis" },

  // Cursor
  "cursor-pointer": { cursor: "pointer" },

  // Transform
  "translate-x-[-50%]": { transform: "translateX(-50%)" },
  "translate-y-[-50%]": { transform: "translateY(-50%)" },
  "rotate-[90deg]": { transform: "rotate(90deg)" },
  "rotate-[180deg]": { transform: "rotate(180deg)" },
  "scale-y-[-100%]": { transform: "scaleY(-1)" },

  // Margin negative
  "mr-[-1px]": { marginRight: "-1px" },
  "pr-px": { paddingRight: "1px" },

  // Z-index
  "z-[1]": { zIndex: "1" },
  "z-[2]": { zIndex: "2" },

  // Shadow
  shadow: {
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
  },
  "shadow-md": {
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  },
  "shadow-lg": {
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
  },
};

export interface TailwindConversionResult {
  unmappedClasses: Set<string>;
}

export function convertTailwindToInline(ast: File): TailwindConversionResult {
  const unmappedClasses = new Set<string>();

  traverse(ast, {
    JSXAttribute(path) {
      if (!t.isJSXIdentifier(path.node.name)) return;
      if (path.node.name.name !== "className") return;

      const valueNode = path.node.value;
      if (!valueNode) return;

      if (!t.isStringLiteral(valueNode)) {
        unmappedClasses.add("<dynamic>");
        return;
      }

      const classList = valueNode.value
        .split(/\s+/)
        .map((cls) => cls.trim())
        .filter(Boolean);

      if (classList.length === 0) {
        path.remove();
        return;
      }

      const styleRecord: Record<string, string> = {};

      for (const cls of classList) {
        const mapped = mapClassToStyle(cls);
        if (!mapped) {
          unmappedClasses.add(cls);
          continue;
        }
        Object.assign(styleRecord, mapped);
      }

      const styleProperties = Object.entries(styleRecord).map(([key, value]) =>
        t.objectProperty(t.identifier(key), t.stringLiteral(value)),
      );

      if (styleProperties.length === 0) {
        return;
      }

      const openingElement = path.parentPath;
      if (!openingElement.isJSXOpeningElement()) {
        return;
      }

      const existingStyleIndex = openingElement.node.attributes.findIndex(
        (attr) =>
          t.isJSXAttribute(attr) &&
          t.isJSXIdentifier(attr.name) &&
          attr.name.name === "style",
      );

      if (existingStyleIndex >= 0) {
        const attr = openingElement.node.attributes[existingStyleIndex];
        if (
          t.isJSXAttribute(attr) &&
          attr.value &&
          t.isJSXExpressionContainer(attr.value) &&
          t.isObjectExpression(attr.value.expression)
        ) {
          const existing = attr.value.expression;
          for (const prop of styleProperties) {
            existing.properties.push(prop);
          }
          path.remove();
          return;
        }
        // If style attribute already exists but isn't an object literal we leave className intact.
        return;
      } else {
        openingElement.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("style"),
            t.jsxExpressionContainer(t.objectExpression(styleProperties)),
          ),
        );
        path.remove();
        return;
      }
    },
  });

  return { unmappedClasses };
}

function mapClassToStyle(cls: string): Record<string, string> | null {
  if (simpleMap[cls]) {
    return simpleMap[cls];
  }

  const spacingMatch =
    /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-([0-9.]+)$/.exec(cls);
  if (spacingMatch) {
    const [, prefix, size] = spacingMatch;
    const value = spacingScale[size];
    if (!value) {
      return null;
    }

    switch (prefix) {
      case "p":
        return { padding: value };
      case "px":
        return { paddingLeft: value, paddingRight: value };
      case "py":
        return { paddingTop: value, paddingBottom: value };
      case "pt":
        return { paddingTop: value };
      case "pr":
        return { paddingRight: value };
      case "pb":
        return { paddingBottom: value };
      case "pl":
        return { paddingLeft: value };
      case "m":
        return { margin: value };
      case "mx":
        return { marginLeft: value, marginRight: value };
      case "my":
        return { marginTop: value, marginBottom: value };
      case "mt":
        return { marginTop: value };
      case "mr":
        return { marginRight: value };
      case "mb":
        return { marginBottom: value };
      case "ml":
        return { marginLeft: value };
      default:
        return null;
    }
  }

  // Padding/margin with px literal: py-px, mx-px, etc.
  const spacingPxMatch = /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-px$/.exec(
    cls,
  );
  if (spacingPxMatch) {
    const [, prefix] = spacingPxMatch;
    const value = "1px";
    switch (prefix) {
      case "p":
        return { padding: value };
      case "px":
        return { paddingLeft: value, paddingRight: value };
      case "py":
        return { paddingTop: value, paddingBottom: value };
      case "pt":
        return { paddingTop: value };
      case "pr":
        return { paddingRight: value };
      case "pb":
        return { paddingBottom: value };
      case "pl":
        return { paddingLeft: value };
      case "m":
        return { margin: value };
      case "mx":
        return { marginLeft: value, marginRight: value };
      case "my":
        return { marginTop: value, marginBottom: value };
      case "mt":
        return { marginTop: value };
      case "mr":
        return { marginRight: value };
      case "mb":
        return { marginBottom: value };
      case "ml":
        return { marginLeft: value };
      default:
        return null;
    }
  }

  const gapMatch = /^gap-([0-9.]+)$/.exec(cls);
  if (gapMatch) {
    const [, size] = gapMatch;
    const value = spacingScale[size];
    return value ? { gap: value } : null;
  }

  const textSizeMatch = /^text-(xs|sm|base|lg|xl|2xl)$/.exec(cls);
  if (textSizeMatch) {
    const [, size] = textSizeMatch;
    const sizeMap: Record<string, string> = {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    };
    return { fontSize: sizeMap[size] };
  }

  const fontColorArbitrary = /^text-\[(#[0-9a-fA-F]{6})\]$/.exec(cls);
  if (fontColorArbitrary) {
    return { color: fontColorArbitrary[1] };
  }

  const bgColorArbitrary = /^bg-\[(#[0-9a-fA-F]{6})\]$/.exec(cls);
  if (bgColorArbitrary) {
    return { backgroundColor: bgColorArbitrary[1] };
  }

  // Arbitrary gap: gap-[Xpx] or gap-[var(...)]
  const gapArbitrary = /^gap-\[(.+)\]$/.exec(cls);
  if (gapArbitrary) {
    return { gap: extractValue(gapArbitrary[1]) };
  }

  // Arbitrary padding/margin: p-[Xpx], px-[Xpx], py-[Xpx], etc.
  const spacingArbitrary =
    /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-\[(.+)\]$/.exec(cls);
  if (spacingArbitrary) {
    const [, prefix, value] = spacingArbitrary;
    const cssValue = extractValue(value);

    switch (prefix) {
      case "p":
        return { padding: cssValue };
      case "px":
        return { paddingLeft: cssValue, paddingRight: cssValue };
      case "py":
        return { paddingTop: cssValue, paddingBottom: cssValue };
      case "pt":
        return { paddingTop: cssValue };
      case "pr":
        return { paddingRight: cssValue };
      case "pb":
        return { paddingBottom: cssValue };
      case "pl":
        return { paddingLeft: cssValue };
      case "m":
        return { margin: cssValue };
      case "mx":
        return { marginLeft: cssValue, marginRight: cssValue };
      case "my":
        return { marginTop: cssValue, marginBottom: cssValue };
      case "mt":
        return { marginTop: cssValue };
      case "mr":
        return { marginRight: cssValue };
      case "mb":
        return { marginBottom: cssValue };
      case "ml":
        return { marginLeft: cssValue };
      default:
        return null;
    }
  }

  // Arbitrary width/height: w-[Xpx], h-[Xpx]
  const widthArbitrary = /^w-\[(.+)\]$/.exec(cls);
  if (widthArbitrary) {
    return { width: extractValue(widthArbitrary[1]) };
  }

  const heightArbitrary = /^h-\[(.+)\]$/.exec(cls);
  if (heightArbitrary) {
    return { height: extractValue(heightArbitrary[1]) };
  }

  // Arbitrary size: size-[Xpx] (width + height)
  const sizeArbitrary = /^size-\[(.+)\]$/.exec(cls);
  if (sizeArbitrary) {
    const value = extractValue(sizeArbitrary[1]);
    return { width: value, height: value };
  }

  // Arbitrary border-radius: rounded-[Xpx] or rounded-[var(...)]
  const roundedArbitrary = /^rounded-\[(.+)\]$/.exec(cls);
  if (roundedArbitrary) {
    return { borderRadius: extractValue(roundedArbitrary[1]) };
  }

  // Arbitrary border-radius per corner: rounded-tl-[...], rounded-tr-[...], etc.
  const roundedCorner = /^rounded-(tl|tr|bl|br)-\[(.+)\]$/.exec(cls);
  if (roundedCorner) {
    const [, corner, value] = roundedCorner;
    const cssValue = extractValue(value);
    const cornerMap: Record<string, string> = {
      tl: "borderTopLeftRadius",
      tr: "borderTopRightRadius",
      bl: "borderBottomLeftRadius",
      br: "borderBottomRightRadius",
    };
    return { [cornerMap[corner]]: cssValue };
  }

  // Arbitrary positioning: top-[...], left-[...], right-[...], bottom-[...]
  const positionArbitrary = /^(top|left|right|bottom)-\[(.+)\]$/.exec(cls);
  if (positionArbitrary) {
    const [, side, value] = positionArbitrary;
    return { [side]: extractValue(value) };
  }

  // Arbitrary inset: inset-[...]
  const insetArbitrary = /^inset-\[(.+)\]$/.exec(cls);
  if (insetArbitrary) {
    // Tailwind uses _ as separator, convert to spaces for CSS
    const value = insetArbitrary[1].replace(/_/g, " ");
    return { inset: value };
  }

  // Arbitrary background color with rgba or var: bg-[rgba(...)] or bg-[var(...)]
  const bgArbitrary = /^bg-\[(.+)\]$/.exec(cls);
  if (bgArbitrary) {
    return { backgroundColor: extractValue(bgArbitrary[1]) };
  }

  // Arbitrary font size: text-[Xpx], text-[length:var(...)] (must come before text color)
  const textSizeArbitrary = /^text-\[(?:length:)?(.+)\]$/.exec(cls);
  if (textSizeArbitrary) {
    return { fontSize: extractValue(textSizeArbitrary[1]) };
  }

  // Arbitrary text color: text-[#...], text-[color:var(...)]
  const textColorArbitrary = /^text-\[(?:color:)?(.+)\]$/.exec(cls);
  if (textColorArbitrary) {
    const raw = textColorArbitrary[1];
    if (raw.startsWith("length:")) {
      // Some exports encode font-size as text-[length:var(...)] but hit this branch
      return { fontSize: extractValue(raw.replace(/^length:/, "")) };
    }
    return { color: extractValue(raw) };
  }

  // Arbitrary line-height: leading-[Xpx], leading-[var(...)]
  const leadingArbitrary = /^leading-\[(.+)\]$/.exec(cls);
  if (leadingArbitrary) {
    const value = leadingArbitrary[1];
    if (value === "normal") return { lineHeight: "normal" };
    if (value === "0") return { lineHeight: "0" };
    return { lineHeight: extractValue(value) };
  }

  // Arbitrary border: border-[color], border-[Xpx_Xpx_Xpx_Xpx]
  const borderArbitrary = /^border-\[(.+)\]$/.exec(cls);
  if (borderArbitrary) {
    const value = borderArbitrary[1];
    // Check if it's a border shorthand (e.g., "1px_0px_0px")
    if (value.includes("_")) {
      return { border: value.replace(/_/g, " ") };
    }
    // Otherwise it's a color
    return { borderColor: extractValue(value) };
  }

  // Arbitrary shadow: shadow-[...]
  const shadowArbitrary = /^shadow-\[(.+)\]$/.exec(cls);
  if (shadowArbitrary) {
    return { boxShadow: shadowArbitrary[1].replace(/_/g, " ") };
  }

  // Arbitrary font-family: font-[family-name:var(...)] or font-['...']
  const fontFamilyArbitrary = /^font-\[(?:family-name:)?(.+)\]$/.exec(cls);
  if (fontFamilyArbitrary) {
    return { fontFamily: extractValue(fontFamilyArbitrary[1]) };
  }

  return null;
}

/**
 * Extracts CSS value from Tailwind arbitrary value syntax.
 * Handles: var(...), rgba(...), plain values, calc(...)
 */
function extractValue(value: string): string {
  // Remove quotes if present
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }

  // Handle explicit length: prefixes (seen in exports like text-[length:var(...)] or color:length:...)
  if (value.startsWith("length:")) {
    value = value.replace(/^length:/, "");
  }

  // Handle CSS variables: var(--background\/bg-active,#e9edff)
  // Tailwind uses \/ for /, we need to convert back
  if (value.startsWith("var(")) {
    const normalized = value.replace(/\\\//g, "/");
    const match = /^var\\([^,]+,(.+)\\)$/.exec(normalized);
    if (match) {
      // Fallback present: use fallback (trim spaces)
      return match[1].trim();
    }
    return normalized;
  }

  // Handle rgba, calc, etc. - return as-is
  if (
    value.startsWith("rgba(") ||
    value.startsWith("calc(") ||
    value.startsWith("rgb(")
  ) {
    return value;
  }

  // Handle hex colors
  if (value.startsWith("#")) {
    return value;
  }

  // Plain values (10px, 50%, etc.)
  return value;
}

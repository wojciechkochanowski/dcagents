# Figma Workflow

## 🚨 CRITICAL: Figma Access Error Handling

**If Figma tools return errors or cannot access the specified node/design:**

- **STOP ALL WORK IMMEDIATELY** when any Figma error occurs
- **REPORT ERROR TO USER** - include error description and original Figma URL attempted
- **HALT ALL ACTIONS** - no further work until user responds
- **ZERO ALTERNATIVE APPROACHES** - no searching, no assumptions, no workarounds
- **COMPLETE WORKFLOW SUSPENSION** until explicit user instruction

Common errors:

- Node not found (document not open, wrong node ID)
- Figma desktop app not running
- Document access issues

## 1. MCP Figma Integration

### Step 1: Visual Context Analysis

- **Fetch IMAGE first** using `get_screenshot` - shows full screen/context view
- **Describe what you see** - overall layout, components present, visual hierarchy
- **Confirm implementation scope** with user before proceeding

### Step 2: Structure Analysis

- **Fetch METADATA using `get_metadata`** - returns XML structure with:
  - All node IDs in the design
  - Layer names and types
  - Positions and dimensions
  - Hierarchy relationships
- **Locate target component** - search metadata for relevant layer names/positions
- **Extract nodeId** for specific component you need to implement
- **If multiple components needed** - collect all relevant nodeIds

### Step 3: Code Extraction

- **Fetch CODE using `get_code` with specific nodeId** - returns only target component
- **Repeat for each component** if implementing multiple elements
- **Note design specifications** - colors, spacing, dimensions, typography from code
- **Extract only what's needed** - ignore unrelated screen areas

### Step 4: Implementation

- 🚨 **MANDATORY: Search `design-token-mapping.json` for EVERY value before writing LESS code**
- **Follow all instructions** from `C:/praca/datacapt/dcagents/instructions/react-components.md` and `C:/praca/datacapt/dcagents/instructions/less-styles.md`
- **Use correct variables** from `C:/praca/datacapt/dcagents/instructions/design-system.md` ONLY as fallback when not in mapping.json
- **Use existing components** from Ant Design and common/components
- **Implement extracted fragment only** - not entire screen

### Step 5: Design Fidelity Verification

- **Compare with BOTH sources**: fetched screenshot (visual reference) + extracted code (specifications)
- **Verify exact match**: layout, spacing, colors, dimensions, typography
- **Check visual hierarchy** - element positioning, sizing relationships
- **Validate responsive behavior** if applicable
- **Fix ALL discrepancies** before proceeding

## 3. Critical Design Fidelity Requirements

**PIXEL-PERFECT ACCURACY MANDATORY**

- **Spacing**: Exact margins, padding, gaps between elements
- **Colors**: Precise hex values, opacity levels, gradients
- **Typography**: Font sizes, weights, line heights, letter spacing
- **Dimensions**: Component widths, heights, border radius
- **Alignment**: Element positioning, visual balance
- **Visual hierarchy**: Z-index, layering, prominence

**Verification Process**:

1. **Side-by-side comparison** - Figma screenshot vs live implementation
2. **Measure discrepancies** - identify ANY differences
3. **Iterative refinement** - fix until perfect match achieved
4. **Cross-reference code specs** - validate against extracted Figma code

## 4. Available MCP Figma Tools

### Primary Workflow Tools:

1. `get_screenshot` - **USE FIRST** - Visual context and reference
2. `get_metadata` - **USE SECOND** - Structure analysis, find nodeIds
3. `get_code` - **USE THIRD** - Extract code for specific nodeId(s)

### Additional Tools:

- `get_variable_defs` - Design system variables/tokens
- `get_code_connect_map` - Map to existing components (requires setup)

### Required Parameters:

- `nodeId` - Optional for screenshot/metadata (uses selected node), required for specific component extraction (format: "123:456" or "123-456")
- `clientLanguages` - "typescript,javascript"
- `clientFrameworks` - "react"
- `forceCode` - (get_code only) Set true to force full code return for large outputs

### Tool Details:

**`get_metadata`** returns XML with:

```xml
<node id="123:456" type="FRAME" name="Button Primary" x="100" y="200" width="120" height="40">
  <node id="123:457" type="TEXT" name="Label" .../>
</node>
```

Use metadata to:

- Find components by name
- Get precise nodeIds for targeted code extraction
- Understand component hierarchy
- Identify multiple components in single screen

## 5. Tailwind to LESS Conversion

Figma `get_code` returns Tailwind classes. **Don't map classes directly** - extract pixel/hex values and find matching design system variables.

### Mandatory Token Mapping Prep

🚨 **CRITICAL: ALWAYS search `design-token-mapping.json` FIRST before using any variables or mixins**

1. **Search `instructions/design-token-mapping.json` for EVERY Figma value**

   **CRITICAL: Use Grep tool for efficient searching (file has 2400+ lines)**

   Search strategies for ALL conversions:

   - **By Tailwind class**: `grep "gap-4" instructions/design-token-mapping.json`
   - **By hex color**: `grep "#3a63f3" instructions/design-token-mapping.json`
   - **By pixel value**: `grep "16px" instructions/design-token-mapping.json`
   - **By CSS property**: `grep "padding" instructions/design-token-mapping.json`
   - **By Tailwind typography**: `grep "font-medium.*12px" instructions/design-token-mapping.json`
   - **By Figma Dev Mode vars**: `grep "bg-\\[var\\(--background" instructions/design-token-mapping.json`

   From matching entry, record:

   - `token` - design system variable to use
   - `lessSnippet` - recommended LESS code

   **DO NOT skip this step** - even if you think you know the variable from documentation

2. **Missing entry fallback workflow**

   If mapping not found:

   - **DO NOT halt work** - mapping may be incomplete
   - **Extract raw values** from Figma code (px values, hex colors)
   - **Find matching variable** in `design-system.md`:
     - Match exact pixel values to spacing scale (@xs, @md, @xl, etc.)
     - Match hex colors to color palette or semantic tokens
     - Match font-size + font-weight to typography mixins
   - **Validate variable exists** in `generated-tokens.ts`
   - **Document gap** in response: "Missing mapping for [value] - used [token] based on design-system.md"

### Conversion Process

1. **Search mapping first**

   - Use Grep tool to find Figma value in `design-token-mapping.json`
   - If found: use `token` and `lessSnippet` from entry
   - If not found: follow fallback workflow above

2. **Identify computed values** from Figma code

   - Spacing: 8px, 16px, 24px
   - Colors: #3a63f3, #727385, #ffffff
   - Font sizes: 14px, 16px, 20px
   - Border radius: 8px, 12px

3. **Find matching design system variables**

   - First check: mapping entry from step 1
   - Fallback: `C:/praca/datacapt/dcagents/instructions/design-system.md` direct lookup
   - Prefer semantic over primitive: `@fg-primary` vs `@gray-1000`
   - All variables must exist in `generated-tokens.ts`

4. **Use typography mixins** instead of manual properties

   - **FIRST**: Search mapping.json for font-size + font-weight combination
   - **If not in mapping**: Check available mixins in `common/styles/design-system/typography/`
   - **NEVER invent mixin names** - only use existing mixins
   - Replace `font-size` + `font-weight` with `.body-md()`, `.heading-xs()`, etc.

5. **Apply BEM structure** to className

### Common Patterns (REFERENCE ONLY - Always search mapping.json first!)

⚠️ **These are examples only. DO NOT use directly without searching `design-token-mapping.json` first.**

**Spacing (examples):**

- 8px → `@xs`
- 16px → `@md`
- 24px → `@xl`
- 32px → `@2xl`
- Full reference: `design-system.md` (spacing scales from `@4xs` to `@11xl`)

**Typography (use mixins - verify they exist!):**

Available mixins (check `common/styles/design-system/typography/body.less` for actual definitions):

- 12px regular (weight 500) → `.body-xs()`
- 12px semibold (weight 600) → `.body-xs-emphasis()`
- 14px regular (weight 500) → `.body-sm()`
- 14px semibold (weight 600) → `.body-sm-emphasis()`
- 16px regular (weight 500) → `.body-md()`
- 16px semibold (weight 600) → `.body-md-emphasis()`
- 16px heading → `.heading-xs()`
- 20px heading → `.heading-sm()`
- 24px heading → `.heading-md()`
- 32px heading → `.heading-lg()`

**DO NOT create or use mixins not listed above** - if you need different typography, use manual CSS properties

**Colors (semantic preferred):**

- Dark text (#060a32) → `@fg-primary`
- Secondary text (#727385) → `@fg-secondary`
- Tertiary text (#9697ac) → `@fg-tertiary`
- White background → `@bg-primary`
- Light gray background → `@bg-secondary` or `@bg-tertiary`
- Brand blue (#3a63f3) → `@fg-brand-primary` or `@bg-brand-solid`
- Error red → `@fg-error-primary` or `@bg-error-solid`
- Standard border → `@border-primary`
- Light border → `@border-secondary`

**Border radius:**

- 4px → `@border-radius-2xs`
- 8px → `@border-radius-xs`
- 12px → `@border-radius-sm`
- 16px → `@border-radius-md`
- Circles → `@border-radius-full`

**Shadows:**

- Subtle → `@shadow-xs`
- Standard → `@shadow-sm`
- Elevated → `@shadow-md`
- Modal/overlay → `@shadow-lg` or `@shadow-xl`

### Conversion Example

**Figma Tailwind output:**

```jsx
<div className="flex gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-base text-gray-600">Description text</p>
</div>
```

**Analysis:**

- `gap-4` = 16px → `@md`
- `p-6` = 24px → `@xl`
- `bg-white` → `@bg-primary`
- `rounded-lg` = 12px → `@border-radius-sm`
- `shadow-md` → `@shadow-md`
- `border-gray-200` → `@border-secondary`
- `text-xl font-semibold` = 20px/600 → `.heading-sm()`
- `text-base` = 16px → `.body-md()`
- `text-gray-900` → `@fg-primary`
- `text-gray-600` → `@fg-secondary`

**Datacapt LESS implementation:**

```less
@import "common/styles/variables.less";

.component {
  display: flex;
  gap: @md;
  padding: @xl;
  background: @bg-primary;
  border-radius: @border-radius-sm;
  box-shadow: @shadow-md;
  border: 1px solid @border-secondary;

  &__title {
    .heading-sm();
    color: @fg-primary;
  }

  &__description {
    .body-md();
    color: @fg-secondary;
  }
}
```

### Reference Documentation

**Complete variable lists:**

- `C:/praca/datacapt/dcagents/instructions/design-system.md` - Full reference with all variables
- `C:/praca/datacapt/frontend/apps/storybook/src/generated-tokens.ts` - Authoritative source

**Always validate:**

- Variable exists in `generated-tokens.ts`
- Semantic variable preferred over primitive
- Typography mixin used instead of manual properties

## 6. Best Practices

- **Check design tokens** - use design system variables when available
- **Leverage existing components** when possible
- **Create reusable components** for new patterns
- **Maintain accessibility** - ARIA labels, keyboard navigation

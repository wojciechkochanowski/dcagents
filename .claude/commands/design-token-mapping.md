---
description: Maps Figma/Tailwind values to design-system tokens.
---

## Design Token Mapping Command

Command trigger: **`design-token-mapping $ARGUMENTS`**

### Input Requirements

- Figma URL containing the file key and explicit `node-id`
- Short note on design context (screen, component name) if available

### 0. Preconditions

- Mapping work always happens **before** any UI implementation
- `instructions/design-token-mapping.json` is the single source of truth; never guess tokens
- Changes must keep JSON sorted by `category`, then `sourceDescriptor`

### 1. Intake & Scope

1. Confirm you received a valid Figma link + nodeId. If anything is missing, stop and ask.
2. Create/append a task note (plan doc, worklog, or active checklist) with status **“mapping in progress”**, record nodeId + URL.
3. Review existing plan instructions relevant to the screen/module.

### 2. Data Collection (Figma)

1. Run `get_screenshot` to capture full visual context.
2. Run `get_metadata` to understand hierarchy and confirm nodeId(s).
3. Run `get_code` (or `get_design_context` when needed) to obtain Tailwind classes + inline styles.
4. If any tool fails or returns nothing, halt and escalate to the user.

### 3. Token Extraction

1. List every unique Tailwind class and inline value (spacing, colors, radii, typography, shadows, misc).
2. Group entries by category (`spacing`, `color`, `typography`, etc.).
3. Cross-check existing `instructions/design-token-mapping.json` entries for each value.

### 4. Dictionary Update

1. For values already covered, link the relevant `token`/`lessSnippet` in your working notes—avoid duplicate entries.
2. For gaps:
   - Determine the correct category (`border`, `color`, `radius`, `shadow`, `spacing`, `typography`).
   - Capture exact Figma/Tailwind value (px, hex, rgba, etc.) and literal `tailwindSource` string.
   - **tailwindSource rules**:
     - If Tailwind class exists (e.g., `gap-4`, `text-xl`, `bg-blue-600`): use exact class string
     - If inline style/Figma variable (e.g., `var(--spacing-md)`, raw hex): leave empty string `""`
   - Choose an existing design-system token when possible; if none exists, note the absence in `notes` and sync with design leads.
   - Add new objects to `instructions/design-token-mapping.json` with fields:
     ```json
     {
       "category": "spacing",
       "sourceDescriptor": "Figma gap medium (16px)",
       "tailwindSource": "gap-4",
       "figmaValue": "16px",
       "token": "@md",
       "lessSnippet": "gap: @md;",
       "notes": ""
     }
     ```
   - **Sorting rules**:
     - Group by `category` (alphabetical: border → color → radius → shadow → spacing → typography)
     - Within category, sort by `sourceDescriptor` (case-insensitive alphabetical)
     - Use Grep tool to find insertion point: `grep -n '"category": "spacing"' design-token-mapping.json`
3. Update notes when approximations or non-semantic tokens are unavoidable (e.g., "Closest semantic match available").

### 5. Validation & Double-Check

**JSON Syntax Validation:**

1. Use built-in JSON linter: `grep -E '^\s*"[^"]+": "[^"]*",$' design-token-mapping.json` to check syntax
2. Test parse: Read file with JSON-aware tool to catch malformed entries
3. Verify no trailing commas on last array item

**Content Validation:**

1. Manual review pass #1: iterate category-by-category comparing entries against design-system source values
2. Check each new `token` exists in `frontend/apps/storybook/src/generated-tokens.ts`
3. Verify `lessSnippet` uses correct LESS syntax (variables start with `@`, no semicolon if property value only)
4. Manual review pass #2: reverse order review, verify aliases and `lessSnippet` correctness, annotate discrepancies in `notes`
5. Record completion in the task note/checklist as **`Mapping update double-checked — [initials] YYYY-MM-DD`**

### 6. Hand-Off

1. Share a brief summary: updated categories, notable approximations, outstanding questions.
2. Confirm that `instructions/design-token-mapping.json` contains the required mappings before any coding continues.
3. Do **not** proceed to UI implementation within this command—hand back to the primary workflow once mapping is locked.

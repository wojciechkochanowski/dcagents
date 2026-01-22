---
description: Checklist for typecheck, lint, and formatting validation.
---

# Code Validation Workflow

**IMPORTANT**: Use TodoWrite to track all 7 workflow steps and execute them sequentially.

## 1. Design System Validation (LESS files only)

**When \*.less files were changed**

1. **Check design system variables** used in changed LESS files
2. **Verify against** `~/work/datacapt/dcagents/instructions/design-system.md`
3. **Immediately fix violations**:
   - Replace undefined variables with correct ones
   - Replace non-existent mixins with valid alternatives
   - Convert hardcoded values to design system variables if possible

## 2. Unused LESS Classes (LESS files only)

**When \*.less files were changed**

1. **Identify all CSS classes** defined in the changed LESS file
2. **Search for usage** of each class in related component files (.tsx)
3. **Remove unused classes** - if a class is not referenced in any component, delete it
4. **Check nested classes** - parent class may be used but nested selectors might be orphaned

**How to check:**

```bash
# For each class in LESS file, verify it's used in components
grep -r "className.*class-name" --include="*.tsx" [component-directory]
```

## 3. Check if there is no unused code and variables

- all leftover code should be removed
- we can't have any underscored unused variables
- we can't have any unused imports
- immediately fix all violations

## 4. Check if there are any unnecessary comments

- we need only comments that are crucial for understanding extremely complicated code, and TODOs
- all needed comments should be in english
- immediately fix all violations

## 5. TypeScript Check

```bash
.claude/ts/tsgo --project .claude/ts/tsconfig.json --noEmit
```

**Run only** when modifying _.ts, _.tsx files
**Fix all errors** before proceeding

## 6. ESLint Validation

```bash
pnpm eslint [path_to_changed_file]
```

**Run only** when modifying _.ts, _.tsx, \*.less files
**Fix all errors** before proceeding

## 7. Prettier Formatting

```bash
npx prettier --write [path_to_changed_file]
```

**Run only** on _.ts, _.tsx, \*.less files
**Never manually adjust** Prettier output - it knows better

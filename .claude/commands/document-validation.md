---
description: Validates documentation against app state or planned changes.
---

# Document Validation Command

When this command is invoked, follow this workflow:

## 1. Determine Validation Type

Ask: "Is this describing **current app state** or **new functionality** to be implemented?"

## 2. Gather Input

Ask user to provide one of:

- User story number (will fetch using @ac.md command)
- File path to document
- Direct text paste

## 3. Research Phase

**Always read first:** `@C:/praca/datacapt/ai-validation-docs/README.md`

Based on README guidance:

- Identify relevant domain area
- Select minimal set of documentation files needed
- Read only necessary files (never bulk-read everything)

**If documentation is insufficient:** Check actual code (components, API requests, etc.)

**If README link is broken:** Report error and request correct path from Import section

## 4. Validation Output Format

**Always use this format for all validation types:**

### Structure

For each issue identified:

#### Text to highlight

[Exact text from document, stripped of all formatting]

#### Comment

[Detailed explanation in English for product manager]

---

### Text to Highlight Rules

- Exact character-for-character match from source document
- Remove ALL formatting (bold, italic, links, colors, etc.)
- Must be searchable with Ctrl+F
- Long enough to be unique in document

### Comment Guidelines

- English language (audience: product manager)
- Friendly, collaborative tone ("Consider adding...", "It might be helpful...")
- Explain why it matters for customers/users
- Provide specific, actionable suggestions
- **Reference actual application elements** (UI screens, API endpoints, data models, permissions)
- **Never reference validation documentation files** (e.g., don't mention "17-allocation-kits.md" - manager doesn't know these exist)
- Include examples or clarifications that should be added
- **Plain text only - no markdown formatting** (no bold, italic, lists, tables, code blocks - destination unknown, formatting may not be supported)

### Validation Focus by Type

**Current State Validation:**

- Discrepancies between document and actual application behavior
- Missing UI elements or workflows
- Incorrect descriptions of features
- Outdated information

**New Functionality Validation:**

- Missing acceptance criteria
- Technical constraints or blockers
- Integration points with existing features
- Required data model changes
- Permission/audit trail implications
- Unclear or ambiguous requirements
- Missing edge cases or error scenarios

## 5. Save Output

After completing validation analysis:

1. **Create markdown file** in `C:/praca/datacapt/tmp/` directory
2. **Filename format:** `validation-{topic}-{date}.md` (e.g., `validation-allocation-2025-10-02.md`)
3. **Content:** Full validation report with all "Text to highlight" and "Comment" sections
4. **Inform user:** Provide the filename and path to the saved report

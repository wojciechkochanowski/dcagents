---
description: Translation validation and targeted fixes workflow.
---

## Translation Command (tr)

Execute via sub-agent translation-manager

**AUTOMATION**: Use `C:/praca/llm/language-check-tool/language-check-tool` for all analysis

**CRITICAL**: Translation files are very long - use `edit` tool only for adding specific lines instead of reading entire files.
**Strategy**: Use validation script for analysis, target specific issues identified in script output, use `edit` to add specific lines.

**FORBIDDEN OPERATIONS**:

- ❌ NEVER USE NODE/PY COMMANDS for translations
- ❌ NEVER USE complex bash with `&&` `||` `for` operators
- ❌ NEVER USE sed/awk/perl commands on JSON files
- ❌ NEVER READ entire JSON files (4000+ keys each)
- ❌ NEVER CREATE backup files (.bak, .bak2, etc.)

**REQUIRED STRATEGY**: Fragmentary file handling

- Use `grep` to find insertion points
- Use `edit` tool ONLY for JSON modifications
- Execute commands sequentially, never in combination

### 1. Translation Analysis

```bash
C:/praca/llm/language-check-tool/language-check-tool
```
(just run it, there is no options)
Performs complete validation: JSON syntax, missing keys, json and formatting errors.

### 2. Interpret Analysis Results

#### a. If exit code 0 → "All translations complete and valid" → end

#### b. If exit code 1 (warnings):

- **Missing keys detected**: New keys in `en.json` need translation
- **Empty values found**: Existing translations incomplete
- Use detailed output to identify specific issues per language

#### c. If exit code 2 (errors): JSON syntax issues must be fixed first

#### d. After fixing errors, re-run:

```bash
C:/praca/llm/language-check-tool/language-check-tool                         # Show missing keys and errors
```

If no issues found → end with "translations are complete"
If fixes needed → "identified translation issues, proceeding with fixes"
If new translations needed → proceed to step 3

### 3. Add/Fix Translations in All Language Files

For each new `en.json` key:
**French (`fr.json`)**: Add exact same English text
**Other languages**: Add translated text:

- `de.json` - German, `es.json` - Spanish, `it.json` - Italian, `ja.json` - Japanese, `pl.json` - Polish, `pt.json` - Portuguese, `zh.json` - Chinese

### 4. Final Message

Display brief English message only. One sentence, max 15 words.

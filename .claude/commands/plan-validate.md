---
description: Validates a task plan for completeness and rules compliance.
---

## Validate Plan Command

### 1. Get Current Task Name

**If $ARGUMENTS is numeric:**

```bash
~/work/llm/workitem-tool/workitem-tool $ARGUMENTS
```

Main header = task title

**If $ARGUMENTS is non-numeric (e.g., "reports-settings-1"):**

- Skip workitem-tool
- Task directory = `~/work/datacapt/dcagents/work-items/$ARGUMENTS/`

**If $ARGUMENTS is empty/not provided:**

- Extract task number from current git branch name (e.g., `bugfix/19181-description` → `19181`)
- Run `~/work/llm/workitem-tool/workitem-tool <extracted_number>`
- The tool cannot extract numbers automatically - always provide explicitly

### 2. Check Task Description and Plan

Navigate to `cd ~/work/datacapt/dcagents/work-items/[task]/`
Files: `requirements.md`, `implementation.md`, `todo.md`
Format may be: `16952-Emergency-Unblinding` - **number must match**

### 3. Check Work Rules

- **Review all rules** from CLAUDE.md and `~/work/datacapt/dcagents/instructions/` relevant to plan
- **Check sub-agent rules** in `~/work/datacapt/dcagents/.claude/agents/`

### 4. Fix Plan if Necessary

- **Update implementation.md** to satisfy both requirements.md AND all project work rules
- **If everything OK** - no changes needed

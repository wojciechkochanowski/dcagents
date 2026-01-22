---
description: Performs QA review against acceptance criteria and recent changes.
---

## Quality Assurance Command

When user types **'qa'**, execute these steps:

**CRITICAL**: **NEVER implement changes without asking** - show diff and ask for confirmation.

### 1. Get Current Task AC

**If $ARGUMENTS is numeric:**

```bash
~/work/llm/workitem-tool/workitem-tool $ARGUMENTS
```

**If $ARGUMENTS is empty/not provided:**

- Extract task number from current git branch name (e.g., `bugfix/19181-description` → `19181`)
- Run `~/work/llm/workitem-tool/workitem-tool <extracted_number>`
- The tool cannot extract numbers automatically - always provide explicitly

### 2. Select Analysis Scope

Navigate to `~/work/datacapt/frontend`
**Show numbered commit list** (last 5) with task summary
**Ask user:** how many recent commits to analyze

### 3. Research (MANDATORY)

**Use research flow** from `~/work/datacapt/dcagents/instructions/research.md`
Identify files and lines requiring verification

### 4. Analyze Changes

**Analyze collective changes** from all commits (not individual commits)
**Use research findings** for efficient analysis

### 5. Verify AC Implementation

- **All AC addressed** and correctly implemented
- **No unauthorized changes** beyond AC scope
- **French localization** may have untranslated content (translator handles)

### 6. Display Results

**List findings** with AC implementation status
**Ask user** whether to fix identified issues

---
description: Fetches and analyzes acceptance criteria for a task.
---

## Acceptance Criteria Command

When user types **'ac'**, execute these steps:

**CRITICAL**: **NEVER implement changes without asking after executing this command**

### 1. Check Current Task Acceptance Criteria

**If $ARGUMENTS is numeric:**

```bash
~/work/llm/workitem-tool/workitem-tool $ARGUMENTS
```

**If $ARGUMENTS is empty/not provided:**

- Extract task number from current git branch name (e.g., `bugfix/19181-description` → `19181`)
- Run `~/work/llm/workitem-tool/workitem-tool <extracted_number>`
- The tool cannot extract numbers automatically - always provide explicitly

### 2. Analyze AC Requirements

### 3. Write brief report and ask if user has questions

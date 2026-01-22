---
description: Creates planning artifacts for a task (requirements, implementation, todo).
---

## Planning Command

When user types **'plan'**, execute these steps:

**CRITICAL**: **NEVER implement changes with this command - only planning** - only change is adding plan files.

**SCOPE DISCIPLINE**: Only include features/functionality explicitly stated in Acceptance Criteria. NEVER add "nice-to-have" features, improvements, or enhancements that seem like good ideas but aren't in AC.

### 1. Get Acceptance Criteria

**If $ARGUMENTS is numeric:**

```bash
~/work/llm/workitem-tool/workitem-tool $ARGUMENTS
```

**If $ARGUMENTS is non-numeric (e.g., "reports-settings-1"):**

- Skip workitem-tool
- Create directory `~/work/datacapt/dcagents/work-items/$ARGUMENTS/`
- Use previous conversation context as acceptance criteria source

**If $ARGUMENTS is empty/not provided:**

- Extract task number from current git branch name (e.g., `bugfix/19181-description` → `19181`)
- Run `~/work/llm/workitem-tool/workitem-tool <extracted_number>`
- The tool cannot extract numbers automatically - always provide explicitly

### 2. Create Directory

Save plan in `~/work/datacapt/dcagents/work-items/[task]/`
Format: `16952-Emergency-Unblinding` ([number]-[title-with-dashes])

### 3. Ask Additional Questions

List AC and task description, then ask about:

- Implementation locations
- Existing similar features
- Additional requirements

### 4. Preparation

**MANDATORY Research:** Use task-research-specialist agent
**Frontend Analysis:** Sub-agent analyzes code in modification areas
**Figma Review:** Check Figma links, analyze designs if available

### 5. Create Plan Files

#### requirements.md

- Task description and AC
- Required interfaces, backend endpoints
- Component hierarchy
- Figma links, design descriptions

#### implementation.md

- Break into tasks with specific assignments for sub-agents (API, React, LESS, translations)
- Include Figma/image links where needed
- Main agent integration and final validation
- **IF COMPLEX TASK** (>3 agents OR complex dependencies):
  - Add dependency mapping (Independent/Sequential/Parallel-safe/Integration)
  - Add interface contracts section with agent dependencies

**OPTIONAL FILES (create only if needed):**

#### contracts.md _(>3 agents sharing code)_

When >3 agents must share interfaces/types - they work parallel with mocks.

```
Agent A: Provides User interface | Independent
Agent B: Expects User interface | Uses mock from A
```

#### dependencies.md _(sequential phases)_

When phases must wait for previous completion (no parallelization possible).

```
PHASE 1: Database migration (independent)
PHASE 2: Code updates (waits for PHASE 1)
```

### 6. Additional Files

**ALWAYS:** `todo.md` (task list)
**IF NEEDED:** `contracts.md` (complex tasks), `dependencies.md` (multi-phase tasks)

### 7. Inform user that it would be good to clear context and run plan-validate command now

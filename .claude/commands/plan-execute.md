---
description: Executes an existing task plan and updates todo.md progress.
---

## Execute Plan Command

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

Navigate to `cd ~/work/datacapt/dcagents/work-items/`
Find directory [task] containing: `requirements.md`, `implementation.md`, `todo.md`
Optional files: `contracts.md`, `dependencies.md` (if complex task)
[task] = same name from AC script header
Format may be: `16952-Emergency-Unblinding` ([number]-[title-with-dashes])
**Number must match**

### 3. Execute plan reporting progress to `todo.md`

#### 3.1 Preparation

- Check general work concept in `requirements.md` file
- **IF EXISTS:** Load `contracts.md` - understand agent dependencies and interface contracts
- **IF EXISTS:** Load `dependencies.md` - identify parallel vs sequential phases
- **IF NO CONTRACTS:** Use simple execution (standard sub-agent delegation)
- Ask user if they want to verify which phases have been completed. REMEMBER TO ASK AND NOT PROCEED WITHOUT GETTING AN ANSWER
- If you verify completion of any work, mark it on the todo list
- If any work was completed partially, break it down and add additional phase to complete what was omitted

#### 3.2 Execution

**MANDATORY after each phase - todo.md update:**

**AFTER EACH SINGLE PHASE you complete, IMMEDIATELY:**

1. **Find phase in file:** `~/work/datacapt/dcagents/work-items/[task]/todo.md`
2. **Change `[ ]` to `[x]`** for that specific phase
3. **Save file**
4. **Only then** proceed to next phase

**EXAMPLE:**

```
✅ Completed phase 9.2 CSS/LESS Styles
→ IMMEDIATELY update todo.md: `- [x] **9.2 CSS/LESS Styles**`
→ ONLY NOW start phase 10.1
```

**DON'T WAIT** - do after every single phase!

**Execution Process:**

- Execute remaining phases per `todo.md`
- Phase descriptions in `implementation.md`

**IF CONTRACTS EXIST (complex tasks):**

- **DEPENDENCY-AWARE EXECUTION:**
  - **INDEPENDENT phases:** Execute immediately in parallel
  - **PARALLEL-SAFE phases:** Run with mock interfaces (provide contract specs to agents)
  - **SEQUENTIAL phases:** Wait for dependencies, execute in order
  - **INTEGRATION phase:** Final coordination and bug fixes
- **PROVIDE CONTRACTS:** Give each agent their contract from `contracts.md`
- **INTERFACE MOCKING:** Agents working in parallel must use placeholder interfaces per contracts
- **ERROR HANDLING:** Inform agents which errors are expected (`MISSING_DEPENDENCY`, `INTERFACE_PLACEHOLDER`)

**IF NO CONTRACTS (simple tasks):**

- **PARALLEL EXECUTION:** Batch independent sub-agent tasks in single response
- **SIMPLE COORDINATION:** Basic task grouping without formal contracts
- **NATURAL DEPENDENCIES:** Obvious sequential work (API → Frontend → Tests)
- **INTEGRATION:** Coordinate final assembly and fix conflicts

**PROGRESS TRACKING:**

- **AFTER EACH PHASE:** IMMEDIATELY update `~/work/datacapt/dcagents/work-items/[task]/todo.md`
- Sub-agents must update todo.md after completing listed items
- **No formatting/linting/building** during parallel work - only during final integration

#### 3.3 Verification & Integration

**IF CONTRACTS USED:**

- **CONTRACT VALIDATION:** Verify all agent contracts fulfilled - check provided functions/types/files exist
- **INTERFACE INTEGRATION:** Replace mock interfaces with real implementations
- **DEPENDENCY RESOLUTION:** Connect dependent components, fix integration issues
- **ERROR CLASSIFICATION:** Fix real bugs (not expected errors from contracts)

**ALWAYS:**

- **COHERENCE CHECK:** Ensure all parts work as unified system
- **Re-check** `requirements.md` - ensure all reflected in code

### 4. Critical Notes

- **todo.md MUST be updated AFTER EACH PHASE**
- **Use research flow** from `~/work/datacapt/dcagents/instructions/research.md` before each phase
- **Inform sub-agents** about research requirement

**PARALLEL EXECUTION CRITICAL RULES (when using contracts):**

- **PROVIDE agent contracts** - agents must know what interfaces to expect
- **DISTINGUISH error types** - expected vs real bugs
- **NO cross-agent dependencies** in parallel phases - use mocks
- **INTEGRATION PHASE MANDATORY** - verify everything connects properly
- **MAIN AGENT RESPONSIBILITY** - coordinate all parallel work, final integration

**ADAPTIVE EXECUTION:**

- **Simple tasks:** Parallel batches without contracts - intuitive dependencies
- **Complex tasks:** Full contract system with formal interface coordination
- **ALWAYS maximize parallelism** - batch independent work regardless of complexity
- **Let task complexity drive formality** - not parallelism

**REMINDER: Breaking todo.md update rule breaks instructions!**

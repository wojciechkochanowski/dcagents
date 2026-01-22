---
description: Interactive workflow for editing recent commit messages.
---

## Commit Edit Command

When user types **'commit-edit'** or **'ce'**, execute these steps:

**CRITICAL**: **NEVER implement changes without asking** - always confirm before modifying commit history.

### 1. Check Repository Status
```bash
pwd  # Check current location

# Navigate to frontend/ (Git repository) if not there
cd frontend/  # Only if in main directory

# Check for uncommitted changes
git status
```

### 2. Handle Uncommitted Changes
**If there are uncommitted changes:**
- Ask user: "Są niezakomitowane zmiany. Czy mam je zakomitować?", and add current git status info
- **If YES**: Get branch name and commit:
```bash
BRANCH_NAME=$(git branch --show-current)
git add .
git commit -m "$BRANCH_NAME"
```
- **If NO**: End instruction execution

**If no uncommitted changes:** Continue to next step

### 3. Display Current Situation
```bash
# Show last 5 commits for context
git log --oneline -5
```

**Report to user:**
- List of last 5 commits
- Ask: "Czy chcesz edytować opis commita? Dla ilu ostatnich commitów? (będą połączone)"

### 4. Process User Decision

**A. If user wants to edit 1 commit (most recent):**
- Skip to step 5 (Analyze Changes)

**B. If user wants to edit multiple commits:**
- Get current branch name: `git branch --show-current`
- Squash specified number of commits using branch name as commit message:
```bash
git reset --soft HEAD~[NUMBER_OF_COMMITS]
git commit -m "[BRANCH_NAME]"
```

### 5. Analyze Changes
```bash
# Show changes in the target commit
git show --name-status HEAD
git show HEAD
```

### 6. Generate Commit Description
Analyze the changes and create a comprehensive commit message following format:
```
[BRANCH_NAME]

[Detailed description of what was changed and why]
[List key files/components modified]
[Any important technical notes]
```

**IMPORTANT:** 
- The commit title MUST remain the same as branch name to maintain consistency.
- **All commit descriptions MUST be written in English**
- **NEVER mention translations** in commit messages (translation updates are considered implementation details)

### 7. Confirm and Apply
- Get current branch name: `git branch --show-current`
- Present proposed commit message to user (with branch name as title)
- Ask: "Czy ten opis jest poprawny? Czy chcesz wprowadzić zmiany?"
- If confirmed, execute: `git commit --amend -m "[BRANCH_NAME]\n\n[DETAILED_DESCRIPTION]"`

### 8. Final Status
```bash
git log --oneline -3  # Show result
```

---
description: Runs the code review workflow against recent changes.
---

## Code Review Command

When user types **'cr'**, execute these steps:

**CRITICAL**: **NEVER implement changes without asking** - show diff and ask for confirmation before any changes.

### 1. Check Repository Change Status
```bash
pwd  # Check current location

# Navigate to frontend/ (Git repository) if not there
cd frontend/  # Only if in main directory

# Check for uncommitted changes
git status
```

### 2. Select Analysis Target:

**A. If uncommitted changes in frontend/**:
Check all changes made
```bash
git diff HEAD
git diff --cached
git status --porcelain
```

**B. If NO uncommitted changes**:
Fetch list of last 5 commits.
Display list and ask user how many recent commits to review.
After response, check changes in specified commits.

### 3. Execute Code Review Looking For:

#### Errors and Issues:
- Code bugs and potential issues
- Security problems
- Unhandled edge cases
- Memory leaks or performance problems

#### Project Convention Compliance:
- Using components from `common/components/` (DatacButton, DatacIcon)
- Using variables from `common/styles/design-system/` instead of hardcoded values
- Proper imports (CSS → Third-party → common/* → relative)
- Naming (camelCase for variables, PascalCase for components)
- Prettier formatting (semi: false, singleQuote: true)

#### Optimizations:
- Unnecessary re-renders
- Opportunities for useMemo/useCallback
- Code duplication
- Overly complex components (splitting opportunities)

#### Additional Notes:
- French localization may contain untranslated content. Translator handles this.

### 4. Change Implementation Rules:
- **Default approach**: Code is good enough - don't introduce changes
- Implement **only changes that genuinely improve code**
- Priority: errors > security > performance > conventions > style
- No refactoring without specific reason
- Present every change as diff before implementation

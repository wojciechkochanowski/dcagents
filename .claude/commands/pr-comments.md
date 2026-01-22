---
description: Fetches PR review comments from Azure DevOps for current branch.
---

## PR Comments Command

When user types **'pr-comments'**, execute these steps:

**CRITICAL**: **NEVER implement changes without asking after executing this command**

### 1. Fetch PR Review Comments

Use your current working directory from `<env>` as the repository path.

**If $ARGUMENTS is a branch name:**

```bash
~/work/llm/review-comments/review-comments <your-working-directory> $ARGUMENTS
```

**If $ARGUMENTS is empty/not provided:**

```bash
~/work/llm/review-comments/review-comments <your-working-directory>
```

This will automatically detect the current branch in the repository.

### 2. Analyze Comments

- Group comments by file/location
- Identify unresolved vs resolved threads
- Note which comments are from reviewers vs PR author

### 3. Present Summary

- List all review comments with their context
- Highlight any unresolved issues that need addressing
- Ask user if they want to address any specific comment

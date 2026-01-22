---
description: Reviews backend commits and writes an analysis report.
---

## Backend Check Command

### 1. Select Analysis Scope:

**Fetch last 10 commits list**
Display commit names and authors, ask user how many recent commits to analyze.
After response, check changes in specified commits.
**Analyze changes collectively** - not individual commits separately.

### 2. Document Findings

**Create report file** in `C:/praca/datacapt/tmp/` with backend branch name.
If file exists, add suffix `-1`, `-2`, `-3` etc. (first available)
Write detailed, comprehensive analysis report

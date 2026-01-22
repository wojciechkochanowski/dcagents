---
description: Guidelines and process for safe frontend refactoring.
---

## Frontend Code Refactoring

### Refactoring Principles

**Basic rule**: Don't introduce unnecessary changes - assume code is good enough initially.

#### When to Refactor:

- Code difficult to understand/maintain
- Significant code duplication
- Oversized components (>200 lines)
- Non-compliance with project conventions
- Performance issues
- Specific user request

#### When NOT to Refactor:

- Code works correctly and is readable
- Changes are purely cosmetic
- No concrete benefits
- Bug introduction risk > benefits

### Refactoring Process

#### 1. Code Analysis

Check in specified location:

- **Structure**: Are components properly divided?
- **Duplication**: Is code repeated?
- **Conventions**: Compliant with react-components.md, less-styles.md, api-requests.md standards?
- **Performance**: Unnecessary re-renders?
- **Readability**: Is code understandable?

#### 2. Change Prioritization

1. **Critical**: Errors, security issues
2. **High**: Significant duplication, performance problems
3. **Medium**: Convention non-compliance, readability
4. **Low**: Cosmetic fixes

#### 3. Refactoring Workflow

```bash
pwd                    # Check current directory
cd frontend/           # Navigate if needed
git status             # Check repository state
```

**Then**:

1. **List potential improvements** with priorities
2. **Ask user** whether to implement changes
3. **Implement changes individually** with separate confirmation
4. **Show diff** before each change

### Post-Refactoring Checklist

- [ ] Functionality works same as before
- [ ] Code more readable/efficient than before
- [ ] All props and component APIs preserved

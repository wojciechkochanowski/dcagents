# Cypress E2E Tests

**Policy:** We don't create new E2E tests in this project. Legacy tests exist and must be maintained.
**Maintenance:** Tests are updated before releases as part of NRT (Non-Regression Testing), not during feature development.

## Backend Setup and State Management

If you manage backend operations and application state cleanup:

### Prerequisites

1. **Stop existing backend** (if running):

   ```bash
   cd backend
   docker-compose down
   ```

2. **Start backend services** (required for E2E setup):

   ```bash
   cd backend
   docker-compose up -d
   ```

   Wait for all services to start completely before proceeding.

3. **Reset E2E tenant and load fixtures**:

   ```bash
   cd /path/to/datacapt  # main project directory
   make e2e-be
   ```

   ⚠️ **Important**:

   - This process takes ~10 minutes. Do not interrupt.
   - If it fails with "service app is not running", ensure step 2 completed successfully.
   - **Frontend state cleanup is now automated** - the `make e2e-be` command automatically runs `deleteReportsAndGenerateFiles.mjs`

This provides a clean backend with E2E tenant and fresh test data. The frontend state is automatically cleaned.

### ⚠️ Important Notes

- **Test dependencies**: Some test files are not independent
- **Execution order matters**: Proper test execution may require running prerequisite tests that populate backend data

### Common Issues & Solutions

**Problem**: `make e2e-be` fails with "service app is not running"

- **Solution**: Ensure backend is fully started with `docker-compose up -d` and wait for all containers to be healthy

**Problem**: `deleteReportsAndGenerateFiles.mjs` fails with "ENOENT: no such file or directory"

- **Solution**: This is now handled automatically by `make e2e-be` command. If running manually, must execute from `frontend/apps/cypress` directory, not project root

**Problem**: Tests fail unexpectedly after successful setup

- **Solution**: Check if frontend app is running on `localhost:3000`

## Test Dependencies & Execution Order

⚠️ **CRITICAL**: Tests share persistent database state. No automatic cleanup exists. Every test modifies data for subsequent tests.

### Precise Dependency Analysis

**🔗 Core User Setup** (REQUIRED for most tests):

- `01_log_in_spec.ts` → `02a_register_spec(invite_user).ts` → `02b_register_spec(get_token_from_BE).ts` → `02c_register_spec.ts`
- **Creates**: `investigator@cypress.datacapt` and `another@cypress.datacapt` users
- **State**: Backend contains new user accounts and invitation tokens

**🔗 Study Foundation** (REQUIRED for all form/subject tests):

- `04_study_centers_spec.ts` → `05_add_and_edit_study_spec.ts` → `06_inviting_investigator_to_study_spec.ts` → `07_add_sections_in_builder_spec.ts`
- **Key**: Test 06 invites investigator to study - **BLOCKS most tests that need investigator access**
- **Creates**: Study `CYPRESS`, centers, investigator assignment, form sections

**🔗 Form Structure** (REQUIRED for data entry):

- `08_add_questions_in_builder_spec.ts` → `09_add_multiple_questions_spec.ts` → `10_add_static_content_in_builder_spec.ts`
- **Creates**: Questions, form fields, static content

**🔗 Subject Data** (Creates test subjects):

- `11_add_new_subjects_spec.ts` → `12_admin_fullfils_questions_spec.ts` → `13_investigator_fulfills_questions_spec.ts`
- **Critical difference**: Test 12 (admin) can run without Test 06, but Test 13 (investigator) REQUIRES Test 06

### Specific Dependencies Discovered

**Test 13 specifically requires**:

```
02c → 06 → 07 → 08 → 11 → 13
```

- User creation (02c) + Investigator invitation (06) + Form structure (07-08) + Subjects (11)

**Test 12 only requires**:

```
04 → 05 → 07 → 08 → 11 → 12
```

- No investigator invitation needed (admin has access)

**Permission Tests (22a-22d) require**:

```
02c → 06 → 22a-22d
```

- Need investigator account + study invitation to test role changes

### Self-Contained Modules

**EPRO Chain** (32a-32g):

- Creates own study `EPRO_FIRST`
- Internal sequence: `32a` → `32b` → `32c` → `32d` → `32e` → `32f` → `32g`
- Requires only User Setup (01-02c)

**eConsent Chain** (36a-37e):

- Creates own study flow
- Mixed dependencies on main study setup

### Development Workflow Issues

**🚨 After Finding/Fixing Bugs:**

1. **Backend state is corrupted** by previous test runs
2. **Rerunning single test often fails** due to missing/wrong data
3. **Must reset backend** and run dependency chain from scratch
4. **Time cost**: Each fix requires ~15 minutes (reset + dependency chain)

**Example Development Scenarios:**

```bash
# Scenario: Fix bug in test 13
# Problem: Previous run left data in wrong state
# Solution: Full reset + dependency chain

make e2e-be                    # ~10 minutes (includes frontend cleanup)
cd frontend/apps/cypress
pnpm cypress run --spec "integration/01_log_in_spec.ts" --browser chrome
pnpm cypress run --spec "integration/02a_register_spec(invite_user).ts" --browser chrome
pnpm cypress run --spec "integration/02b_register_spec(get_token_from_BE).ts" --browser chrome
pnpm cypress run --spec "integration/02c_register_spec.ts" --browser chrome
pnpm cypress run --spec "integration/04_study_centers_spec.ts" --browser chrome
pnpm cypress run --spec "integration/05_add_and_edit_study_spec.ts" --browser chrome
pnpm cypress run --spec "integration/06_inviting_investigator_to_study_spec.ts" --browser chrome
pnpm cypress run --spec "integration/07_add_sections_in_builder_spec.ts" --browser chrome
pnpm cypress run --spec "integration/08_add_questions_in_builder_spec.ts" --browser chrome
pnpm cypress run --spec "integration/11_add_new_subjects_spec.ts" --browser chrome
pnpm cypress run --spec "integration/13_investigator_fulfills_questions_spec.ts" --browser chrome
# Total: ~20 minutes per fix cycle
```

### Safe Execution Patterns

**Pattern 1 - Full Sequential** (Release testing):

```bash
# Reset + run 01-41 in numerical order
# Most reliable, time-consuming
```

**Pattern 2 - Module Testing** (Feature validation):

```bash
# Reset + Core Setup + Specific module
# E.g., for EPRO: reset + 01-02c + 32a-32g
```

**Pattern 3 - Single Test Debug** (Development):

```bash
# Reset + Minimal dependency chain + Target test
# Check dependency matrix above for minimal chain
```

### Critical Insights

- **No test isolation exists** - shared persistent state
- **Numerical order reflects real dependencies** - not arbitrary
- **Backend reset is expensive** but often necessary
- **Test 06 is a major bottleneck** - blocks investigator-related tests
- **Development cycle is slow** due to state management
- **Most failures require full reset** - partial reruns rarely work

## Git History Verification for Test Fixes

**CRITICAL**: Before fixing failing tests, verify changes through git history to understand root cause.

### Verification Workflow

1. **Check recent commits** that might affect the failing test:

   ```bash
   git log --oneline --grep="keyword" --since="1 month ago"
   git log --oneline -S "specific_field" --since="2 months ago"
   ```

2. **Analyze specific commits** that modified relevant files:

   ```bash
   git show --unified=5 <commit_hash> | grep -A5 -B5 "field_name"
   git blame path/to/test/file.ts | grep "problematic_line"
   ```

3. **Verify field additions/changes** in codebase:
   ```bash
   git show <commit_hash> -- path/to/relevant/file.ts
   ```

### Documentation Required

When fixing tests, include:

- **Root cause identification**: Which commit introduced the breaking change
- **Field/API changes**: What was added/modified that broke the test
- **Verification evidence**: Git commit hash and change summary

### Distinguishing Application Bugs vs UI Changes

**CRITICAL**: Before fixing failing tests, determine if it's an application bug or intentional UI change:

#### Process for Component/UI Failures:

1. **Check git history for specific component**:

   ```bash
   git log --oneline --since="3 months ago" -- path/to/component.tsx
   git show <commit_hash> -- path/to/component.tsx
   ```

2. **Analyze the change**:

   - **UI Change**: Elements removed/modified, new interaction patterns → Update test
   - **Translation missing**: Keys removed from component → Update test
   - **Application Bug**: Logic error, unintended behavior → Report to user

3. **Test Update vs Bug Report**:
   - **Update test** when: UI intentionally changed, elements removed/moved, interaction flow modified
   - **Report bug** when: Component crashes, data inconsistency, unintended behavior

#### Selector Updates for UI Changes

**CRITICAL**: If tests fail because they cannot find DOM elements, first check if UI application changes require selector updates:

1. **Element not found errors**: Often indicate CSS class names or DOM structure changed
2. **Check actual selectors**: Use browser dev tools or grep to find current class names in codebase
3. **Common changes**:

   - Component refactoring: `.old-component__item` → `.new-component__item`
   - Design system updates: `.custom-button` → `.datac-button`
   - Structure changes: Element moved from `.parent > .child` to `.different-parent .child`

4. **Investigation steps**:

   ```bash
   # Find current class names in codebase
   grep -r "className.*component-name" apps/

   # Check if selector exists in current UI components
   grep -r "old-selector-name" apps/datacapt/src/components/
   ```

5. **Update test selectors** to match current UI structure, don't add missing classes to components

6. **Timing Issues vs Selector Issues**: Before adding `cy.wait()` or increasing timeouts, verify the element actually exists:
   - **Wrong approach**: Adding waits when selector is incorrect
   - **Correct approach**: First confirm element exists in current UI, then address timing if needed
   - **Verification**: Use grep to search codebase for actual class names before assuming timing issues

#### Example Analysis Process:

```bash
# Test failing: StructureBuilderNameEditor save button not found
git log --since="2 months ago" -- apps/.../StructureBuilderNameEditor.tsx
# Result: 1098799d1 fix/18228-get-rid-of-save-builder-section-button

git show 1098799d1 -- apps/.../StructureBuilderNameEditor.tsx
# Analysis: Intentionally removed Save/Cancel buttons, added auto-save on blur
# Decision: Update test to use blur() instead of button click
# Action: Modify test interaction pattern, don't add missing translations
```

### Example Analysis

```bash
# Test failing: E2E-028 expects data without randomisation_enabled
# Investigation:
git log --oneline -S "randomisation_enabled" --since="3 months ago"
# Result: f8a4d885a0 feature/18096-rtsm-options/request-fix

git show f8a4d885a0 -- common/requests/studies/studies.ts
# Shows: Added randomisation_enabled field to study update API
# Fix: Update test expectation to include the new field
```

## Running E2E Tests

### Prerequisites

- Frontend application running on `localhost:3000`
- Backend services running with `docker-compose up -d`
- Test files located in `frontend/apps/cypress/integration`

### Makefile Commands (Recommended)

Execute from project root directory (`~/work/datacapt/`):

```bash
# Complete E2E setup (backend + frontend cleanup)
make e2e-be

# Open Cypress Test Runner (interactive mode)
make e2e-open

# Run all tests in headless mode
make e2e-run

# Generate test report after running tests
make e2e-report

# Full cycle: setup + run all tests + generate report
make e2e-full
```

### Test Reports Location

Generated test reports are stored in:

- `frontend/apps/cypress/report/mochawesome-report/` - Individual JSON reports per test file
  - Format: `mochawesome_001.json` to `mochawesome_XXX.json`
  - Each file contains detailed test statistics, results, and failure information
  - Machine-readable format ideal for automated analysis

When analyzing test reports, focus on the JSON files in the mochawesome-report directory. Each file contains:

- `stats` - test counts, pass/fail rates, execution time, percentages
- `results` - detailed test suite and individual test results with error messages

### Manual Execution

1. Navigate to cypress directory:

   ```bash
   cd frontend/apps/cypress
   ```

2. Run specific test file:

   ```bash
   pnpm cypress run --spec "integration/test_file_name.ts" --browser chrome
   ```

3. Open interactive test runner:
   ```bash
   pnpm open
   ```

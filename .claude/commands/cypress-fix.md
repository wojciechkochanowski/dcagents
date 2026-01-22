---
description: Analyzes Cypress reports and fixes failing tests.
---

# Cypress Test Fix Command

This command analyzes Cypress test reports and fixes failing tests based on the current codebase state.

## Process

1. **Read Cypress Instructions**: First read `@instructions/cypress.md` to understand:

   - Test structure and dependencies
   - Location of test reports
   - Failure analysis workflow
   - Git history verification process

2. **Check Test Reports**: Based on the instructions, examine the test reports:

   - Look for files with failures
   - Analyze failure statistics and pass rates
   - Review detailed error messages for failed tests

3. **Fix Test Files**: Following the verification workflow described in the instructions:
   - Identify root cause of failures (UI changes vs application bugs)
   - Update test files accordingly
   - Follow proper dependency chains when fixing tests
   - Apply the analysis process outlined in the instructions

## Key Principles

- Always verify changes through git history before making fixes
- Distinguish between intentional UI changes (update test) vs application bugs (report to user)
- Respect test dependencies and execution order
- Follow the verification workflow and documentation requirements from the instructions

## Usage

Run this command when Cypress tests are failing and need systematic analysis and fixes.

# Project Overview

Clinical trials management application featuring form creation/completion, participant management, reports, templates, exports, imports.

## Repository Structure

Project consists of three separate git repositories:

- **Frontend** (this repository) - React/TypeScript frontend application (primary work area)
- **Backend** (`../backend`) - Python backend API (reference only, never modify)
- **Dcagents** (`../dcagents`) - Agent configurations, instructions, and automation tools

## 🚨 CRITICAL: Git Worktree Setup

**This is a git worktree** - multiple agents work on different frontend branches simultaneously in separate directories.

**Core rule:** Work ONLY in the working directory shown in `<env>`. Do not modify frontend files outside this directory.

**Exception:** You may use `../backend/`, `../dcagents/` (other repositories).

# Directory Structure

## Backend

Python backend repository at `../backend`.
**NEVER modify** - reference only for API request patterns.

## Frontend

Primary work area - current repository.

### Critical Folders

- `common/components` - Shared UI components (71 total)
- `common/requests` - API functions and interfaces
- `common/styles` - Global styles and design system variables
- `common/intl` - Translation files
- `apps/datacapt` - Main clinical trials application (15 modules)

### App Modules (`apps/datacapt/src/components/`)

**Core:** `auth/` `studies/` `shared/` `calendar/` `recruitment/` `SubjectRepository/` `SubjectDashboard/` `settings/` `payments/`
**Other:** `sideBySide/` `Products/` `LP/` `BasicLayout/` `ContentLayout/` `NotFound/` `RedirectNoAccessWrapper/`

**📋 Check `dcagents/structure/{module_name}.md` for detailed documentation of any module.**

# Implementation Philosophy

## **SCOPE DISCIPLINE**:

Do only what is explicitly requested.
NEVER add "nice-to-have" features, improvements, or enhancements that seem like good ideas but weren't asked for.

## Core Principle

Before every decision ask: Does this create more complexity than it solves?
Default to the simplest possible solution that meets requirements exactly.
Question if complexity is inherent to the problem or artificially introduced.

## Priority Framework

**Always prefer:**

- Refactoring existing components over creating new helper functions
- Editing existing files over writing new files when functionally equivalent
- Established patterns over novel approaches for standard problems

**Decision hierarchy:**

1. Can existing code be modified?
2. Can existing patterns be applied?
3. Does this require new abstraction? (usually no)

## Complexity Management

When implementation feels complex:

1. Pause and seek simpler architectural approach
2. Question every additional abstraction layer
3. Break complex tasks into research + implementation phases
4. Use specialized agents for domain expertise

## Scope Discipline

Never implement "nice-to-have" features not explicitly requested.
Stop and analyze when encountering implementation resistance.
Challenge requirements that seem to require excessive complexity.

## 🚨 CRITICAL: No Assumptions Rule

**NEVER assume project specifics. Always investigate first.**

- Research before coding - use Read/Grep tools
- Check existing patterns instead of assuming standard approaches
- Verify file structures, dependencies, conventions
- Consult `dcagents/structure/` docs when working with modules
- Question what seems "obvious" - may be project-specific

**When in doubt:** Investigate, don't assume.

## Check appropriate instructions before starting work

- For React components: `C:/praca/datacapt/dcagents/instructions/react-components.md`
- For LESS styles: `C:/praca/datacapt/dcagents/instructions/less-styles.md`
- For API requests: `C:/praca/datacapt/dcagents/instructions/api-requests.md`
- For translations: `C:/praca/datacapt/dcagents/instructions/translations.md`
- For Figma: `C:/praca/datacapt/dcagents/instructions/figma.md`
- For Browser automation: `C:/praca/datacapt/dcagents/browser-automation/browser-automation.md`
- For Refactoring: `C:/praca/datacapt/dcagents/.claude/commands/refactoring.md`

## Mandatory skills for specific tasks

**ALWAYS use these skills when working on related tasks:**

- **Tables/DatacTable**: Run `/tables` skill BEFORE implementing any table component (DatacTable usage, pagination, column definitions, data fetching)
- **Icons**: Run `/icons` skill BEFORE working with SVG icons, DatacIcon component, or icon-only buttons

These skills contain critical project-specific patterns and are NOT optional.

# Automated Code Quality

Post-edit hook automatically handles:

- Prettier formatting
- ESLint validation
- TypeScript checking
- LESS file design system validation

Manual execution not required - hook processes all file edits automatically.
**Exception**: Follow specific instructions if explicitly stated in project documentation.

---
description: Enhances code review XML files per cr/spec.md.
---

# cr-html

## Description
Extends XML files in the code review system with comments and descriptions according to the specification in `@cr/spec.md`. Adds detailed review information to existing diff XML files.

## MANDATORY WORKFLOW SEQUENCE

### Step 1: Initial Analysis (REQUIRED)
**ALWAYS start by reading** `/Users/bartek/work/datacapt/cr/spec.md` to understand the complete XML structure before proceeding.

### Step 2: Preliminary Change Review (REQUIRED)
Before enhancing XML files, **MUST perform preliminary analysis** of the changes:
1. **Run validation script** to check current state:
   ```bash
   tools/validate-cr-xml.sh --mode=pre
   ```
   This will identify XML files requiring enhancement and validate basic structure.
2. **Extract file paths** from XML metadata to understand which source files are being reviewed
3. **Quick overview** of the nature of changes (added/modified/removed lines)

### Step 3: Frontend Code Context Analysis (CRITICAL)
**MUST use task-research-specialist agent** to analyze the actual frontend codebase:

```
Task tool parameters:
- subagent_type: "task-research-specialist" 
- prompt: "Analyze frontend codebase context for code review enhancement. Review files: [list of actual source files from XML metadata]. Focus on:
1. Understanding business logic and component responsibilities
2. Identifying relationships between components and services
3. Analyzing data flow and state management patterns
4. Understanding existing patterns and conventions
5. Providing context for what the changed code actually does in the application

Purpose: Generate comprehensive code review context to create better descriptions, identify potential issues, and write more informed review comments. The XML files represent diffs of these frontend files."
```

**WHY THIS IS CRITICAL:**
- XML files contain diffs, but we need to understand what the actual code does
- Frontend context helps identify business logic implications
- Better understanding leads to more accurate AC scenario mapping
- Enables identification of potential integration issues
- Provides context for writing meaningful reviewer comments

### Step 4: Enhanced XML Generation
Generate XML diff files with enhanced review workflow support, detailed descriptions, and structured comments for code review visualization, **informed by the frontend analysis**.

**IMPORTANT:** Additionally, when executing this command, you MUST create or update the `list.xml` file with:
- `<title>` - **DO NOT MODIFY** - title is already provided by other commands (typically branch name)
- `<description>` - comprehensive description of all changes included in the review session (supports **Markdown formatting**)
- `<files>` - ordered list of all XML diff files being created

## XML Structure Requirements

### 1. Root Structure (MANDATORY)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<diff version="1.0">
  <metadata>...</metadata>
  <descriptions>...</descriptions>
  <split-view>...</split-view>
  <comments>...</comments>
  <review-status>...</review-status>
</diff>
```

### 2. Metadata Section
```xml
<metadata>
  <file path="apps/datacapt/src/components/StatusManagement.tsx" />
  <created timestamp="2025-08-28T21:55:00Z" />
  <reviewer name="business-analyst" />
  <summary>Implementation of IP status transitions according to AC requirements</summary>
</metadata>
```

**Required attributes:**
- `file.path` - relative path from project root
- `created.timestamp` - ISO 8601 format
- `reviewer.name` - reviewer identifier
- `summary` - concise change description

### 3. Descriptions Section (CRITICAL FOR AC CONTEXT)

**VERIFIED EXAMPLE from statusTransitions_ts.xml:**
```xml
<descriptions>
  <description id="desc-001" title="Logika statusów IP - implementacja AC" scope="lines:3-31">
    <content>
      Dodanie nowej logiki zarządzania statusami IP zgodnie z AC. Implementuje wszystkie wymagane przejścia statusów:
      - In transfer → Received/Invalid (AC Scenario 2: Invalid assignment)
      - Received → Available/In transfer 
      - Available → In transfer/Invalid/Allocated (AC Scenario 1: Allocated status)
      - Allocated → Invalid (AC Scenario 2: Invalid assignment)
      - Invalid → Available/Allocated/In transfer/Received (recovery paths)
      
      Funkcja wspiera bulk mode (AC Scenario 5) - w trybie masowym dostępne są wszystkie statusy dla elastyczności operacji.
      Implementuje audit trail requirements (AC Scenario 6) poprzez śledzenie zmian statusów.
    </content>
    <tags>
      <tag>ac-implementation</tag>
      <tag>business-logic</tag>
      <tag>status-management</tag>
      <tag>bulk-operations</tag>
    </tags>
  </description>
  
  <description id="desc-002" title="Validation and Error Handling" scope="lines:32-45">
    <content>
      Implementacja walidacji przejść statusów z szczegółowym error handling.
      Zabezpiecza przed nieprawidłowymi przejściami poza bulk mode.
      Wspiera user feedback z jasną informacją o dozwolonych statusach.
    </content>
    <tags>
      <tag>validation</tag>
      <tag>error-handling</tag>
      <tag>user-experience</tag>
    </tags>
  </description>
</descriptions>
```

**Description Requirements:**
- `id` - unique identifier (desc-001, desc-002, etc.)
- `title` - descriptive title in Polish
- `scope` - line range (lines:3-31, lines:32-45, etc.)
- `content` - detailed explanation including AC references
- `tags` - relevant categorization tags

**MANDATORY AC Context References:**
- AC Scenario 1: Assign Status as Allocated
- AC Scenario 2: Assign Status as Invalid  
- AC Scenario 5: Bulk Assign Status
- AC Scenario 6: Audit Trails

### 4. Split View Structure

**Line pair types:**
- `context` - unchanged lines for context
- `modified` - changed lines
- `added` - new lines (before line-number="-")
- `removed` - deleted lines (after line-number="-")

**HOW TO ADD DESCRIPTION REFERENCES:**
```xml
<line-pair id="line-018" type="added" description-refs="desc-001">
  <before line-number="-" content="" />
  <after line-number="18" content="    // AC Scenario 1: Support for Allocated status" />
</line-pair>

<line-pair id="line-025" type="modified" description-refs="desc-001 desc-002">
  <before line-number="23" content="    return allowedStatuses;" />
  <after line-number="25" content="    return validateStatusTransitions(allowedStatuses, currentStatus);" />
</line-pair>
```

**CRITICAL:** Use `description-refs` attribute to link lines to descriptions.

### 5. Comments System (CRITICAL GUIDELINES)

**VERIFIED EXAMPLE from statusTransitions_ts.xml:**
```xml
<comments>
  <comment id="comment-001" line-ref="line-008" author="business-analyst" timestamp="2025-08-28T21:55:00Z">
    <text>W bulk mode wszystkie statusy są dostępne - czy to nie może prowadzić do nieprawidłowych przejść? Np. z Allocated bezpośrednio na Received?</text>
    <status>needs-discussion</status>
    <thread-id>thread-001</thread-id>
  </comment>
  
  <comment id="comment-002" line-ref="line-025" author="qa-engineer" timestamp="2025-08-28T21:58:00Z">
    <text>Czy funkcja validateStatusTransitions obsługuje edge cases? Brakuje testów jednostkowych dla invalid transitions.</text>
    <status>pending</status>
    <thread-id>thread-002</thread-id>
  </comment>
  
  <comment id="comment-003" line-ref="line-018" author="security-reviewer" timestamp="2025-08-28T22:02:00Z">
    <text>Status transitions powinny być logowane dla audit trail. Czy mamy mechanizm trackowania kto i kiedy zmienił status?</text>
    <status>needs-discussion</status>
    <thread-id>thread-003</thread-id>
  </comment>
  
  <comment id="comment-004" line-ref="line-032" author="performance-analyst" timestamp="2025-08-28T22:05:00Z">
    <text>Bulk operations mogą być kosztowne przy dużej liczbie rekordów. Czy rozważano implementację batch processing?</text>
    <status>pending</status>
    <thread-id>thread-004</thread-id>
  </comment>
</comments>
```

**CRITICAL COMMENT RULES:**
- ❌ **NEVER** add positive comments ("Świetna implementacja!", "Dobrze zrobione!")
- ✅ **ONLY** problems, questions, improvements, concerns
- ✅ Use diverse reviewer perspectives:
  - `business-analyst` - business logic concerns
  - `qa-engineer` - testing and quality issues
  - `security-reviewer` - security considerations
  - `ui-designer` - user experience issues
  - `performance-analyst` - performance concerns
  - `architecture-reviewer` - architectural decisions

**Comment Status Guidelines:**
- `needs-discussion` - for serious problems requiring team discussion
- `pending` - for questions awaiting response
- `resolved` - only if comment addresses resolved issue
- `dismissed` - for invalid/outdated concerns

### 6. Review Status Section

**VERIFIED EXAMPLE:**
```xml
<review-status>
  <line-status line-ref="line-008" status="needs-discussion" reviewer="business-analyst" timestamp="2025-08-28T21:55:00Z" />
  <line-status line-ref="line-018" status="needs-discussion" reviewer="security-reviewer" timestamp="2025-08-28T22:02:00Z" />
  <line-status line-ref="line-025" status="pending" reviewer="qa-engineer" timestamp="2025-08-28T21:58:00Z" />
  <line-status line-ref="line-032" status="pending" reviewer="performance-analyst" timestamp="2025-08-28T22:05:00Z" />
  <overall-status status="needs-discussion" reviewer="lead-reviewer" timestamp="2025-08-28T22:00:00Z" />
</review-status>
```

**Status Values:**
- `needs-discussion` - requires discussion  
- `rejected` - change rejected
- `pending` - awaiting review

## XML Validation (MANDATORY)

**ALWAYS validate XML after generation using our validation script:**
```bash
tools/validate-cr-xml.sh --mode=post
```

**This comprehensive validation checks:**
- XML syntax validity (xmllint)
- Spec compliance (comments, review-status structure)
- Required elements and attributes
- Proper timestamp formats (ISO 8601)

**Script behavior:**
- ✅ Green checkmarks = Valid elements
- ❌ Red X marks = Issues requiring fixes
- ⚠️ Yellow warnings = Non-critical issues
- Final report shows pass/fail counts

**If validation fails, you MUST fix the XML before proceeding.**

**Legacy validation (backup only):**
```bash
xmllint --noout "$file"  # Only checks XML syntax
```

## File Order Optimization for list.xml

**Flexible ordering guidelines for better code comprehension:**

The order of files should prioritize understanding of the implemented functionality rather than following strict rules. Consider:

- **Logical flow** - How would a reviewer naturally want to understand the changes?
- **Related grouping** - Files implementing the same feature should be adjacent when it aids comprehension
- **Context building** - Start with files that provide context for understanding subsequent changes
- **Dependency flow** - Consider how files depend on each other

**Example groupings that aid understanding:**
```xml
<!-- Good: API change with its related components -->
<file>common_requests_studies_randomisation_ipList_ts.xml</file>
<file>apps_datacapt_components_StatusManager_tsx.xml</file>
<file>apps_datacapt_components_StatusManager_less.xml</file>

<!-- Good: Translation files grouped when they represent the same feature -->
<file>common_intl_en_json.xml</file>
<file>common_intl_pl_json.xml</file>
<file>common_intl_de_json.xml</file>
```

**Remember:** These are suggestions, not requirements. The goal is to help reviewers understand the codebase changes effectively.

## Task Context: IP Status Management (Task 17662)

**AC Scenario References for descriptions:**
- **AC Scenario 1:** Assign Status as Allocated
- **AC Scenario 2:** Assign Status as Invalid assignment  
- **AC Scenario 5:** Bulk Assign Status (bulk mode flexibility)
- **AC Scenario 6:** Audit Trails (status change tracking)

**Status Transition Logic:**
- In transfer → Received/Invalid
- Received → Available/In transfer
- Available → In transfer/Invalid/Allocated  
- Allocated → Invalid
- Invalid → Available/Allocated/In transfer/Received (recovery)

## Common Mistakes to Avoid

1. **XML Structure Errors:**
   - Missing required root elements
   - Invalid line-number values (use "-" for non-existent)
   - Missing mandatory attributes

2. **Description Issues:**
   - Not referencing AC scenarios
   - Vague scope definitions
   - Missing description-refs in line-pairs

3. **Comment Violations:**
   - Adding positive/congratulatory comments
   - Not using diverse reviewer perspectives
   - Unclear status assignments
   - Suggesting unit tests (frontend doesn't use unit tests)
   - Claiming frontend generates audit trails (backend-only functionality)
   - Writing comments in language other than Polish (always use Polish regardless of file content language)

4. **Validation Skips:**
   - Not running xmllint validation
   - Proceeding with invalid XML

## Execution Checklist

**Pre-Analysis Phase:**
- [ ] Read `/Users/bartek/work/datacapt/cr/spec.md` first
- [ ] **Run pre-validation**: `tools/validate-cr-xml.sh --mode=pre`
- [ ] Extract source file paths from XML metadata (from validation output)
- [ ] Run task-research-specialist analysis on frontend codebase

**Enhancement Phase:**
- [ ] Include all 5 required XML sections (metadata, descriptions, split-view, comments, review-status)
- [ ] Add AC scenario references in descriptions (informed by frontend context)
- [ ] Use only problem-focused comments (based on code understanding)
- [ ] Include diverse reviewer perspectives
- [ ] Add description-refs to relevant line-pairs
- [ ] Use proper timestamp format (ISO 8601)
- [ ] Include appropriate tags in descriptions
- [ ] Order files logically in list.xml

**Post-Enhancement Validation (MANDATORY):**
- [ ] **Run comprehensive validation**: `tools/validate-cr-xml.sh --mode=post`
- [ ] Fix any XML syntax errors identified
- [ ] Fix any spec compliance issues identified  
- [ ] Ensure all files show ✅ in validation report
- [ ] **Validate list.xml separately**: `xmllint --noout cr/diff-viewer/public/diffs/list.xml`

## Sample Complete XML File Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<diff version="1.0">
  <metadata>
    <file path="apps/datacapt/src/services/statusTransitions.ts" />
    <created timestamp="2025-08-28T21:55:00Z" />
    <reviewer name="business-analyst" />
    <summary>IP status management implementation per AC requirements</summary>
  </metadata>

  <descriptions>
    <description id="desc-001" title="AC Implementation - Status Logic" scope="lines:1-30">
      <content>Complete implementation of AC scenarios...</content>
      <tags>
        <tag>ac-implementation</tag>
        <tag>business-logic</tag>
      </tags>
    </description>
  </descriptions>

  <split-view>
    <line-pair id="line-001" type="added" description-refs="desc-001">
      <before line-number="-" content="" />
      <after line-number="1" content="// AC Scenario 1: Status allocation logic" />
    </line-pair>
  </split-view>

  <comments>
    <comment id="comment-001" line-ref="line-001" author="security-reviewer" timestamp="2025-08-28T22:00:00Z">
      <text>Czy status transitions są autoryzowane? Potrzebna walidacja uprawnień użytkownika.</text>
      <status>needs-discussion</status>
      <thread-id>thread-001</thread-id>
    </comment>
  </comments>

  <review-status>
    <line-status line-ref="line-001" status="needs-discussion" reviewer="security-reviewer" timestamp="2025-08-28T22:00:00Z" />
    <overall-status status="needs-discussion" reviewer="lead-reviewer" timestamp="2025-08-28T22:05:00Z" />
  </review-status>
</diff>
```

**This structure ensures comprehensive, reviewable, and AC-compliant XML diff files.**

## List.xml Structure (MANDATORY)

**MUST create/update list.xml when executing cr-html command:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<list>
  <title>feature/ip-status-management-17662</title>
  <description>
    Implementation of comprehensive IP status management system with transition logic,
    validation rules, and audit trail support. Includes bulk operations mode and
    error handling according to AC Scenario requirements 1, 2, 5, and 6.
  </description>
  <files>
    <file>common_requests_studies_randomisation_ipList_ts.xml</file>
    <file>apps_datacapt_components_StatusManager_tsx.xml</file>
    <file>common_intl_en_json.xml</file>
    <file>common_intl_pl_json.xml</file>
  </files>
</list>
```

**Required elements:**
- `<title>` - Global review session title (**DO NOT MODIFY** - already provided by other commands)
- `<description>` - Comprehensive description of ALL changes in the review session (generated during cr-html execution, **supports Markdown formatting**)
- `<files>` - Ordered list using underscore naming convention

**Markdown Support in Description:**
The `<description>` field supports full Markdown formatting including:
- Headers (`# ## ###`)
- **Bold text** and *italic text*
- Bullet points and numbered lists
- `inline code` and code blocks
- Blockquotes and other standard Markdown elements

**Example with Markdown:**
```xml
<description>
## Zmiany w systemie IP

Implementacja nowego systemu zarządzania statusami IP z następującymi **kluczowymi funkcjami**:

- ✅ Walidacja przejść statusów według AC
- ✅ Tryb masowy (`bulk mode`) dla operacji grupowych  
- ✅ Audit trail z pełnym śledzeniem zmian
- 🔧 Obsługa `ExpirationDateFormat` walidacji

### Szczegóły techniczne
- Dodanie enum `ImportIpListCheckType.ExpirationDateFormat`
- Aktualizacja tłumaczeń dla **wszystkich języków** systemu
- Zgodność z AC Scenario 1, 2, 5 i 6
</description>
```

**File ordering:** Optimize for code comprehension and logical review flow as described above.

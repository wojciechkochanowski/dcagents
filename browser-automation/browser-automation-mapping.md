# Page Mapping Instructions - MCP Browser Automation

## Creating Page Maps in `~/work/datacapt/dcagents/browser-automation/map/`

**CRITICAL: ALWAYS RECORD REAL THINGS (classes, components, file names, etc.) NEVER RECORD ASSUMPTIONS**

## Structure & Organization

- Directory contains MD files for easy page navigation
- Each file corresponds to page type/subpage
- Files organized in directories/subdirectories. Subpages should be in subdirectory of parent page, creating tree structure matching site structure
- Files must be interconnected via wiki links if pages lead to each other
- Create file when entering page type first time
- Update file if page changed or previous understanding was incomplete

## File Content Rules

### NEVER Record

- **NEVER record specific data** from fixtures or backend (study names, usernames, etc.)
- Don't record assumptions - only real, verified information

### Distinguish Static vs Dynamic Elements

- **Static**: buttons, headers, menu labels, layout structure
- **Dynamic**: study names, user lists, counters, form data

### Use General Descriptions for Dynamic Data

- Instead of "CL-0001" → "Subject ID (format: [PREFIX]-[NUMBER])"
- Instead of "Cypress section 1" → "Study sections (dynamic, based on eCRF structure)"
- Instead of "3 subjects" → "Number of subjects (dynamic)"

### Technical Documentation

- **Document CSS selectors** to find elements regardless of content
- List important UI element CSS classes with note to use them for finding related components in code
- **Document URL patterns** not specific links
- **Provide examples** in parentheses as illustration, not fixed elements

## App Analysis Before Recording

**Analyze app code** to understand dynamic elements:

- Use `mcp__chrome-devtools__evaluate_script` to check DOM structure
- Check if data comes from API calls or hardcoded
- Observe CSS class patterns
- Note rendering loops (lists, tables)

## Quality Recording Rules

### General Rules for Dynamic Data

- When recording page structure, record general information about structure that can contain various data, not specific added elements

### Cross-references & Connectivity

- Files contain cross-references (wiki links) between sections for easy navigation
- These are page types/templates, not specific backend-driven pages

### Updating Existing Maps

- Update file if page changed or previous understanding was incomplete

---
description: Maintains and updates project instructions and agent docs.
---

# Project Instructions Maintenance

## Commands Inventory

**Check** `~/work/datacapt/dcagents/instructions/commands.md`
**Update** if missing commands from `~/work/datacapt/dcagents/.claude/commands/` or incorrect descriptions

## Agents

**Review** agent files in `~/work/datacapt/dcagents/.claude/agents/`
**Update** opencode agent files in `~/work/datacapt/dcagents/.opencode/agent/`

**Same content, different format** - note tools structure:

```md
---
description: same description as original
---

same content as original
```

## Design System Documentation

**Create/update** `~/work/datacapt/dcagents/instructions/design-system.md` with comprehensive design system reference.

**CRITICAL: This is a REFERENCE GUIDE, not examples. Completeness > brevity.**

### Mandatory Process:

1. **Read ALL source files** - never assume patterns:

   ```bash
   # Get complete file list
   find ~/work/datacapt/frontend/common/styles/design-system -name "*.less" -type f

   # Read EVERY file (not just examples)
   ```

2. **Extract ALL values** - no shortcuts:

   - Read every .less file completely
   - Extract every variable definition
   - Cross-reference semantic → primitive → resolved hex values
   - Never write "and others" or "etc." for color palettes

3. **Verify precision** - check exact values:
   - Unitless values: document as "1 (unitless, compiles to 1rem)"
   - Alpha colors: include rgba values, not just variable names
   - Semantic mappings: show both mapped variable AND final hex value

### Required Structure:

1. **Spacing Variables**: Complete table (@4xs to @11xl) with rem + px values
2. **Border Radius**: Complete table (@border-radius-3xs to @border-radius-full)
3. **Typography Variables**: All scales (body-xs/sm/md, heading-xs/sm/md/lg, label-xs/sm)
4. **Typography Mixins**: All mixins with descriptions (.body-md, .body-md-emphasis, etc.)
5. **Color Variables**:
   - **Semantic colors**: 3-column tables (Variable | Maps To | Resolved Hex)
     - Foreground (@fg-\*)
     - Background (@bg-\*)
     - Border (@border-\*)
     - Text (@text-\*)
   - **Primitive colors**: Complete tables with hex values for EVERY palette:
     - Alpha (CRITICAL: @white-alpha-_, @gray-alpha-_)
     - Black/White (@black, @white)
     - Gray (@gray-50 through @gray-1000)
     - Blue (@blue-50 through @blue-1000)
     - Red (@red-100 through @red-1000)
     - Green (@green-100 through @green-1000)
     - Orange (@orange-100 through @orange-1000)
     - Yellow (@yellow-100 through @yellow-1000)
     - Lightblue (@lightblue-100 through @lightblue-1000)
     - Purple (@purple-100 through @purple-1000)
     - Pink (@pink-100 through @pink-1000)
     - Herbal Green (@herbal-green-100 through @herbal-green-1000)
6. **Shadows**: Complete definitions (@shadow-xs to @shadow-xl) with exact CSS values

### Quality Checklist:

- [ ] Read ALL files from design-system/ directory (verify with find command)
- [ ] NO "etc." or "and others" - document every value
- [ ] Semantic colors show BOTH mapping and resolved hex
- [ ] Alpha colors fully documented (used in overlays!)
- [ ] Typography values match source exactly (check for unitless)
- [ ] Every primitive color palette has complete table
- [ ] Cross-referenced semantic → primitive → hex in single view

**Extract from:** `~/work/datacapt/frontend/common/styles/design-system/` directory
**Organize by:** Variable type with complete value tables
**Format:** Markdown tables - prioritize standalone reference over brevity

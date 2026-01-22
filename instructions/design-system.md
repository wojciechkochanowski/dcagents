# Design System Reference

Comprehensive reference for all design system variables and mixins in the clinical trials application.

## Spacing Variables

All spacing tokens from smallest to largest:

| Variable | Value    | Pixels | Usage                    |
| -------- | -------- | ------ | ------------------------ |
| `@4xs`   | 0.125rem | 2px    | Minimal spacing, borders |
| `@3xs`   | 0.25rem  | 4px    | Small gaps, icon spacing |
| `@2xs`   | 0.375rem | 6px    | Button padding           |
| `@xs`    | 0.5rem   | 8px    | Standard small spacing   |
| `@sm`    | 0.75rem  | 12px   | Medium spacing           |
| `@md`    | 1rem     | 16px   | Standard spacing         |
| `@lg`    | 1.25rem  | 20px   | Large spacing            |
| `@xl`    | 1.5rem   | 24px   | Section spacing          |
| `@2xl`   | 2rem     | 32px   | Component gaps           |
| `@3xl`   | 2.5rem   | 40px   | Large sections           |
| `@4xl`   | 3rem     | 48px   | Major spacing            |
| `@5xl`   | 3.5rem   | 56px   | Layout spacing           |
| `@6xl`   | 4rem     | 64px   | Large layouts            |
| `@7xl`   | 4.5rem   | 72px   | Page sections            |
| `@8xl`   | 5rem     | 80px   | Major sections           |
| `@9xl`   | 6rem     | 96px   | Layout blocks            |
| `@10xl`  | 8rem     | 128px  | Large blocks             |
| `@11xl`  | 10rem    | 160px  | Maximum spacing          |

## Border Radius

| Variable              | Value    | Usage                    |
| --------------------- | -------- | ------------------------ |
| `@border-radius-3xs`  | 0.125rem | Minimal rounded corners  |
| `@border-radius-2xs`  | 0.25rem  | Small rounded corners    |
| `@border-radius-xs`   | 0.5rem   | Standard rounded corners |
| `@border-radius-sm`   | 0.75rem  | Medium rounded corners   |
| `@border-radius-md`   | 1rem     | Large rounded corners    |
| `@border-radius-lg`   | 1.25rem  | Very large corners       |
| `@border-radius-xl`   | 1.5rem   | Extra large corners      |
| `@border-radius-2xl`  | 1.75rem  | Maximum corners          |
| `@border-radius-full` | 999rem   | Fully rounded (circles)  |

## Typography Variables

### Body Text - Medium Scale

- `@body-md-font-size`: 1rem (16px)
- `@body-md-line-height`: 1.5rem (24px)
- `@body-md-font-weight`: 500
- `@body-md-font-weight-emphasis`: 600

### Body Text - Small Scale

- `@body-sm-font-size`: 0.875rem (14px)
- `@body-sm-line-height`: 1.375rem (22px)
- `@body-sm-font-weight`: 500
- `@body-sm-font-weight-emphasis`: 600

### Body Text - Extra Small Scale

- `@body-xs-font-size`: 0.75rem (12px)
- `@body-xs-line-height`: 1.25rem (20px)
- `@body-xs-font-weight`: 500
- `@body-xs-font-weight-emphasis`: 600

### Heading Scale Variables

- `@heading-lg-font-size`: 2rem (32px)
- `@heading-lg-line-height`: 2.5rem (40px)
- `@heading-lg-font-weight`: 600

- `@heading-md-font-size`: 1.5rem (24px)
- `@heading-md-line-height`: 2rem (32px)
- `@heading-md-font-weight`: 600

- `@heading-sm-font-size`: 1.25rem (20px)
- `@heading-sm-line-height`: 1.75rem (28px)
- `@heading-sm-font-weight`: 600

- `@heading-xs-font-size`: 1 (unitless, compiles to 1rem)
- `@heading-xs-line-height`: 1.5rem (24px)
- `@heading-xs-font-weight`: 600

### Label Scale Variables

- `@label-sm-font-size`: 0.625rem (10px)
- `@label-sm-line-height`: 0.875rem (14px)
- `@label-sm-font-weight`: 500
- `@label-sm-font-weight-emphasis`: 600

- `@label-xs-font-size`: 0.5rem (8px)
- `@label-xs-line-height`: 0.75rem (12px)
- `@label-xs-font-weight`: 500
- `@label-xs-font-weight-emphasis`: 600

### Font Family

- `@base-font-family`: 'TTCommons', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif

## Typography Mixins

Use mixins instead of individual font properties:

### Body Mixins

| Mixin                 | Usage                                     |
| --------------------- | ----------------------------------------- |
| `.body-md()`          | Standard body text (16px, 500 weight)     |
| `.body-md-emphasis()` | Emphasized body text (16px, 600 weight)   |
| `.body-sm()`          | Small body text (14px, 500 weight)        |
| `.body-sm-emphasis()` | Emphasized small text (14px, 600 weight)  |
| `.body-xs()`          | Extra small text (12px, 500 weight)       |
| `.body-xs-emphasis()` | Emphasized extra small (12px, 600 weight) |

### Heading Mixins

| Mixin           | Usage                                   |
| --------------- | --------------------------------------- |
| `.heading-lg()` | Large headings (32px, 600 weight)       |
| `.heading-md()` | Medium headings (24px, 600 weight)      |
| `.heading-sm()` | Small headings (20px, 600 weight)       |
| `.heading-xs()` | Extra small headings (16px, 600 weight) |

### Label Mixins

| Mixin                  | Usage                                           |
| ---------------------- | ----------------------------------------------- |
| `.label-sm()`          | Small labels (10px, 500 weight)                 |
| `.label-sm-emphasis()` | Emphasized small labels (10px, 600 weight)      |
| `.label-xs()`          | Extra small labels (8px, 500 weight)            |
| `.label-xs-emphasis()` | Emphasized extra small labels (8px, 600 weight) |

## Semantic Color Variables

### Foreground Colors

| Variable | Maps To | Resolved Value |
| -------- | ------- | -------------- |
| `@fg-primary` | `@gray-1000` | `#060a32` |
| `@fg-secondary` | `@gray-600` | `#727385` |
| `@fg-secondary_hover` | `@gray-700` | `#585d70` |
| `@fg-tertiary` | `@gray-500` | `#9697ac` |
| `@fg-tertiary_hover` | `@gray-600` | `#727385` |
| `@fg-quaternary` | `@gray-400` | `#b1b3cc` |
| `@fg-quaternary_hover` | `@gray-500` | `#9697ac` |
| `@fg-white` | `@white` | `#ffffff` |
| `@fg-disabled` | `@gray-300` | `#d1d2e0` |
| `@fg-disabled_subtle` | `@gray-200` | `#e7e7f0` |
| `@fg-brand-primary` | `@blue-600` | `#3a63f3` |
| `@fg-error-primary` | `@red-600` | `#ff6a5b` |
| `@fg-warning-primary` | `@orange-600` | `#ff8d54` |
| `@fg-alert-primary` | `@yellow-600` | `#ffca54` |
| `@fg-success-primary` | `@green-600` | `#1bcfa9` |
| `@fg-info-primary` | `@lightblue-600` | `#63caff` |

### Background Colors

| Variable | Maps To | Resolved Value |
| -------- | ------- | -------------- |
| `@bg-primary` | `@white` | `#ffffff` |
| `@bg-primary-solid` | `@gray-1000` | `#060a32` |
| `@bg-secondary` | `@gray-50` | `#f7f8f9` |
| `@bg-secondary_hover` | `@gray-100` | `#f0f1f4` |
| `@bg-secondary_alt` | `@blue-50` | `#f7f9fd` |
| `@bg-secondary-solid` | `@blue-1000` | `#191d51` |
| `@bg-tertiary` | `@gray-100` | `#f0f1f4` |
| `@bg-tertiary_hover` | `@gray-200` | `#e7e7f0` |
| `@bg-quaternary` | `@gray-200` | `#e7e7f0` |
| `@bg-active` | `@blue-100` | `#e9edff` |
| `@bg-disabled` | `@gray-300` | `#d1d2e0` |
| `@bg-disabled_subtle` | `@gray-100` | `#f0f1f4` |
| `@bg-overlay` | `@gray-alpha-700` | `rgba(6, 10, 50, 0.64)` |
| `@bg-brand-primary` | `@blue-100` | `#e9edff` |
| `@bg-brand-solid` | `@blue-600` | `#3a63f3` |
| `@bg-brand-solid_hover` | `@blue-700` | `#284fe0` |
| `@bg-error-primary` | `@red-100` | `#ffedea` |
| `@bg-error-solid` | `@red-600` | `#ff6a5b` |
| `@bg-error-solid_hover` | `@red-700` | `#e6554a` |
| `@bg-warning-primary` | `@orange-100` | `#fff1e3` |
| `@bg-warning-solid` | `@orange-600` | `#ff8d54` |
| `@bg-alert-primary` | `@yellow-100` | `#fff5e3` |
| `@bg-alert-solid` | `@yellow-600` | `#ffca54` |
| `@bg-success-primary` | `@green-100` | `#e7fbf4` |
| `@bg-success-solid` | `@green-600` | `#1bcfa9` |
| `@bg-info-primary` | `@lightblue-100` | `#e3f5ff` |
| `@bg-info-solid` | `@lightblue-600` | `#63caff` |

### Border Colors

| Variable | Maps To | Resolved Value |
| -------- | ------- | -------------- |
| `@border-primary` | `@gray-300` | `#d1d2e0` |
| `@border-secondary` | `@gray-200` | `#e7e7f0` |
| `@border-tertiary` | `@gray-100` | `#f0f1f4` |
| `@border-disabled` | `@gray-100` | `#f0f1f4` |
| `@border-disabled_bold` | `@gray-300` | `#d1d2e0` |
| `@border-brand` | `@blue-600` | `#3a63f3` |
| `@border-error` | `@red-600` | `#ff6a5b` |

### Text Colors

| Variable | Maps To | Resolved Value |
| -------- | ------- | -------------- |
| `@text-primary` | `@gray-1000` | `#060a32` |
| `@text-primary_on-brand` | `@white` | `#ffffff` |
| `@text-secondary` | `@gray-600` | `#727385` |
| `@text-secondary_on-brand` | `@gray-200` | `#e7e7f0` |
| `@text-tertiary` | `@gray-500` | `#9697ac` |
| `@text-tertiary_on-brand` | `@gray-300` | `#d1d2e0` |
| `@text-white` | `@white` | `#ffffff` |
| `@text-disabled` | `@gray-500` | `#9697ac` |
| `@text-placeholder` | `@gray-500` | `#9697ac` |
| `@text-brand-primary` | `@blue-800` | `#1c3cb6` |
| `@text-brand-secondary` | `@blue-600` | `#3a63f3` |
| `@text-brand-tertiary` | `@blue-500` | `#567cf5` |
| `@text-error-primary` | `@red-600` | `#ff6a5b` |
| `@text-warning-primary` | `@orange-600` | `#ff8d54` |
| `@text-success-primary` | `@green-600` | `#1bcfa9` |


## Primitive Color Variables

### Alpha

| Variable | Value |
| -------- | ----- |
| `@white-alpha-50` | `rgba(255, 255, 255, 0.04)` |
| `@white-alpha-100` | `rgba(255, 255, 255, 0.08)` |
| `@white-alpha-200` | `rgba(255, 255, 255, 0.12)` |
| `@white-alpha-300` | `rgba(255, 255, 255, 0.16)` |
| `@white-alpha-400` | `rgba(255, 255, 255, 0.24)` |
| `@white-alpha-500` | `rgba(255, 255, 255, 0.32)` |
| `@white-alpha-600` | `rgba(255, 255, 255, 0.48)` |
| `@white-alpha-700` | `rgba(255, 255, 255, 0.64)` |
| `@white-alpha-800` | `rgba(255, 255, 255, 0.72)` |
| `@white-alpha-900` | `rgba(255, 255, 255, 0.8)` |
| `@white-alpha-1000` | `rgba(255, 255, 255, 0.98)` |
| `@gray-alpha-50` | `rgba(6, 10, 50, 0.04)` |
| `@gray-alpha-100` | `rgba(6, 10, 50, 0.08)` |
| `@gray-alpha-200` | `rgba(6, 10, 50, 0.12)` |
| `@gray-alpha-300` | `rgba(6, 10, 50, 0.16)` |
| `@gray-alpha-400` | `rgba(6, 10, 50, 0.24)` |
| `@gray-alpha-500` | `rgba(6, 10, 50, 0.32)` |
| `@gray-alpha-600` | `rgba(6, 10, 50, 0.48)` |
| `@gray-alpha-700` | `rgba(6, 10, 50, 0.64)` |
| `@gray-alpha-800` | `rgba(6, 10, 50, 0.72)` |
| `@gray-alpha-900` | `rgba(6, 10, 50, 0.8)` |
| `@gray-alpha-1000` | `rgba(6, 10, 50, 0.98)` |

### Black White

| Variable | Value |
| -------- | ----- |
| `@black` | `#000000` |
| `@white` | `#ffffff` |

### Blue

| Variable | Value |
| -------- | ----- |
| `@blue-50` | `#f7f9fd` |
| `@blue-100` | `#e9edff` |
| `@blue-200` | `#c7d2fd` |
| `@blue-300` | `#a2b6fa` |
| `@blue-400` | `#7d99f7` |
| `@blue-500` | `#567cf5` |
| `@blue-600` | `#3a63f3` |
| `@blue-700` | `#284fe0` |
| `@blue-800` | `#1c3cb6` |
| `@blue-900` | `#14298c` |
| `@blue-1000` | `#191d51` |

### Gray

| Variable | Value |
| -------- | ----- |
| `@gray-50` | `#f7f8f9` |
| `@gray-100` | `#f0f1f4` |
| `@gray-200` | `#e7e7f0` |
| `@gray-300` | `#d1d2e0` |
| `@gray-400` | `#b1b3cc` |
| `@gray-500` | `#9697ac` |
| `@gray-600` | `#727385` |
| `@gray-700` | `#585d70` |
| `@gray-800` | `#3b3e55` |
| `@gray-900` | `#323343` |
| `@gray-1000` | `#060a32` |

### Green

| Variable | Value |
| -------- | ----- |
| `@green-100` | `#e7fbf4` |
| `@green-200` | `#c2f6e6` |
| `@green-300` | `#9bf0d7` |
| `@green-400` | `#74e9c8` |
| `@green-500` | `#4addbc` |
| `@green-600` | `#1bcfa9` |
| `@green-700` | `#16a88a` |
| `@green-800` | `#11826e` |
| `@green-900` | `#0d6355` |
| `@green-1000` | `#08463f` |

### Herbal Green

| Variable | Value |
| -------- | ----- |
| `@herbal-green-100` | `#e2f6de` |
| `@herbal-green-200` | `#d0efcc` |
| `@herbal-green-300` | `#b0e4ad` |
| `@herbal-green-400` | `#8fd88e` |
| `@herbal-green-500` | `#6ccc6d` |
| `@herbal-green-600` | `#45b84c` |
| `@herbal-green-700` | `#20a639` |
| `@herbal-green-800` | `#1a812e` |
| `@herbal-green-900` | `#146225` |
| `@herbal-green-1000` | `#0f481b` |

### Lightblue

| Variable | Value |
| -------- | ----- |
| `@lightblue-100` | `#e3f5ff` |
| `@lightblue-200` | `#c3e9ff` |
| `@lightblue-300` | `#a3dcff` |
| `@lightblue-400` | `#83d0ff` |
| `@lightblue-500` | `#73c8ff` |
| `@lightblue-600` | `#63caff` |
| `@lightblue-700` | `#4fa5db` |
| `@lightblue-800` | `#3c81b7` |
| `@lightblue-900` | `#2c6393` |
| `@lightblue-1000` | `#1e4770` |

### Orange

| Variable | Value |
| -------- | ----- |
| `@orange-100` | `#fff1e3` |
| `@orange-200` | `#ffd9bf` |
| `@orange-300` | `#ffc09b` |
| `@orange-400` | `#ffa678` |
| `@orange-500` | `#ff9466` |
| `@orange-600` | `#ff8d54` |
| `@orange-700` | `#db7344` |
| `@orange-800` | `#b75c36` |
| `@orange-900` | `#934728` |
| `@orange-1000` | `#70341a` |

### Pink

| Variable | Value |
| -------- | ----- |
| `@pink-100` | `#ffe6f4` |
| `@pink-200` | `#ffcbe8` |
| `@pink-300` | `#ffcbe8` |
| `@pink-400` | `#ff8fc9` |
| `@pink-500` | `#ff77be` |
| `@pink-600` | `#fe63b4` |
| `@pink-700` | `#e657a2` |
| `@pink-800` | `#cb4d8e` |
| `@pink-900` | `#a33f74` |
| `@pink-1000` | `#7b3058` |

### Purple

| Variable | Value |
| -------- | ----- |
| `@purple-100` | `#f2eefe` |
| `@purple-200` | `#dfd7fc` |
| `@purple-300` | `#c9bcfa` |
| `@purple-400` | `#b29ff3` |
| `@purple-500` | `#947fe7` |
| `@purple-600` | `#7760db` |
| `@purple-700` | `#5f49c0` |
| `@purple-800` | `#4936a3` |
| `@purple-900` | `#332686` |
| `@purple-1000` | `#20176a` |

### Red

| Variable | Value |
| -------- | ----- |
| `@red-100` | `#ffedea` |
| `@red-200` | `#ffd4cc` |
| `@red-300` | `#ffb8ac` |
| `@red-400` | `#ff9c8d` |
| `@red-500` | `#ff8073` |
| `@red-600` | `#ff6a5b` |
| `@red-700` | `#e6554a` |
| `@red-800` | `#cc413c` |
| `@red-900` | `#b22f30` |
| `@red-1000` | `#8f2023` |

### Yellow

| Variable | Value |
| -------- | ----- |
| `@yellow-100` | `#fff5e3` |
| `@yellow-200` | `#ffebbf` |
| `@yellow-300` | `#ffe19b` |
| `@yellow-400` | `#ffd577` |
| `@yellow-500` | `#ffcb65` |
| `@yellow-600` | `#ffca54` |
| `@yellow-700` | `#dba043` |
| `@yellow-800` | `#b78234` |
| `@yellow-900` | `#936726` |
| `@yellow-1000` | `#704c1a` |


## Shadows

| Variable     | Usage                               |
| ------------ | ----------------------------------- |
| `@shadow-xs` | Minimal shadow for subtle elevation |
| `@shadow-sm` | Small shadow for buttons, cards     |
| `@shadow-md` | Medium shadow for dropdowns, modals |
| `@shadow-lg` | Large shadow for overlays           |
| `@shadow-xl` | Maximum shadow for major overlays   |

### Shadow Definitions

- `@shadow-xs`: 0px 1px 2px 0px rgba(6, 10, 50, 0.05)
- `@shadow-sm`: 0px 1px 3px 0px rgba(6, 10, 50, 0.1), 0px 1px 2px -1px rgba(6, 10, 50, 0.1)
- `@shadow-md`: 0px 4px 6px -1px rgba(6, 10, 50, 0.1), 0px 2px 4px -2px rgba(6, 10, 50, 0.06)
- `@shadow-lg`: 0px 12px 16px -4px rgba(6, 10, 50, 0.12), 0px 4px 6px -2px rgba(6, 10, 50, 0.04)
- `@shadow-xl`: 0px 24px 48px -8px rgba(6, 10, 50, 0.2), 0px 4px 4px -2px rgba(6, 10, 50, 0.04)

## Usage Examples

### Correct Variable Usage

```less
@import "common/styles/variables.less";

.component {
  // ✅ Use semantic colors
  color: @fg-primary;
  background: @bg-secondary;

  // ✅ Use spacing variables
  padding: @xs @md;
  gap: @xl;

  // ✅ Use border radius
  border-radius: @border-radius-xs;

  // ✅ Use shadows
  box-shadow: @shadow-sm;
}

// ✅ Use typography mixins
.title {
  .heading-xs();
}
.description {
  .body-sm-emphasis();
}
```

### Avoid Hardcoded Values

```less
// ❌ Never hardcode these values
.bad-component {
  color: #333333; // Use @fg-primary instead
  padding: 8px 16px; // Use @xs @md instead
  font-size: 14px; // Use .body-sm() instead
  border-radius: 8px; // Use @border-radius-xs instead
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Use @shadow-sm instead
}
```

## Design System File Locations

All design system variables are located in:
`~/work/datacapt/frontend/common/styles/design-system/`

### Key Files Structure

```
design-system/
├── index.less                          # Main index file
├── spacing.less                        # @xs, @md, @xl spacing variables
├── border-radius.less                  # @border-radius-* variables
├── shadows.less                        # @shadow-* definitions
├── typography/
│   ├── index.less                      # Typography index
│   ├── body.less                       # Body text variables & mixins
│   ├── headings.less                   # Heading variables & mixins
│   └── labels.less                     # Label variables & mixins
├── colors-semantic/
│   ├── foreground-colors.less          # @fg-* variables
│   ├── background-colors.less          # @bg-* variables
│   ├── text-colors.less                # @text-* variables (legacy)
│   └── border-colors.less              # @border-* variables
└── colors-primitives/
    ├── index.less                      # Primitives index
    ├── black-white.less                # @black, @white
    ├── gray.less                       # @gray-* scale
    ├── blue.less                       # @blue-* scale
    ├── red.less                        # @red-* scale
    ├── green.less                      # @green-* scale
    ├── orange.less                     # @orange-* scale
    ├── yellow.less                     # @yellow-* scale
    ├── purple.less                     # @purple-* scale
    ├── pink.less                       # @pink-* scale
    ├── lightblue.less                  # @lightblue-* scale
    ├── herbal-green.less               # @herbal-green-* scale
    └── alpha.less                      # Alpha/transparency variables
```

## Variable Validation

**All design system variables must exist in:**
`~/work/datacapt/frontend/apps/storybook/src/generated-tokens.ts`

This file contains the authoritative list of available design tokens. Always check this file before using new variables.

## Import Statement

Always include at the top of LESS files:

```less
@import "common/styles/variables.less";
```

This imports all design system variables and makes them available for use.

## Best Practices

1. **Prefer semantic variables** over primitive ones (`@fg-primary` vs `@gray-1000`)
2. **Use typography mixins** instead of individual font properties
3. **Always import variables** with `@import "common/styles/variables.less";`
4. **Validate variables exist** in `generated-tokens.ts` before using
5. **Use rem units** - never hardcode px values (except 1px borders)
6. **Follow BEM naming** for CSS classes
7. **Max 3-4 nesting levels** in LESS files

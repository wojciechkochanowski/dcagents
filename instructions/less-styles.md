# LESS Styles (.less files)

## Project Context

- Clinical trials application built with React 19 + TypeScript
- Frontend located in `C:/praca/datacapt/frontend/` with main app in `apps/datacapt/`
- Uses Ant Design as base UI library with custom Datacapt components overlay
- Design system variables located in `C:/praca/datacapt/frontend/common/styles/design-system/`

## File Location & Naming

- Component styles: Same directory as component (`Component.less`)
- Global styles: `common/styles/` directory
- File names: PascalCase matching component name (`DatacButton.less`)

## Component Structure Pattern

```
ComponentName/
├── index.ts           // Export
├── ComponentName.tsx  // Component with: import './ComponentName.less'
├── ComponentName.less // Styles with @import 'common/styles/variables.less';
```

## Style Import Structure

```less
// Component.less
@import "common/styles/variables.less";

.component {
  // styles here
}
```

**CRITICAL**: Always use `@import 'common/styles/variables.less';` - use only this import for design system access.

## Design System Variables

### Variable Hierarchy

1. **Semantic variables** (preferred): `@fg-primary`, `@bg-secondary`
2. **Primitive variables**: `@color-blue-500`, `@space-md`
3. **Standard values**: Only in rem units, never px

**Location**: `C:/praca/datacapt/frontend/common/styles/design-system/`

**Variables must exist** in `C:/praca/datacapt/frontend/apps/storybook/src/generated-tokens.ts`

### Usage Examples

```less
.component {
  // ✅ Use semantic variables
  color: @fg-primary;
  background: @bg-secondary;
  padding: @sm @md; // 8px 16px
  gap: @xl; // 24px
  border-radius: @border-radius-xs;

  // ✅ Use typography mixins
  .body-md();

  // ❌ Never use hardcoded values
  // color: #333333;
  // padding: 8px 16px;
  // font-size: 14px;
}
```

**Units**: Use rem (default) or design system variables. px only for borders (1px).

## 🚨 CRITICAL: BEM Class Structure

**MANDATORY**: LESS nesting MUST mirror HTML structure exactly.

### Correct BEM Pattern

```tsx
// TSX:
<div className="component">
  <div className="component__parent">
    <div className="component__parent__child">...</div>
  </div>
</div>
```

```less
// ✅ CORRECT - nesting mirrors HTML
.component {
  &__parent {
    &__child {
      // generates .component__parent__child
    }
  }
}

// ❌ WRONG - flat when DOM is nested
.component {
  &__parent {
  }
  &__parent-child {
  } // should be nested inside __parent
}
```

### Full BEM Example

```less
.component {
  padding: @md;
  background: @bg-primary;

  // Modifiers
  &--primary {
    color: @fg-on-primary;
  }

  &--large {
    padding: @lg;
  }

  // Elements - nested to match HTML
  &__header {
    margin-bottom: @sm;
    border-bottom: 1px solid @border-subtle;
  }

  &__content {
    .body-md();
    color: @fg-secondary;

    &__text {
      flex: 1;
      .ellipsis();

      &__meta {
        color: @text-secondary;
      }
    }
  }

  &__button {
    margin-top: @md;

    &--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}
```

### Anti-Patterns

```less
// ❌ WRONG - flat structure
&__option-content {
}
&__option-text {
}
&__option-text-meta {
}

// ✅ CORRECT - nested structure
&__option {
  &__content {
    &__text {
      &__meta {
      }
    }
  }
}
```

## Component Integration

```tsx
// Component.tsx
import "./Component.less";

const Component = ({ type, size, className }) => (
  <div
    className={`component component--${type} component--${size} ${className || ""}`}
  >
    <div className="component__header">Header</div>
    <div className="component__content">Content</div>
    <DatacButton className="component__button">Action</DatacButton>
  </div>
);
```

## Component Integration Patterns

### Modal Sizing Standards

- Delete confirmations: `width: 30rem`
- Form modals: `width: 40rem`
- Use design system variables for positioning: `right: @xs`

### Button Type Support

- **Don't override** DatacButton styles with `!important`
- **Let components control** their appearance through props
- **Avoid** hardcoded colors that break type variants (primary/ghost/outline)

## Anti-Patterns to Avoid

1. **Hardcoded values**: `24px` → `@xl`, `#1890ff` → `@fg-brand-primary`
2. **Manual typography**: `font-size: 16px` → `.heading-xs()`
3. **Cascading overrides**: Parent selectors targeting child components with `!important`
4. **Mixed units**: Inconsistent px/rem usage
5. **Component conflicts**: Styles that break DatacButton/DatacModal behavior

## Review Checklist

- [ ] `@import 'common/styles/variables.less';` at top
- [ ] No hardcoded values (use `@xl`, `@fg-primary` etc.)
- [ ] Typography mixins (`.body-md()` vs manual font properties)
- [ ] BEM naming (`component__element--modifier`)
- [ ] No `!important` overrides on child components
- [ ] Max 3-4 nesting levels
- [ ] Focus states and accessibility support

**Correction Standards:**

- Maintain original functionality while improving code quality
- Prioritize semantic variables over primitive ones
- Test changes against Ant Design integration

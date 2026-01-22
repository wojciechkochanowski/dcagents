# React Components (.tsx files)

## File Structure
Components organized in dedicated directories with LESS styling.

**Formatting**: Prettier handles import order and code formatting - don't manually adjust.

## Naming Conventions
- **Components**: PascalCase (`DatacButton`, `UserProfile`)
- **Variables/functions**: camelCase (`userName`, `handleClick`)
- **Component files**: PascalCase (`DatacButton.tsx`)
- **Props interfaces**: PascalCase with `Props` suffix (`DatacButtonProps`)

## Component Structure
```
ComponentName/
├── index.ts              // Export
├── ComponentName.tsx     // Main component
├── ComponentName.less    // Styles
```

## Component Template
```tsx
import React from 'react'
import { Button } from 'antd'
import './ComponentName.less'

interface ComponentNameProps {
  type?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  type = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}) => (
  <div className={`component-name component-name--${type} component-name--${size} ${className || ''}`}>
    {children}
  </div>
)
```

## Index Export Pattern
```tsx
// index.ts
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

## UI Components

### Icons - DatacIcon
```tsx
<DatacIcon 
  name="icon-name"      // SVG filename from Figma
  type="outline"        // outline | filled
  size="small"          // small | medium | large
  className="custom-icon" // Optional additional styles
/>
```
**IMPORTANT**: Check `common/assets/` for existing icons before adding new ones. Images use DatacIcon - never embed SVG code or files directly.

### Buttons - DatacButton
```tsx
<DatacButton 
  type="primary"        // primary | secondary | ghost | text
  size="small"          // small | medium | large
  shape="oval"          // oval | round | square
  disabled={false}
  loading={false}
  className="custom-btn"
  icon='icon-name'      // optional icon at start
  suffixIcon='icon-name' // optional icon at end
>
  Button text
</DatacButton>
```
For icon-only buttons, use `icon` prop without text content.

### Component Hierarchy
Prefer `common/components/` over Antd:
- Use `DatacInformationMessage` instead of Antd `Alert`
- Use `DatacButton` instead of Antd `Button`
- Use `DatacSelect` instead of Antd `Select`

## Translations
**WARNING: Only add to `en.json`** - other languages handled by separate agent

**US English spelling**: Use American spellings (randomization, customization, organize) not British (randomisation, customisation, organise)

**No hardcoded text** - use translation system

```tsx
import { useScopedIntl } from 'common/hooks'

const Component = () => {
  const intlSomething = useScopedIntl('xxx.yyy.zzz.something')
  const intl = useScopedIntl()
  
  return (
    <div>
      <div>{intlSomething('text')}</div>
      <div>{intl('common.common_text')}</div>
    </div>
  )
}
```

Add translations to `common/intl/en.json` only. Other languages via 'tr' command.

## Best Practices
- Always define TypeScript interfaces for props
- Use functional components with hooks
- Import styles at component level
- Use semantic HTML elements when possible
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Keep components focused and reusable
- Use default props for optional values
- Spread remaining props to underlying elements
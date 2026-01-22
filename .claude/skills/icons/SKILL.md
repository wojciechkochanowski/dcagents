---
name: icons
description: "Guidelines for using SVG icons, DatacIcon component, and icon-only buttons in Datacapt frontend. Use this skill when working with icons, adding new icons, or creating icon-only buttons."
model: sonnet
---

## Component: DatacIcon

**Always use DatacIcon** for displaying icons. Never embed SVG code directly or use raw SVG files.

Location: `common/components/DatacIcon`

### Basic Usage

```tsx
import { DatacIcon } from "common/components";

<DatacIcon
  name="icon-name"              // Icon name from Figma (exact match)
  type="grey"                   // See Icon Types below
  size="normal"                 // xs | sm | md | small | normal | big | xbig | xxbig
  raw={false}                   // If true, renders only SVG without wrapper
  className="custom-class"      // Optional CSS class
  onClick={() => {}}            // Optional click handler
  tooltip="Tooltip text"        // Optional tooltip
  tooltipPlacement="top"        // top | bottom | left | right
  disabled={false}              // Disabled state
  round={false}                 // Round background
  animation="spin"              // Optional animation (spin)
/>
```

### Icon Types (Semantic Styling)

Modern semantic types:
- `outline` - Outlined icon style
- `outline-solid` - Outlined with solid background
- `outline-brand` - Outlined in brand color
- `primary-solid` - Primary color with solid background
- `success-solid` - Success color with solid background
- `error-solid` - Error color with solid background
- `warning-solid` - Warning color with solid background
- `alert-solid` - Alert color with solid background
- `primary` - Primary foreground color
- `secondary` - Secondary foreground color
- `success` - Success foreground color
- `error` - Error foreground color
- `warning` - Warning foreground color
- `alert` - Alert foreground color
- `disabled` - Disabled state color
- `dark-mode` - Dark mode variant

Deprecated (legacy):
- `transparent` - Use `raw={true}` instead
- `blue` - Use `type="primary"` instead
- `grey` - Use `type="secondary"` instead
- `red` - Use `type="error"` instead
- `white` - Use custom styling
- `green` - Use `type="success"` instead
- `light-green` - Use `type="success"` with custom shade
- `yellow` - Use `type="warning"` instead
- `white-on-semi-transparent` - Use custom styling
- `no-background` - Use `raw={true}` instead

### Size Reference

| Size | Usage |
|------|-------|
| `xs` | Extra small icons (12px equivalent) |
| `sm` | Small icons (14px equivalent) |
| `md` | Medium icons (16px equivalent) |
| `small` | Legacy small (use `sm` instead) |
| `normal` | Default size (18-20px) |
| `big` | Large icons (24px) |
| `xbig` | Extra large (32px) |
| `xxbig` | Maximum size (48px) |

### Raw Mode

When `raw={true}`, DatacIcon renders only the SVG element without wrapper div or button.

**Use raw mode when:**
- Custom wrapper/styling needed
- Building composite components

```tsx
// Manual raw mode for custom wrapper
<div className="custom-wrapper">
  <DatacIcon name="calendar" raw />
</div>
```

## Icon Names from Figma

**CRITICAL:** Icon names must match Figma exactly. Use the exact icon name from Figma design system.

All available icons are defined in Figma. Icon name in code = icon name in Figma.

### Finding Icon Names

**Check icon maps for available names:**
- Design system icons: `common/components/DatacIcon/design-system-icons.tsx`
- Legacy icons: `common/components/DatacIcon/icons.tsx`

**Search by name:**
```bash
fd "calendar" common/assets/icons/
fd "bell" common/assets/icons/alerts-and-feedback/
```

**Search by category:**
```bash
ls common/assets/icons/arrows/
ls common/assets/icons/communication/
```

### Icon Categories

Over 10,000+ categorized icons in `common/assets/icons/`:

- `accessibility/` - Accessibility features
- `alerts-and-feedback/` - Notifications, alerts, feedback
- `alphabet/` - Letter icons (A-Z)
- `arrows/` - Directional arrows, chevrons
- `automotive/` - Car-related icons
- `building/` - Buildings, structures
- `charts-and-graphs/` - Data visualization
- `clothing-and-fashion/` - Fashion items
- `communication/` - Messages, mail, phone
- `date-and-time/` - Calendar, clock, time
- `design-and-editor/` - Design tools, editing
- `development/` - Code, programming, dev tools
- `device-and-electronic/` - Devices, electronics
- `education/` - School, learning, books
- `emojis/` - Emoji faces
- `file-and-folder/` - Files, folders, documents
- `finance/` - Money, payments, finance
- `food-and-drink/` - Food items, beverages
- `gaming/` - Games, entertainment
- `general/` - General purpose icons
- `home-and-furniture/` - Home, furniture
- `layout-and-editor/` - Layout tools
- `location/` - Maps, navigation, location
- `maps/` - Geographic, maps
- `mathematics/` - Math symbols
- `medical/` - Medical, health
- `nature/` - Plants, animals, weather
- `numbers/` - Number icons
- `people/` - Users, profiles, people
- `pets-and-nature/` - Animals, nature
- `programming/` - Programming languages, tools
- `science/` - Scientific icons
- `security/` - Security, locks, shields
- `shapes/` - Geometric shapes
- `shopping/` - Shopping, ecommerce
- `social-media/` - Social platforms
- `sports/` - Sports, activities
- `text-formatting/` - Text editing tools
- `transportation/` - Vehicles, transport
- `travel/` - Travel, tourism
- `ui-ux/` - UI elements
- `weather/` - Weather conditions

### Legacy Icons

Located in `common/assets/images/` (mostly Feather icon set):

```tsx
// Legacy icon from iconMap
<DatacIcon name="chevronUp" />
<DatacIcon name="edit" />
<DatacIcon name="trash" />
```

## Icon-Only Buttons with DatacButton

DatacButton supports icon-only configuration using the `icon` prop without children.

**IMPORTANT:** Always pass icons to DatacButton via `icon` or `suffixIcon` props, never render DatacIcon inside.

Location: `common/components/DatacButton`

### Basic Icon Button

```tsx
import { DatacButton } from "common/components";

<DatacButton
  icon="plus"                  // Icon name from Figma
  type="primary"               // Button style
  size="small"                 // small | medium | large | xlarge | xsmall
  shape="rounded"              // rounded | oval
  onClick={() => {}}
/>
```

### Icon Button Sizes

| Size | Height | Usage |
|------|--------|-------|
| `xsmall` | 24px | Very compact buttons |
| `small` | 32px | Default compact size |
| `medium` | 40px | Standard size |
| `large` | 48px | Prominent buttons |
| `xlarge` | 56px | Maximum size |

### Icon Button Shapes

- `rounded` - Standard rounded corners (default)
- `oval` - Fully rounded (pill shape)

### Icon Button Types

- `primary` - Primary action (blue background)
- `outline` - Outlined style (default)
- `white` - White background
- `gray` - Gray background
- `error` - Error/danger action (red)
- `dashed` - Dashed border
- `text` - Text-only style
- `link` - Link style

### Icon with Text

```tsx
// Icon at start (prefix)
<DatacButton icon="plus" type="primary">
  Add Item
</DatacButton>

// Icon at end (suffix)
<DatacButton suffixIcon="arrow-right" type="outline">
  Next
</DatacButton>

// Both prefix and suffix
<DatacButton icon="download" suffixIcon="chevron-down">
  Export
</DatacButton>
```

## Common Patterns

### Action Buttons

```tsx
// Edit button
<DatacButton icon="pencil" type="outline" size="small" />

// Delete button
<DatacButton icon="trash" type="error" size="small" />

// Add button
<DatacButton icon="plus" type="primary" size="medium" />

// Settings button
<DatacButton icon="settings" type="gray" size="small" />
```

### Navigation Icons

```tsx
// Back button
<DatacButton icon="arrow-left" type="outline" />

// Forward button
<DatacButton icon="arrow-right" type="outline" />

// Close button
<DatacButton icon="x" type="text" size="small" />
```

### Icon with Loading State

```tsx
<DatacButton
  icon="check"
  loading={isSubmitting}
  disabled={isSubmitting}
>
  Save
</DatacButton>
```

### Disabled Icon Button

```tsx
<DatacButton
  icon="trash"
  disabled={!canDelete}
  type="error"
/>
```

## Troubleshooting

### Icon Not Found

```
Error: Icon 'my-icon' not found
```

**Solutions:**
1. Check icon exists in icon maps
2. Verify icon name matches Figma exactly
3. Check icon maps for available names:
   - `common/components/DatacIcon/design-system-icons.tsx`
   - `common/components/DatacIcon/icons.tsx`

### Icon Not Displaying

**Check:**
1. Correct `name` prop value
2. Icon name matches Figma
3. No conflicting CSS hiding icon
4. Icon exists in icon maps

### Wrong Icon Size

**Solutions:**
1. Use appropriate `size` prop value
2. Check LESS styles not overriding
3. For custom sizes, use CSS with `raw={true}`

### Icon Color Not Working

**Solutions:**
1. Use appropriate `type` prop for semantic colors
2. Avoid inline styles or custom color props
3. Use design system color types

## Reference Implementations

**Icon-only buttons:**
- `apps/datacapt/src/components/studies/StudyDetailsContent/` - Action buttons
- `apps/datacapt/src/components/shared/DataTable/` - Table row actions

**Icon with text:**
- `apps/datacapt/src/components/SubjectRepository/` - Action buttons
- `apps/datacapt/src/components/calendar/` - Calendar controls

**Custom icon usage:**
- `apps/datacapt/src/components/settings/` - Settings icons
- `apps/datacapt/src/components/payments/` - Payment status icons

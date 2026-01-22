# Requirements - Password Input Redesign

## Task Description

Redesign password input component according to new Figma design - simplified registration flow without password confirmation field.

**Figma Design:** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=29743-68426

## Scope

**ONLY password input redesign** - NOT full registration flow implementation.

## Key Changes

### 1. **Remove Password Confirmation Field**

- Delete `passwordConfirmation` field from all forms
- Update interfaces to remove this field
- Remove validation for password confirmation

### 2. **New Password Validation UI**

Instead of tooltip on focus, display validation chips below password input:

**Validation Criteria (visible chips):**

- ✓/✗ 12 characters minimum
- ✓/✗ 1 lowercase letter
- ✓/✗ 1 uppercase letter
- ✓/✗ 1 number
- ✓/✗ 1 special character (example: # ? ! &)

**Chip States:**

- **Invalid:** Red background (`#FFEDEA`), red icon (`#FF6A5B`), X icon
- **Valid:** Green background (`#E7FBF4`), green icon (`#1BCFA9`), checkmark icon

### 3. **Password Show/Hide Toggle**

- "Show"/"Hide" text button inside input (right side)
- Blue color (#3A63F3) for button
- Password masked by default (dots)
- On click: toggle between masked/visible

### 4. **Character-by-Character Reveal**

- When typing: show each character for 1 second before masking
- Apply only when password is in masked mode

## Affected Components

### Auth Components (`/frontend/apps/datacapt/src/components/auth/`)

1. **SignUpForm** - registration form
2. **SignInForm** - login form
3. **ChangePasswordForm** - password change form
4. **RecoverPasswordForm** - password recovery form (if uses password input)

### Files to Modify

- `SignUpForm/SignUpForm.tsx` - remove passwordConfirmation field
- `SignInForm/SignInForm.tsx` - update password input
- `ChangePasswordForm/ChangePasswordForm.tsx` - update all password inputs
- `PasswordTooltip/` - **DELETE entire component** (replaced by inline chips)
- `validatePassword.ts` - may need export of individual validation functions

### New Component

Create `PasswordInput/` component in `/frontend/apps/datacapt/src/components/auth/`:

- Custom password input with validation chips
- Show/hide toggle
- Character reveal on typing
- Reusable across all auth forms

## Validation Rules (Unchanged)

```typescript
- Minimum 12 characters
- At least 1 lowercase letter (a-z)
- At least 1 uppercase letter (A-Z)
- At least 1 number (0-9)
- At least 1 special character: !@#$%^&*"')(+\-,./:;<=>?@[\]_`}{|~\\
- No whitespace allowed
```

## Technical Requirements

### Component Props Interface

```typescript
interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  minPasswordLength: number;
  showValidation?: boolean; // Show validation chips (default: true)
  label?: string;
}
```

### Validation State

Component maintains internal validation state for each criterion:

```typescript
interface ValidationState {
  minLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}
```

## Design Tokens (from Figma)

### Colors

- Primary Blue: `#3A63F3`
- Success BG: `#E7FBF4`
- Success Icon: `#1BCFA9`
- Error BG: `#FFEDEA`
- Error Icon: `#FF6A5B`
- Border: `#E7E7F0`
- Text Primary: `#060A32`
- Text Secondary: `#727385`

### Typography

- Body Regular: `Figtree Regular 14px` (line-height: 22px)
- Body Emphasis: `Figtree SemiBold 14px`
- Body Small Accent: `Figtree Medium 12px` (line-height: 20px)

### Spacing

- Chip gap: 12px
- Icon-text gap in chip: 8px
- Chip padding: 4px 8px 4px 4px
- Input height: 56px

## Out of Scope

- Full registration flow redesign
- Email field changes
- Terms of Use checkbox changes
- Account confirmation flow
- Language selector
- Company/name fields modifications

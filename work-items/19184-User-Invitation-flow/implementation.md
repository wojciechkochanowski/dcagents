# Implementation Plan - Password Input Redesign

## Phase 0: Research Existing Patterns

**Agent:** Main agent

**Task:** Investigate existing password input implementations and validation patterns.

**Research Questions:**

1. Are there similar password input components in the codebase?
2. How is password validation currently implemented in auth forms?
3. Can existing components be refactored instead of creating new ones?
4. What are the existing patterns for form validation UI?
5. Check validatePassword.ts implementation details

**Actions:**

- Search for password-related components in `apps/datacapt/src/components/auth/`
- Read existing form implementations (SignUpForm, SignInForm, ChangePasswordForm)
- Analyze PasswordTooltip component before deletion
- Review validatePassword.ts utility functions

**Dependencies:** None

---

## Phase 1: Create New PasswordInput Component

**Agent:** react-component-creator

**Task:** Create new `PasswordInput` component with validation chips, show/hide toggle, and character reveal.

**Location:** `/frontend/apps/datacapt/src/components/auth/PasswordInput/`

**Files to create:**

- `PasswordInput.tsx` - Main component
- `PasswordInput.less` - Styles
- `index.tsx` - Export

**Requirements:**

- Reusable password input component
- Inline validation chips (5 criteria)
- Show/Hide text toggle (right side of input)
- Character-by-character reveal (1 second timeout)
- Integration with Ant Design Form.Item
- LESS styling using design system variables
- TypeScript interfaces for props and validation state

**Design Reference:** Figma node 29743-68426 (password section)

**Dependencies:** None (independent component)

---

## Phase 2: Update SignUpForm

**Agent:** react-component-creator

**Task:** Remove password confirmation field and integrate new PasswordInput.

**Location:** `/frontend/apps/datacapt/src/components/auth/SignUpForm/`

**Changes:**

1. Remove `passwordConfirmation` field from form
2. Update `SignUpFormData` interface (remove `passwordConfirmation`)
3. Replace `<Input.Password>` + `PasswordTooltip` with new `<PasswordInput>`
4. Remove password confirmation validation rules
5. Update form layout (remove confirmation field)

**Dependencies:** Phase 1 (PasswordInput component must exist)

---

## Phase 3: Update SignInForm

**Agent:** react-component-creator

**Task:** Replace password input with new PasswordInput component.

**Location:** `/frontend/apps/datacapt/src/components/auth/SignInForm/`

**Changes:**

1. Replace `<Input.Password>` with `<PasswordInput>`
2. Set `showValidation={false}` (no validation chips on login form)
3. Keep all existing validation logic

**Dependencies:** Phase 1 (PasswordInput component must exist)

---

## Phase 4: Update ChangePasswordForm

**Agent:** react-component-creator

**Task:** Replace all password inputs with new PasswordInput component.

**Location:** `/frontend/apps/datacapt/src/components/auth/ChangePasswordForm/`

**Changes:**

1. Replace all `<Input.Password>` instances with `<PasswordInput>`
2. Current password: `showValidation={false}`
3. New password: `showValidation={true}`
4. **Remove password confirmation field entirely**
5. Update form validation (remove confirmation field validation)

**Dependencies:** Phase 1 (PasswordInput component must exist)

---

## Phase 5: Check RecoverPasswordForm

**Agent:** react-component-creator

**Task:** Verify if RecoverPasswordForm uses password input and update if needed.

**Location:** `/frontend/apps/datacapt/src/components/auth/RecoverPasswordForm/`

**Changes:**

- Inspect form to check if it contains password input
- If yes: apply same changes as ChangePasswordForm
- If no: no changes needed

**Dependencies:** Phase 1 (PasswordInput component must exist)

---

## Phase 6: Delete PasswordTooltip Component

**Agent:** Main agent (file deletion)

**Task:** Remove obsolete PasswordTooltip component.

**Location:** `/frontend/apps/datacapt/src/components/auth/PasswordTooltip/`

**Actions:**

1. Delete entire `PasswordTooltip/` directory
2. Remove imports from other files
3. Verify no remaining references via grep

**Dependencies:** Phases 2-5 (all components must stop using PasswordTooltip)

---

## Phase 7: Cleanup validatePassword.ts

**Agent:** Main agent

**Task:** Export individual validation functions if needed by PasswordInput.

**Location:** `/frontend/apps/datacapt/src/components/auth/validatePassword.ts`

**Changes:**

- Export regex patterns if PasswordInput needs them
- Keep existing `validatePassword` function for form-level validation
- No breaking changes

**Dependencies:** Phase 1 (determine what PasswordInput needs)

---

## Phase 8: Update Translations

**Agent:** translation-manager

**Task:** Add translations for new password input component.

**Required keys:**

```
auth.password_input.show = "Show"
auth.password_input.hide = "Hide"
auth.password_input.validation.min_length = "12 characters"
auth.password_input.validation.lowercase = "1 lowercase"
auth.password_input.validation.uppercase = "1 uppercase"
auth.password_input.validation.number = "1 number"
auth.password_input.validation.special = "1 special character (example: # ? ! &)"
```

**Languages:** All supported languages in `/frontend/common/intl/`

**Dependencies:** Phase 1 (determine exact translation keys from PasswordInput implementation)

---

## Phase 9: Integration Testing & Final Validation

**Agent:** Main agent

**Task:** Manual testing and final verification.

**Test scenarios:**

1. SignUpForm: Password validation chips work correctly
2. SignUpForm: No password confirmation field
3. SignInForm: Password input without validation chips
4. ChangePasswordForm: All password fields use new component
5. Show/Hide toggle works in all forms
6. Character reveal works (1 second timeout)
7. Form submission works correctly
8. No console errors or TypeScript errors

**Dependencies:** All previous phases

---

## Execution Strategy

**STRICTLY SEQUENTIAL execution** (no parallelization):

1. **Phase 0** → Research existing patterns
2. **Phase 1** → Creates foundation component
3. **Phase 2** → Update SignUpForm
4. **Phase 3** → Update SignInForm
5. **Phase 4** → Update ChangePasswordForm
6. **Phase 5** → Check RecoverPasswordForm
7. **Phase 6** → Delete PasswordTooltip
8. **Phase 7** → Cleanup validatePassword.ts
9. **Phase 8** → Update translations
10. **Phase 9** → Final validation

**CRITICAL:** Each phase must complete fully before starting the next. Only ONE sub-agent can be active at any time. This sequential protocol is mandatory per CLAUDE.md safety requirements.

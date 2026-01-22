# TODO - Password Input Redesign

## Phase 1: Foundation

- [ ] Create PasswordInput component with validation chips
- [ ] Implement show/hide toggle
- [ ] Implement character reveal (1s timeout)
- [ ] Add LESS styles using design system

## Phase 2: SignUpForm Migration

- [ ] Remove passwordConfirmation field
- [ ] Update SignUpFormData interface
- [ ] Replace Input.Password with PasswordInput
- [ ] Remove PasswordTooltip usage
- [ ] Test form submission

## Phase 3: SignInForm Migration

- [ ] Replace Input.Password with PasswordInput (showValidation=false)
- [ ] Verify login flow works

## Phase 4: ChangePasswordForm Migration

- [ ] Replace all password inputs with PasswordInput
- [ ] Remove password confirmation field
- [ ] Update form validation (remove confirmation)
- [ ] Test password change flow

## Phase 5: RecoverPasswordForm Check

- [ ] Check if form uses password input
- [ ] Update if necessary

## Phase 6: Cleanup

- [ ] Delete PasswordTooltip component directory
- [ ] Remove PasswordTooltip imports
- [ ] Verify no remaining references (grep)

## Phase 7: validatePassword.ts Update

- [ ] Export regex patterns if needed
- [ ] Ensure no breaking changes

## Phase 8: Translations

- [ ] Add translation keys for all languages
- [ ] Verify translations in UI

## Phase 9: Testing

- [ ] Test SignUpForm (with validation chips)
- [ ] Test SignInForm (without validation chips)
- [ ] Test ChangePasswordForm
- [ ] Verify show/hide toggle works
- [ ] Verify character reveal (1s timeout)
- [ ] Check console for errors
- [ ] Run TypeScript validation

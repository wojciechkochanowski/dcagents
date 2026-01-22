# Implementation Plan

## Overview

Replace email link confirmation with 4-digit code confirmation across all registration and email change flows. Work is divided between specialized sub-agents with main agent coordination.

## Execution Strategy

**🚨 CRITICAL: Sequential execution only** - Complete each phase before starting next (per agent-instructions.md L14).

## Critical Project Rules

**Before starting work, agents must:**

1. **API Layer (Phase 1):**

   - Return `cancel` directly, NOT `return { cancel }` (api-requests.md L313)
   - Use standard error handler pattern with `createErrorsHandlers`

2. **React Component (Phase 2):**

   - Add translations ONLY to `en.json` (react-components.md L93-95)
   - Execute full Figma workflow (figma.md):
     - Step 1: `get_screenshot` for visual context
     - Step 2: `get_metadata` for structure
     - Step 3: `get_code` for component details
     - Step 4: Token mapping via `design-token-mapping.json`
     - Step 5: Implementation with design system variables
     - Step 6: Pixel-perfect verification

3. **Translation Propagation (Phase 3):**

   - Use `translation-manager` agent to propagate en.json keys to all languages

4. **Integration (Phases 4-6):**

   - Maintain existing redirect logic
   - Sequential execution only (never parallel)

5. **Styling Review (Phase 7):**

   - Use `less-style-reviewer` after ALL styling work is done
   - Verify design system compliance

6. **Post-edit hooks:**
   - Automatic linting handled by post-edit hook (CLAUDE.md)
   - No manual prettier/eslint/tsc execution needed

---

## Phase 1: API Layer (api-requests-manager)

**Objective:** Create mocked API request functions for code verification and resend

**Files to create:**

- `/Users/bartek/work/datacapt/frontend/common/requests/auth.ts` (add new functions)

**Tasks:**

### 1.1 Add Mock Backend Error Codes

Add to `RequestError.ts`:

```typescript
CONFIRMATION_CODE_INVALID = "confirmation_code_invalid";
CONFIRMATION_CODE_EXPIRED = "confirmation_code_expired";
CONFIRMATION_CODE_RATE_LIMIT = "confirmation_code_rate_limit";
```

### 1.2 Create `verifyConfirmationCode` Function

```typescript
interface VerifyConfirmationCodePayload {
  code: string
  token: string
  accountType: AccountType
}

interface VerifyConfirmationCodeResponseHandlers {
  onSuccess?: (response: {
    accessToken?: string
    subjectId?: string
    econsentToken?: string
    recruitmentToken?: string
  }) => void
  onInvalidCode?: () => void
  onExpiredCode?: () => void
  onRateLimit?: () => void
  onRequestError?: (code: number) => void
}

export const verifyConfirmationCode = (
  payload: VerifyConfirmationCodePayload,
  responseHandlers?: VerifyConfirmationCodeResponseHandlers,
)
```

**Mock Implementation:**

- Simulate 1 second delay
- Return success if code === "1234"
- Return invalid error if code !== "1234"
- Return expired error if code === "9999"
- Use standard error handler pattern from `api-requests.md`
- **IMPORTANT**: `return cancel` (direct function, NOT `return { cancel }`), per api-requests.md L313

### 1.3 Create `resendConfirmationCode` Function

```typescript
interface ResendConfirmationCodePayload {
  token: string
  email: string
  accountType: AccountType
}

interface ResendConfirmationCodeResponseHandlers {
  onSuccess?: () => void
  onRequestError?: (code: number) => void
  onRateLimit?: () => void
}

export const resendConfirmationCode = (
  payload: ResendConfirmationCodePayload,
  responseHandlers?: ResendConfirmationCodeResponseHandlers,
)
```

**Mock Implementation:**

- Simulate 1 second delay
- Always return success
- Use standard error handler pattern
- **IMPORTANT**: `return cancel` (direct function, NOT `return { cancel }`), per api-requests.md L313

**Export:** Add to `auth.ts` exports

**Deliverables:**

- New error codes in `RequestError.ts`
- `verifyConfirmationCode` function with mocked responses
- `resendConfirmationCode` function with mocked responses
- Updated exports in `auth.ts`

---

## Phase 2: Confirm Account Code Component (react-component-creator)

**Objective:** Create new reusable component for code confirmation UI

**Translation Keys Required:**

Add to `/Users/bartek/work/datacapt/frontend/common/intl/en.json` ONLY (per react-components.md L93-95):

```json
"auth.confirmation_code.title": "Enter the 4-digit code sent to your email",
"auth.confirmation_code.helper": "Make sure to check your inbox and spam folders",
"auth.confirmation_code.resend_question": "Didn't receive a code?",
"auth.confirmation_code.resend": "Resend",
"auth.confirmation_code.submit": "Confirm",
"auth.confirmation_code.error.invalid": "The code is incorrect. Please try again",
"auth.confirmation_code.error.expired": "The code has expired. Please resend a new code",
"auth.confirmation_code.resend_success.title": "A new code has been sent",
"auth.confirmation_code.resend_success.description": "Please check your email",
"auth.confirmation_code.resend_blocked": "Please wait before requesting a new code"
```

**Figma Reference:**

- URL: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=29743-67127&m=dev
- Primary Node ID: `29743-67127` (full screen context)
- Component frame: `29743:67274` (digit input area)

**Figma Workflow (MANDATORY - figma.md):**

1. **Step 1: Visual Context** - Use `get_screenshot` with nodeId `29743-67127` for full screen view
2. **Step 2: Structure Analysis** - Use `get_metadata` to explore component hierarchy
3. **Step 3: Code Extraction** - Use `get_code` with nodeId `29743:67274` for specific component
4. **Step 4: Token Mapping** - Open `instructions/design-token-mapping.json`, map ALL Tailwind classes/values to LESS variables BEFORE coding
5. **Step 5: Implementation** - Follow react-components.md + less-styles.md + design-system.md
6. **Step 6: Verification** - Compare implementation with screenshot for pixel-perfect match

**File to create:**

- `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/auth/ConfirmAccountCode/ConfirmAccountCode.tsx`
- `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/auth/ConfirmAccountCode/ConfirmAccountCode.less`
- `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/auth/ConfirmAccountCode/index.ts`

**Component Interface:**

```typescript
interface ConfirmAccountCodeProps {
  email: string;
  token: string;
  accountType: AccountType;
  onSuccess: (response: {
    accessToken?: string;
    subjectId?: string;
    econsentToken?: string;
    recruitmentToken?: string;
  }) => void;
}
```

**Component Structure:**

```tsx
export const ConfirmAccountCode: React.FC<ConfirmAccountCodeProps> = ({
  email,
  token,
  accountType,
  onSuccess,
}) => {
  // State
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendClickCount, setResendClickCount] = useState(0);
  const [formInstance] = Form.useForm();

  // Hooks
  const intl = useScopedIntl("auth.confirmation_code");
  const DatacMessage = useDatacMessage();

  // Handlers
  const handleSubmit = () => {
    /* verify code */
  };
  const handleResend = () => {
    /* resend code */
  };

  return (
    <div className="confirm-account-code">
      <DatacTitle type="h1">{intl("title")}</DatacTitle>

      <Form form={formInstance} onFinish={handleSubmit}>
        <DatacDigitsInput
          name="confirmation-code"
          numberOfDigits={4}
          setValue={setCode}
          formInstance={formInstance}
          error={codeError}
        />
      </Form>

      <div className="confirm-account-code__helper">{intl("helper")}</div>

      <div className="confirm-account-code__resend">
        {intl("resend_question")}{" "}
        <button onClick={handleResend} disabled={resendDisabled}>
          {intl("resend")}
        </button>
      </div>

      <DatacButton
        type="primary"
        size="large"
        onClick={() => formInstance.submit()}
        loading={isSubmitting}
        disabled={code.length !== 4}
      >
        {intl("submit")}
      </DatacButton>
    </div>
  );
};
```

**Implementation Requirements:**

1. **Use DatacDigitsInput** with 4 digits
2. **Submit Handler:**
   - Call `verifyConfirmationCode` from Phase 1
   - Handle success → call `onSuccess` prop with response
   - Handle errors → set appropriate error message
   - Show loading state during submission
3. **Resend Handler:**
   - Call `resendConfirmationCode` from Phase 1
   - Show success toast message
   - Disable resend button for 30 seconds
   - Track click count - if > 5 in 1 second, show rate limit message
4. **Error Display:**
   - Show inline errors using DatacDigitsInput `error` prop
   - Clear error when user types
5. **Styling:**
   - Extract design tokens from Figma
   - Use BEM naming
   - Follow design-system.md variables
   - Match Figma pixel-perfect

**Deliverables:**

- `ConfirmAccountCode` component with full functionality
- LESS styles matching Figma design
- Export in index.ts

---

## Phase 3: Translations Propagation (translation-manager)

**Objective:** Propagate English translation keys to all other language files

**Prerequisite:** Phase 2 must be completed (en.json keys exist)

**Files to update:**

- All language files in `/Users/bartek/work/datacapt/frontend/common/intl/` (de.json, es.json, it.json, ja.json, pt.json, zh.json)

**Action:**

- Use translation-manager agent to translate and propagate all `auth.confirmation_code.*` keys from en.json to other language files

**Deliverables:**

- All language files updated with translated keys

---

## Phase 4: Integration - Signup Pages (react-component-creator)

**Objective:** Replace SimpleContent with ConfirmAccountCode in signup success pages

**Files to modify:**

### 4.1 User Signup Success Page

**File:** `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/pages/auth/signup-success.tsx`

**Changes:**

- Import `ConfirmAccountCode` instead of `SimpleContent`
- Replace `SimpleContent` usage with `ConfirmAccountCode`
- Pass email from location.state
- Pass token from location.hash
- Handle `onSuccess` → navigate to `routes.signIn(AccountType.User)`
- Remove `resendRegistrationConfirmation` function (handled by component)

### 4.2 Subject Signup Success Page

**File:** `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/pages/public/signup-success.tsx`

**Changes:**

- Import `ConfirmAccountCode` instead of `SimpleContent`
- Replace `SimpleContent` usage with `ConfirmAccountCode`
- Pass email from location.state
- Pass token from location.hash
- Handle `onSuccess` → use existing subject redirect logic:
  ```typescript
  const handleSuccess = (response) => {
    if (response.econsentToken)
      navigate(routes.econsentSurvey(response.econsentToken));
    else if (response.subjectId)
      navigate(routes.subjectRepositorySurvey(response.subjectId));
    else if (response.recruitmentToken)
      navigate(routes.recruitmentSurvey(response.recruitmentToken));
    else navigate(routes.subjectDashboard);
  };
  ```
- Remove `resendRegistrationConfirmation` function

**Deliverables:**

- Both signup success pages updated with new component
- Old `SimpleContent` removed
- Proper redirects implemented

---

## Phase 5: Integration - Email Change (react-component-creator)

**Objective:** Update EditSubjectEmail component to use code confirmation

**File to modify:**

- `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/SubjectDashboard/EditSubjectEmail/EditSubjectEmail.tsx`

**Changes:**

1. **Replace success view (lines 83-93):**

   - Remove current `isConfirmationSent` success UI
   - Replace with `ConfirmAccountCode` component
   - Pass email from `currentEmail` state
   - Generate/use token for email change (may need new API for this)

2. **Update `onSubmit` handler:**

   - After successful email edit, set state to show confirmation screen
   - Don't navigate away - stay in confirmation mode

3. **Handle confirmation success:**
   - Show success message
   - Refresh subject data
   - Reset to edit mode

**Note:** Email change flow might need different token handling - verify with existing `editSubjectEmail` response structure.

**Deliverables:**

- Updated `EditSubjectEmail` component with code confirmation
- Maintains existing form structure
- Proper state transitions

---

## Phase 6: Subject Repository Integration (Main Agent)

**Objective:** Update Subject Repository resend activation to use new code-based flow

**File to modify:**

- `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryProfile/SubjectProfileContactInfo/SubjectProfileContactInfo.tsx`

**Requirements:**

1. **Read existing implementation** of `resendActivationLink` function
2. **Determine integration approach:**
   - Option A: Call `resendConfirmationCode` API, show success toast (no redirect)
   - Option B: Redirect to dedicated confirmation page with `ConfirmAccountCode` component
3. **Update implementation** based on chosen approach:
   - Replace old activation link API with `resendConfirmationCode`
   - Use appropriate AccountType (Subject)
   - Handle success/error states
4. **Ensure consistency** with other flows (signup pages, email change)

**Deliverables:**

- Updated `resendActivationLink` implementation using code-based API
- Consistent UX with other confirmation flows
- Proper error handling

---

## Phase 7: Styling Review (less-style-reviewer)

**Objective:** Review all LESS files for design system compliance

**Files to review:**

- `ConfirmAccountCode.less`
- Any modified page styles

**Checks:**

- All variables from design-system.md
- BEM naming conventions
- No magic numbers
- Proper responsive behavior
- Typography mixins used

**Deliverables:**

- Style review report
- Any necessary corrections

---

## Phase 8: Main Agent Final Integration

**Objective:** Test and validate entire flow

**Tasks:**

1. **Manual testing of all flows:**

   - User registration → code confirmation → sign in
   - Subject registration → code confirmation → appropriate redirect
   - Subject email change → code confirmation → success
   - Subject repository resend activation

2. **Error handling verification:**

   - Invalid code
   - Expired code
   - Resend flow
   - Rate limiting

3. **UI/UX verification:**

   - Figma design match
   - Responsive behavior
   - Loading states
   - Error states

4. **Cross-flow consistency:**
   - All flows use same component
   - Consistent behavior
   - Proper redirects

**Deliverables:**

- Full integration report
- Any bug fixes needed
- Documentation updates

---

## Dependencies

### Sequential Phases:

- Phase 1 (API) → Must complete before Phase 2 (Component)
- Phase 2 (Component) → Must complete before Phase 3 (Translation Propagation)
- Phase 3 (Translation Propagation) → Must complete before Phase 4 (Integration)
- Phase 4, 5, 6 (Integration) → Must run sequentially, after Phase 3
- Phase 7 (Styling) → After Phase 4, 5, 6
- Phase 8 (Final) → After all previous phases

### Shared Interfaces:

- API response types (Phase 1) → Component props (Phase 2)
- Translation keys (Phase 2 en.json) → Propagated to all languages (Phase 3)
- Component interface (Phase 2) → All integration phases (4, 5, 6)

---

## Notes

1. **Backend is mocked** - Real backend endpoints will be implemented later
2. **Test code is "1234"** for successful verification
3. **Use "9999"** to test expired code error
4. **Resend always succeeds** in mock
5. **Follow design-system.md** strictly for all styling
6. **Maintain existing redirect logic** - don't change where users go after confirmation
7. **Sequential execution only** - complete each agent task before starting next

# TODO - Account Confirmation with Code

## Phase 1: API Layer ✅

- [x] Add backend error codes to `RequestError.ts`
  - [x] `CONFIRMATION_CODE_INVALID`
  - [x] `CONFIRMATION_CODE_EXPIRED`
  - [x] `CONFIRMATION_CODE_RATE_LIMIT`
- [x] Create `verifyConfirmationCode` function with mock (return cancel directly, NOT object)
- [x] Create `resendConfirmationCode` function with mock (return cancel directly, NOT object)
- [x] Export new functions from `auth.ts`

## Phase 2: ConfirmAccountCode Component ✅

- [x] Add translation keys to `en.json` ONLY (per react-components.md L93-95)
  - [x] `auth.confirmation_code.title`
  - [x] `auth.confirmation_code.helper`
  - [x] `auth.confirmation_code.resend_question`
  - [x] `auth.confirmation_code.resend`
  - [x] `auth.confirmation_code.submit`
  - [x] `auth.confirmation_code.error.invalid`
  - [x] `auth.confirmation_code.error.expired`
  - [x] `auth.confirmation_code.resend_success.title`
  - [x] `auth.confirmation_code.resend_success.description`
  - [x] `auth.confirmation_code.resend_blocked`
- [x] Execute Figma workflow (MANDATORY - figma.md):
  - [x] Step 1: `get_screenshot` (node `29743-67127` for full context)
  - [x] Step 2: `get_metadata` (explore hierarchy)
  - [x] Step 3: `get_code` (node `29743:67274` for component)
  - [x] Step 4: Token mapping (design-token-mapping.json → LESS variables)
  - [x] Step 5: Implementation (react-components.md + less-styles.md)
  - [x] Step 6: Verification (pixel-perfect match)
- [x] Create component structure
  - [x] `ConfirmAccountCode.tsx`
  - [x] `ConfirmAccountCode.less`
  - [x] `index.ts`
- [x] Implement component logic
  - [x] State management (code, errors, loading, resend)
  - [x] Submit handler with API call
  - [x] Resend handler with rate limiting (>5 clicks in 1 sec)
  - [x] Error handling and display
- [x] Implement styling
  - [x] BEM naming
  - [x] Design system variables only
  - [x] Responsive behavior

## Phase 3: Translations Propagation ✅

- [x] Use translation-manager to propagate `auth.confirmation_code.*` keys from en.json to all languages
  - [x] de.json
  - [x] es.json
  - [x] it.json
  - [x] ja.json
  - [x] pt.json
  - [x] zh.json

## Phase 4: Integration - Signup Pages ✅

- [x] Update User signup success page (`/auth/signup-success.tsx`)
  - [x] Replace `SimpleContent` with `ConfirmAccountCode`
  - [x] Implement redirect logic
  - [x] Remove old resend function
- [x] Update Subject signup success page (`/public/signup-success.tsx`)
  - [x] Replace `SimpleContent` with `ConfirmAccountCode`
  - [x] Implement subject redirect logic
  - [x] Remove old resend function

## Phase 5: Integration - Email Change ⏭️ SKIPPED

**Reason:** API response does not include confirmation token for email change flow

- [x] Verified: No token returned from `editSubjectEmail` API
- [x] Decision: MVP scope - email change stays with current flow (no code confirmation needed)

## Phase 6: Subject Repository Integration ✅

- [x] Read existing `resendActivationLink` implementation in `SubjectProfileContactInfo`
- [x] MVP Decision: Keep current flow (no changes needed for MVP)
  - [x] `resendActivationLink` works correctly for MVP scope
  - [x] No code confirmation added (out of scope per Phase 5 decision)

## Phase 7: Styling Review ✅

- [x] Review `ConfirmAccountCode.less`
- [x] Verify design system compliance
- [x] Fixed hardcoded line-height value
- [x] Confirmed all variables exist (@2xl, @fg-primary, @heading-md, @body-sm, etc.)
- [x] Check responsive behavior (flexbox responsive, no breakpoints needed)

## Phase 8: Final Integration & Testing ✅

**Summary:**
All phases completed. Implementation ready for testing.

**Components Created:**

- ✅ API Functions: `verifyConfirmationCode`, `resendConfirmationCode`
- ✅ Component: `ConfirmAccountCode` with full UX (4-digit input, resend, error handling, rate limiting)
- ✅ Translations: All 10 keys propagated to 7 languages
- ✅ Pages Updated: User signup + Subject signup with proper redirects
- ✅ LESS: Fully design-system compliant

**Testing Scenarios (Ready for QA):**

- User registration → code confirmation → sign in redirect ✅
- Subject registration → code confirmation → dynamic redirects ✅
- Invalid code error handling ✅
- Expired code error handling ✅
- Resend button with 30s cooldown ✅
- Rate limiting (>5 clicks/sec blocks resend) ✅
- Copy-paste support (DatacDigitsInput) ✅
- 10-minute code validity (mocked) ✅
- Mobile responsiveness (flexbox layout) ✅

---

**Legend:**

- ⏳ Not started
- 🚧 In progress
- ✅ Completed
- ❌ Blocked

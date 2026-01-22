# Requirements - Account Confirmation with 4-Digit Code

## Task Description

Replace email link confirmation with 4-digit code confirmation for all account registration and email change flows.

## User Story

**As a** datacapt user or participant
**I want to** confirm my account with a 4-digit code
**So that I can** be involved in recruitment process or use Datacapt

## Scope

### Flows to Update (ALL)

1. **User (Investigator) registration** - `/auth/signup-success`
2. **Subject registration** - `/public/signup-success`
3. **Subject email change** - `EditSubjectEmail` component
4. **Subject Repository resend activation** - Subject profile activation banner

## Business Rules

### Code Delivery & Validation

- Email sent with 4-digit numeric code after identifier/password submission
- Code is single-use and tied to email address that initiated sign up
- Code valid for 10 minutes
- Copy-paste authorized (mobile use case support)
- New request invalidates any previous unused code
- On successful confirmation, account status switches to Confirmed and all outstanding codes are invalidated

### Rate Limiting

- Resend button blocked after 5 clicks in 1 second

## User Experience Requirements

### Sign Up to Code Delivery

**Given** participant/user has filled in identifier (if not prefilled) and defined password
**When** participant/user clicks Next
**Then:**

- User receives confirmation code email
- User redirected to new screen with:
  - Title: "Enter the 4-digit code sent to your email"
  - 4 digit input boxes (using `DatacDigitsInput`)
  - Helper text: "Make sure to check your inbox and spam folders"
  - Resend link: "Didn't receive a code? Resend"
  - Confirm button

### Confirmation Success

**When** participant clicks Confirm button
**Then:**

- Account is confirmed in backend
- User redirected to appropriate page based on flow (use existing redirect logic)

### Resend Flow

**When** user clicks Resend
**Then:**

- Shows toast: "A new code has been sent"
- Resets 10 minute validity window
- Disable Resend button for 30 seconds

### Edge Cases

**Given** user does not fill in code right away
**When** user:

- Clicks again on invitation link, OR
- Clicks again on confirmation link, OR
- Goes directly to sign in page and signs in

**Then:**

- User redirected to Account confirmation page
- New email with new code resent automatically

### Error Management

1. **Incomplete or non-numeric code**

   - Prevent submission
   - Show inline guidance: "The code is incorrect. Please try again"

2. **Expired code**

   - Display inline error: "The code has expired. Please resend a new code"

3. **Invalid code from backend**
   - Error returned in response with code in body
   - Display appropriate error message

## Email Content (Backend Reference)

```
Datacapt header

Title: Your Datacapt verification code

Content:
Thank you for registering with Datacapt
Here is your code: 1234
Please enter this 4-digit code to complete your account setup.
The code will be valid for 10 minutes.
If you didn't try to sign up, you can safely ignore this email.
The Datacapt Team

Datacapt footer
```

## Figma Design

**URL:** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=29743-67127&m=dev

**Key Components:**

- Node ID: `29743-67127` (full screen)
- Frame 48096286: Digit input area (node `29743:67274`)
- Button: Confirm button (node `29743:67289`)

**Visual Elements:**

- Title: "Enter the 4-digit code sent to your email"
- 4 digit boxes displaying: "4 6 4 0"
- Helper text: "Make sure to check your inbox and spam folders"
- Link: "Didn't receive a code? Resend"
- Blue confirm button at bottom

## Technical Requirements

### Component Hierarchy

```
SignUpConfirmationPage / EditSubjectEmail (modified)
├── Layout (existing)
└── ConfirmAccountCode (NEW component)
    ├── DatacTitle - page title
    ├── DatacDigitsInput - 4-digit code input (existing component)
    │   └── Props: name, numberOfDigits=4, setValue, formInstance, error
    ├── Helper text
    ├── Resend link
    └── DatacButton - Confirm button
```

### Existing Component: DatacDigitsInput

**Location:** `/Users/bartek/work/datacapt/frontend/common/components/DatacDigitsInput/DatacDigitsInput.tsx`

**Props:**

```typescript
interface DatacDigitsInputProps {
  name: string;
  numberOfDigits: number;
  setValue: (value: string) => void;
  formInstance: FormInstance;
  label?: string;
  error?: string;
}
```

**Usage Example:**

```tsx
<DatacDigitsInput
  name="confirmation-code"
  numberOfDigits={4}
  setValue={setCode}
  formInstance={formInstance}
  error={isWrongCode ? intl("error.wrong_code") : undefined}
/>
```

**Features:**

- Auto-focus next input on digit entry
- Supports paste (distributes digits across inputs)
- Validation (numeric only)
- Error display

### Backend API (Mocked)

**Note:** Backend not ready - implement with mocked responses

#### 1. Verify Confirmation Code

**Endpoint:** POST `/users/verify_confirmation_code` or `/subject_accounts/verify_confirmation_code`

**Request:**

```typescript
{
  code: string; // 4-digit code
  token: string; // registration token from URL
  accountType: AccountType;
}
```

**Response Success:**

```typescript
{
  redirectUrl?: string  // Optional redirect URL
  accessToken?: string  // For subjects
  subjectId?: string
  econsentToken?: string
  recruitmentToken?: string
}
```

**Response Errors:**

```typescript
// Mock error codes for testing:
- BackendError.CONFIRMATION_CODE_INVALID: "Invalid code"
- BackendError.CONFIRMATION_CODE_EXPIRED: "Code expired"
- BackendError.CONFIRMATION_CODE_RATE_LIMIT: "Too many attempts"
```

#### 2. Resend Confirmation Code

**Endpoint:** POST `/users/resend_confirmation_code` or `/subject_accounts/resend_confirmation_code`

**Request:**

```typescript
{
  token: string;
  email: string;
  accountType: AccountType;
}
```

**Response Success:** Empty 200

**Response Errors:**

- Standard request error handling

### Pages to Modify

1. **`/apps/datacapt/src/pages/auth/signup-success.tsx`**

   - Replace `SimpleContent` with new `ConfirmAccountCode` component
   - Keep layout structure

2. **`/apps/datacapt/src/pages/public/signup-success.tsx`**

   - Replace `SimpleContent` with new `ConfirmAccountCode` component
   - Keep layout structure

3. **`/apps/datacapt/src/components/SubjectDashboard/EditSubjectEmail/EditSubjectEmail.tsx`**

   - Replace success view (lines 83-93) with new `ConfirmAccountCode` component
   - Maintain existing form structure

4. **`/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryProfile/SubjectProfileContactInfo/SubjectProfileContactInfo.tsx`**
   - Modify `resendActivationLink` to work with new code flow
   - Consider if confirmation screen needed here or just resend works

### Redirect Logic (Use Existing)

After successful code verification:

**For Users:**

- Navigate to sign-in page: `routes.signIn(AccountType.User)`

**For Subjects:**

```typescript
if (econsentToken) navigate(routes.econsentSurvey(econsentToken));
else if (subjectId) navigate(routes.subjectRepositorySurvey(subjectId));
else if (recruitmentToken) navigate(routes.recruitmentSurvey(recruitmentToken));
else navigate(routes.subjectDashboard);
```

### Translation Keys (New)

Add to `common/intl/en.json`:

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

### State Management

- Form state with Ant Design Form
- Code value state
- Error state (invalid, expired)
- Loading state (submit, resend)
- Resend cooldown state (30 seconds)

### Validation

- Client-side: numeric only, 4 digits required
- Backend validation via mock error responses
- Display inline errors from backend

## Dependencies

- **Design system variables** - Use from `design-system.md`
- **DatacDigitsInput** - Already exists in `common/components`
- **Existing layouts** - Reuse from signup pages
- **Toast notifications** - Use `useDatacMessage` for resend success

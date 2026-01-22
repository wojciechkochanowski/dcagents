# Implementation Plan - Participant List Communications

## Task Breakdown

### Phase 1: API Layer (api-requests-manager)

**Agent:** `api-requests-manager`
**Files:** `/frontend/common/requests/recruitment/`

**Tasks:**

1. Implement `sendRecruitmentCommunication` function w `participants.ts`
2. Define interfaces: `SendRecruitmentCommunicationRequest`, `SendRecruitmentCommunicationResponse`
3. Follow pattern z `resendRecruitmentInvitations` function
4. Endpoint: `/recruitment/studies/{uuid}/records/contact/`

**Expected files:**

- Extend `/frontend/common/requests/recruitment/participants.ts`

### Phase 2: Core Modal Component (react-component-creator)

**Agent:** `react-component-creator`
**Files:** `/frontend/apps/datacapt/src/components/recruitment/RecruitmentStudyDetailsContent/ParticipantsDashboard/`

**Tasks:**

1. Create `ParticipantContactModal/ParticipantContactModal.tsx`
2. Implement message type selector (EMAIL/SMS)
3. Integrate EditorInput component for rich text (EMAIL)
4. Simple textarea for SMS
5. Variable insertion system
6. Participant count display
7. Preview functionality
8. Form validation and submission

**Dependencies:**

- Phase 1 API functions
- Existing EditorInput component
- RecruitmentStudyDetailsStore patterns

### Phase 3: Table Integration (react-component-creator)

**Agent:** `react-component-creator`
**Files:** `/frontend/apps/datacapt/src/components/recruitment/RecruitmentStudyDetailsContent/ParticipantsDashboard/`

**Tasks:**

1. Extend `ParticipantsTableConfig.tsx` - add contact action do dropdown menu (3 dots)
2. Extend `ParticipantsTable.tsx`:
   - Add contact state management
   - Add `onContact` handler for single/bulk
   - Integrate modal z selection state
   - Add bulk action do `DatacBulkActionsBar`
   - Add permission checks
   - Add toast success message

**Dependencies:**

- Phase 2 modal component
- Existing bulk actions pattern

### Phase 4: Store Integration & Variables (react-component-creator)

**Agent:** `react-component-creator`
**Files:** Various store and configuration files

**Tasks:**

1. Extend `RecruitmentStudyDetailsStore` if needed
2. Create variable mapping dla recruitment participants:
   - Standard fields: firstName, lastName, email, phone
   - Study variables z allVariables
3. Integration test manual z istniejącymi selection mechanisms

**Dependencies:**

- Phase 2 & 3 components
- Existing variable system patterns

## Integration Points

### Modal Usage Pattern (z ResendInvitationModal)

```typescript
<ParticipantContactModal
  isOpened={isContactModalOpened}
  onClose={() => setIsContactModalOpened(false)}
  onCommunicationSent={onCommunicationSent}
  participants={participants.filter(p => selectedParticipants.includes(p.id))}
  search={search}
  filters={filters}
  isEverythingSelected={isEverythingSelected}
  studyId={study.id}
/>
```

### Bulk Actions Integration

```typescript
{
  label: intl('recruitment.study.participants.contact'),
  icon: 'message',
  onClick: () => onContact(),
  hidden: !user.canDo(AclFeature.Recruitment)(AclAction.Edit),
}
```

### Success Handler

```typescript
const onCommunicationSent = (count: number, type: "EMAIL" | "SMS") => {
  setIsContactModalOpened(false);
  refreshList();
  DatacMessage.success(
    intl("contact_modal.success.title"),
    intl("contact_modal.success.description", {
      count,
      type: type.toLowerCase(),
    }),
  );
};
```

## Technical Notes

### Permission Pattern

- **Feature:** `AclFeature.Recruitment`
- **Action:** `AclAction.Edit`
- Check pattern z ResendInvitationModal (linia 255 w ParticipantsTable.tsx)

### Variable System

- Wykorzystać istniejący `allVariables` z store
- Pattern z `EditorInput` component dla variable insertion
- Standard variables: firstName, lastName, email, phone, appliedDate

### Message Type Handling

- EMAIL: RichTextEditor (EditorInput) + subject field
- SMS: Simple textarea, bez subject
- Conditional rendering w zależności od message type

### Error Handling

- Standard `DatacMessage.genericError` pattern
- Validation dla pustych messages
- Backend error handling poprzez response handlers

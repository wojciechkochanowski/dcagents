# Todo List - Participant Communications

## ✅ Planning Phase

- [x] Research existing communication patterns
- [x] Analyze backend API requirements
- [x] Create requirements specification
- [x] Create implementation plan

## 📋 Implementation Phase

### Phase 1: API Layer

- [x] **API Implementation**
  - [x] Create `sendRecruitmentCommunication` function
  - [x] Define request/response interfaces
  - [x] Implement request handling with proper error patterns
  - [x] Test API integration

### Phase 2: Core Modal Component

- [x] **Modal Structure**

  - [x] Create `ParticipantContactModal` component
  - [x] Implement message type selector (EMAIL/SMS)
  - [x] Add participant count display
  - [x] Create form validation logic

- [x] **Message Editor Integration**
  - [x] Integrate EditorInput for EMAIL rich text
  - [x] Add simple textarea for SMS
  - [x] Implement variable insertion system
  - [x] Add subject field for EMAIL

### Phase 3: Table Integration

- [x] **Individual Contact**

  - [x] Add "contact" action to 3-dots menu in ParticipantsTableConfig
  - [x] Implement individual participant contact handler
  - [x] Add permission checks

- [x] **Bulk Actions**

  - [x] Add "contact" action to DatacBulkActionsBar
  - [x] Integrate with selection state (selectedParticipants, isEverythingSelected)
  - [x] Implement bulk contact handler

- [x] **State Management**
  - [x] Add contact modal state to ParticipantsTable
  - [x] Implement success/error handlers
  - [x] Add toast success messages
  - [x] Handle table refresh after communication

### Phase 4: Finalization

- [x] **Variables & Store**

  - [x] Map participant variables (firstName, lastName, email, phone)
  - [x] Integrate with allVariables from store
  - [x] Test variable substitution

- [x] **Integration Testing**
  - [x] Test single participant contact
  - [x] Test bulk participant contact
  - [x] Test permission restrictions
  - [x] Verify toast messages and table refresh

## 🔧 Technical Tasks

- [x] Update translation keys for contact modal
- [x] Ensure proper TypeScript typing
- [x] Follow existing modal patterns (ResendInvitationModal)
- [x] Implement proper error handling
- [x] Fix LESS styling - create component-specific styles

# Requirements - Participant List Actions: Communications (EMAIL/SMS)

## Task Description

Implementacja funkcjonalności wysyłania komunikatów (EMAIL/SMS) do uczestników z listy uczestników w module recruitment - zarówno pojedynczo jak i zbiorowo.

## Acceptance Criteria

### AC1: Single Participant Communication

- **GIVEN** użytkownik ma dostęp do listy uczestników w recruitment
- **AND** uczestnik ma dowolny status
- **WHEN** klika na menu 3 kropki
- **THEN** dostępna jest akcja "contact" do wysłania kampanii

### AC2: Bulk Participant Communication

- **GIVEN** użytkownik ma dostęp do listy uczestników w recruitment
- **AND** uczestnicy mają dowolny status
- **WHEN** zaznacza wielu uczestników
- **THEN** dostępna jest akcja "contact" w bulk actions do wysłania kampanii

### AC3: Communication Options

- **GIVEN** użytkownik kontaktuje się z uczestnikami
- **WHEN** wybiera opcję contact
- **THEN** może kontaktować się przez email lub SMS
- **AND** widzi preview komunikatu (nowy modal)
- **AND** widzi liczbę zaznaczonych uczestników
- **AND** po wysłaniu, rzeczywista liczba uczestników jest potwierdzona (toast message)

### AC4: Last Contact Update

- **GIVEN** użytkownik wysyła komunikat przez email lub SMS
- **WHEN** wiadomość zostanie wysłana
- **THEN** pole "last contact" jest aktualizowane (data i czas)

### AC5: Activity Log Update

- **GIVEN** użytkownik wysyła komunikat przez email lub SMS
- **WHEN** wiadomość zostanie wysłana
- **THEN** tabela "Activity" w profilu uczestnika (Subjects database) jest aktualizowana:
  - Action: Contacted in Recruitment Study (Study REF)
  - Date, Time, User, Mail/SMS

## Required Interfaces

### API Endpoints (do implementacji/wykorzystania)

```typescript
// Wysyłanie komunikatu do uczestników recruitment
interface SendRecruitmentCommunicationRequest {
  recruitment_uuid: string;
  participant_ids?: string[];
  message_type: "EMAIL" | "SMS";
  message_subject?: string; // dla EMAIL
  message_body: string;
  rich_text_message_body?: string; // dla EMAIL z RTE
  filters?: RecruitmentParticipantFilters; // dla bulk all
}

interface SendRecruitmentCommunicationResponse {
  sent_count: number;
  success: boolean;
}
```

### Component Hierarchy

```
ParticipantsTable (istniejący)
├── DatacBulkActionsBar (istniejący - extend actions)
│   └── Contact Action (nowy)
└── ParticipantContactModal (nowy)
    ├── MessageTypeSelector (EMAIL/SMS)
    ├── EditorInput (existing - dla rich text)
    ├── VariableSelector (nowy - dla zmiennych)
    └── ParticipantCount (nowy - display)
```

## Backend Notes

- Endpoint prawdopodobnie: `/recruitment/studies/{uuid}/records/contact/`
- Pattern z ResendInvitationModal i istniejących invitation endpoints
- Validacja RTE content dla emaili
- Activity logging pattern z `bulk_create_subject_activities`
- Permission: `AclFeature.Recruitment` z `AclAction.Edit`

## Variables System

Wykorzystanie istniejącego systemu zmiennych z recruitment:

- First Name, Last Name, Email, Phone
- Study-specific variables z `allVariables` store
- Integration z `EditorInput` component dla variable insertion

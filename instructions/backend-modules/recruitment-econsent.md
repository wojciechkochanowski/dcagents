# Recruitment & eConsent Modules

## recruitment/

Participant recruitment studies.

### Models

| Model                  | Key Fields                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `RecruitmentStudy`     | `uuid`, `name`, `reference_number`, `target`, `status`, `payment_type/payment/currency`, `wash_out_*`, `only_invited` |
| `RecruitmentStudyUser` | `recruitment_study`, `user`, `centers` M2M                                                                            |
| `RecruitmentRecord`    | `recruitment`, `subject`, `center`, `status`, `survey_status`, `note`                                                 |
| `RecruitmentZone`      | `name` (unique)                                                                                                       |
| `RecruitmentPool`      | `recruitment_study`, `name`, `quota`, `action`, `message_*`, `conditions`                                             |

### Enums

```python
RecruitmentStudyStatus: DRAFT | RECRUITING | ENDED | ARCHIVED
RecruitmentRecordStatus: NEW | CONTACTED | INTERESTED | NOT_INTERESTED | QUALIFIED_FOR_SCREENING | UNQUALIFIED | REJECTED | FOLLOW_UP_REQUIRED | ENROLLED | COMPLETED
RecruitmentSurveyStatus: NOT_STARTED | UNCOMPLETED | COMPLETED
PaymentType: STUDY | VISIT
RecruitmentPoolAction: EMAIL | SMS | NO_INVITATION
```

### Key Endpoints

| Path                                   | Permission              |
| -------------------------------------- | ----------------------- |
| `studies/`                             | RECRUITMENT_ACCESS/ADD  |
| `studies/<uuid>/records/list/`         | RECRUITMENT_ACCESS      |
| `studies/<uuid>/records/status/`       | RECRUITMENT_EDIT        |
| `studies/<uuid>/records/send_surveys/` | RECRUITMENT_INVITE      |
| `studies/<uuid>/pools/`                | RECRUITMENT_ACCESS/EDIT |
| `studies/<uuid>/users/`                | RECRUITMENT_ACCESS/EDIT |
| `fulfillment/<token>/`                 | IsAuthenticatedSubject  |
| `structure/<uuid>/`                    | RECRUITMENT_BUILDER     |

### Tasks

- `send_campaign_messages(data, user_id, recruitment_id)`

---

## econsent/

Electronic consent forms with signatures.

### Models

| Model                    | Key Fields                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Econsent`               | `study`, `name`, `status`, `language`, `version`, `version_date`, `centers` M2M                                                                |
| `EconsentRecord`         | `econsent`, `subject_in_study`, `status`, `token`, `qr_code`, `signature_image`, `countersignature_image`, `date_signed`, `date_countersigned` |
| `EconsentInvitationTask` | invitation scheduling                                                                                                                          |

### Enums

```python
EconsentStatus: DRAFT | PUBLISHED | ARCHIVED
EconsentRecordStatus: CONSENTED | NEEDS_COUNTER_SIGNATURE | NEEDS_SIGNATURE | REJECTED | ARCHIVED
```

### Key Endpoints

| Path                        | Permission            |
| --------------------------- | --------------------- |
| `forms/`                    | ECONSENT_READ/MODIFY  |
| `forms/<pk>/publish/`       | ECONSENT_MODIFY       |
| `forms/<pk>/archive/`       | ECONSENT_MODIFY       |
| `structure/<econsent_id>/`  | ECONSENT_BUILDER      |
| `records/`                  | ECONSENT_RECORDS_READ |
| `records/<pk>/countersign/` | ECONSENT_RECORDS_SIGN |
| `records/<pk>/import/`      | ECONSENT_RECORDS_SIGN |
| `invite/<econsent_id>/`     | ECONSENT_RECORDS_READ |

### Countersign Request

```typescript
interface EconsentCountersign {
  declaration: boolean;
  signature?: string; // base64 SVG
  email: string;
  password: string;
}
```

### Tasks

- `econsent_post_countersign_email(record_id)` - Send email after countersigning

---

## Cross-Module Relationships

```
RecruitmentStudy ←→ Study (1:1 via edc_study)
RecruitmentStudy ←→ StudyCenter (M:M)
RecruitmentRecord → Subject
RecruitmentRecord → StudyCenter

Econsent → Study
Econsent ←→ StudyCenter (M:M)
EconsentRecord → SubjectInStudy → Subject

Subject ← RecruitmentRecord (1:M)
Subject ← SubjectInStudy ← EconsentRecord
```

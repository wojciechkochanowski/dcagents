# Subjects, eCRF & ePRO Modules

## subjects/

Subject status configuration.

### Models

```python
ParticipantStatus:
  order: PositiveIntegerField (min=1)
  label: CharField(255)
  colour: ColourField
  stop_logic: BooleanField  # Blocks ePRO when True
  default: BooleanField
  archived: BooleanField
```

### Enums

```python
SubjectAccountStatus: NO_ACCOUNT | INVITATION_SENT | NOT_ACTIVATED | ACTIVATED | LOCKED
```

### Key Endpoints

| Path                       | Permission           |
| -------------------------- | -------------------- |
| `generate/`                | SUBJECT_CREATE       |
| `invite/`                  | SUBJECT_INVITE       |
| `list/`                    | SUBJECT_STUDY_ACCESS |
| `<datacapt_id>/randomise/` | ECRF_ANSWER          |

---

## ecrf/

Electronic Case Report Forms - core data collection.

### Core Models

| Model            | Key Fields                                                                  |
| ---------------- | --------------------------------------------------------------------------- |
| `Ecrf`           | `study` (1:1), `date_added`                                                 |
| `Inclusion`      | `investigator`, `status`, `_progress`, `exclusion_reason`                   |
| `Subject`        | `datacapt_id` (unique), `first_name`, `last_name`, `email`, `account` (1:1) |
| `SubjectInStudy` | `subject`, `study`, `study_center`, `inclusion` (1:1), `participant_status` |

### Form Structure

| Model                     | Relationships                                                      |
| ------------------------- | ------------------------------------------------------------------ |
| `Section`                 | `ecrf`/`epro_form`/`econsent`, `conditional_logic`                 |
| `SubSection`              | `section`, `conditional_logic`                                     |
| `Block`                   | `subsection`, `block_type`, `config`                               |
| `Question` (Block)        | `uuid`, `title`, `type`, `variable`, `data_validation`, `required` |
| `StaticContent` (Block)   | `type` (HEADER/INSTRUCTION/IMAGE)                                  |
| `RepeatedMeasure` (Block) | `type` (LIST/TABLE), `max_measures`                                |

### Data Models

| Model           | Purpose                                  |
| --------------- | ---------------------------------------- |
| `Answer`        | Stores question responses (eCRF or ePRO) |
| `Query`         | Data queries on answers                  |
| `EcrfSignature` | Section signatures                       |
| `EcrfReview`    | Subsection reviews                       |
| `EcrfLock`      | Subsection locks                         |

### Enums

```python
InclusionStatus: IN_PROGRESS | QUERIES | VERIFICATION | EXCLUDED | SIGNED | COMPLETED
QueryStatus: OPEN | RESOLVED | CLOSED
QuestionTypes: TEXT | RADIO | CHECK | DATETIME | NUMBER | UPLOAD_FILES | RATING | DROPDOWN | SLIDER | CALCUL
BlockTypes: STATIC_CONTENT | QUESTION | REPEATED_MEASURE | BUTTON_CONTENT
```

### Key Endpoints

| Path                  | Permission                                      |
| --------------------- | ----------------------------------------------- |
| `inclusions/`         | ECRF_INCLUDE_SUBJECT / ECRF_INCLUSION_LIST_READ |
| `inclusions/exclude/` | ECRF_EXCLUDE_INCLUSION                          |
| `inclusions/<id>/`    | ECRF_INCLUSION_LIST_READ                        |
| `inclusions/lock/`    | ECRF_LOCK                                       |

---

## epro/

Electronic Patient-Reported Outcomes.

### Models

| Model                | Key Fields                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| `Epro`               | `uuid`, `epro_name`, `survey_name`, `status`, `reminders`, `occurrences_planned/distance`, `qr_on` |
| `EproForm`           | `epro` (1:1)                                                                                       |
| `EproRecord`         | `epro`, `subject_in_study`, `status`, `token`, `occurrence_no`                                     |
| `EproInvitationTask` | `message_type`, `scheduled_at`, `config`                                                           |

### Enums

```python
EproStatus: DRAFT | PUBLISHED | ENDED | ARCHIVED
EproRecordStatus: SCHEDULED | SENT | COMPLETED | UNCOMPLETED | CREATED | ARCHIVED
EproReminderTypes: ABSOLUTE | BEFORE_TARGET | AFTER_SENDING
EproRecordSource: AUTOMATION | API | MANUAL
```

### Key Endpoints

| Path                   | Permission              |
| ---------------------- | ----------------------- |
| `/`                    | EPRO_READ               |
| `<id>/`                | EPRO_READ / EPRO_MODIFY |
| `records/`             | EPRO_RECORDS_READ       |
| `invite/<epro_id>/`    | EPRO_INVITE_SUBJECTS    |
| `fulfillment/<token>/` | Public (token auth)     |
| `structure/<epro_id>/` | EPRO_BUILDER            |

### Periodic Tasks

- `send_epro_invitations_periodic_task`
- `send_epro_reminders_periodic_task`
- `update_status_for_epros_past_target_date_periodic_task`
- `send_epro_occurrences_periodic_task`

---

## Cross-Module Relationships

```
Study
├── 1:1 → Ecrf → Section → SubSection → Block (Question/StaticContent/RepeatedMeasure)
├── 1:M → Epro → EproForm → Section (shared)
├── M:M → StudyCenter
│         └── 1:M → SubjectInStudy
│                   ├── FK → Subject
│                   ├── 1:1 → Inclusion → Answer, Query, Signature, Review
│                   └── 1:M → EproRecord → Answer
└── M:M → User (via StudyUser)
```

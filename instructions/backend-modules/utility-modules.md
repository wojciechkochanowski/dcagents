# Utility Modules

## invitations/

Invitation sending for all modules.

**No models** - Uses other app models.

### Tasks

- `send_econsent_invitations(task_uuid, tenant_base_url)`
- `send_epro_invitations(task_uuid, tenant_base_url)`
- `send_econsult_invitations(task_uuid, tenant_base_url)`
- `send_recruitment_invitations(base_url, qr_code_id, emails, message_subject, rich_text_message_body)`
- `send_recruitment_invitations_via_sms(base_url, qr_code_id, phones, message_body)`
- `send_subject_account_invitation(datacapt_id, email, language, tenant_base_url, account_creation)`

---

## uploaded_files/

File upload and management.

### Models

| Model          | Key Fields                                                   |
| -------------- | ------------------------------------------------------------ |
| `Folder`       | `name`, `study`, `parent`, `centers` M2M                     |
| `Document`     | `uploaded_by`, `study`, `folder`                             |
| `UploadedFile` | `uuid` (PK), `file`, `content_type`, `object_id` (GenericFK) |

### Key Endpoints

Context-specific: `/folders/`, `/documents/`, `/epro/answer/`, `/econsent/answer/`, `/subject_repository/answer/`, `/recruitment/answer/`, `/side_by_side/answer/`, `/builder-image/`, `/logos/`, `/subject_photos/`, `/rich-text/`, `/answer/`

---

## translations/

Multi-language support.

### Models

| Model         | Key Fields                           |
| ------------- | ------------------------------------ |
| `Language`    | `study` (null=global), `name`        |
| `Translation` | `language`, `original`, `translated` |

### Key Endpoints

| Path                     | Scope          |
| ------------------------ | -------------- |
| `/languages/`            | Global         |
| `/languages/default/`    | Global         |
| `/studies/languages/`    | Study-specific |
| `/studies/translations/` | Study-specific |

---

## customer_settings/

Tenant-level configuration.

### Models

| Model                         | Key Fields                                                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `GeneralSettings` (Singleton) | `subject_account_deletion_emails`, `subject_retention_months`, `default_language`, `logo`, `main_colour`, `datacapt_id_pattern/prefix/counter` |
| `SubjectConsent`              | `order`, `body` (RichText)                                                                                                                     |

### Key Endpoints

`/global_customization/`, `/general_settings/`, `/public_settings/`, `/consent_list/`, `/consents/`

---

## customers/

Multi-tenant and SAML configuration.

### Models

| Model                       | Key Fields                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `DatacaptCustomer` (Tenant) | `name`, `base_url`, module flags (`epro_enabled`, etc.), `saml_configuration`, `external_api_key` |
| `SamlConfiguration`         | `name`, `display_name`, `email_domains`, `metadata`, `logo`                                       |
| `Domain`                    | Standard django-tenants                                                                           |

---

## subject_accounts/

Subject portal authentication.

**No models** - Uses Subject/User.

### Key Endpoints

| Path                | Description          |
| ------------------- | -------------------- |
| `/auth/token/`      | Subject login        |
| `/register/`        | Account registration |
| `/dashboard/`       | Subject dashboard    |
| `/me/`              | Profile management   |
| `/me/bank_account/` | Bank details         |

### Tasks

- `delete_redundant_subject_accounts_periodic_task`
- `send_email_to_inactive_periodic_task`
- `set_subjects_as_inactive_periodic_task`

---

## subject_repository/

Subject database with custom forms.

### Model

`SubjectRepositoryConfig` (Singleton): `table_variables`

### Key Endpoints

| Path                               | Description   |
| ---------------------------------- | ------------- |
| `/subjects/`                       | CRUD          |
| `/subjects/list/`                  | Search        |
| `/subjects/assign_to_recruitment/` | Assign        |
| `/structure/`                      | Builder       |
| `/config/`                         | Configuration |

---

## side_by_side/

Sensory testing projects.

### Models

| Model          | Key Fields                                                                     |
| -------------- | ------------------------------------------------------------------------------ |
| `Brand`        | `name` (unique)                                                                |
| `Project`      | `uuid`, `serial_number`, `name`, `status`, `category`, `brand`, `formulas` M2M |
| `ProjectUser`  | `project`, `user`, `centers` M2M                                               |
| `ProjectTest`  | `project`, `subject`, `center`, `formulas` M2M, `status`                       |
| `ProjectChart` | `project`, `title`, `type`, `formulas`, `questions`, `data`                    |

### Enums

```python
ProjectStatus: DRAFT | LIVE | ENDED | COMPLETED
ProjectTestStatus: NOT_STARTED | IN_PROGRESS | COMPLETED
```

---

## analytics/

Study analytics and charts.

### Models

| Model             | Key Fields                                           |
| ----------------- | ---------------------------------------------------- |
| `AnalyticsEntity` | `study`, `name`, `type`, `config`                    |
| `AnalyticsChart`  | `study`, `entity`, `type`, `question`, `question_by` |

---

## econsult/

Video consultations.

### Models

| Model                    | Key Fields                                                               |
| ------------------------ | ------------------------------------------------------------------------ |
| `Video`                  | `uuid`, `room_id`, `user`, `subject`, `status`, `start_time`, `duration` |
| `EconsultInvitationTask` | `video`, `is_sent`, `message_*`                                          |

### Tasks

- `end_inactive_calls` - Periodic cleanup

---

## chat/

AI assistant for study management.

**No models** - Celery tasks for async processing.

### Services

```python
start_chat(messages, context, context_type, study_uuid, conversation_state) -> task_id
get_chat_status(task_id) -> {status, response, tools_used, actions}
```

---

## api/

Public API for external integrations.

**Key features:**

- `ApiPermissionMixin` - API key authentication
- `EcrfApiThrottle` - Rate limiting

---

## taskapp/

Celery configuration.

- `TenantAwareCeleryApp` for multi-tenant support
- Priority queues for progress calculations
- Task status endpoint: `/task/<task_id>/`

---

## contrib/

Django contrib utilities.

- `VersionMiddleware`: Adds `X-APP-VERSION` and `X-GIT-COMMIT` headers

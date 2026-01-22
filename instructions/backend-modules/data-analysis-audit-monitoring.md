# Data Analysis, Audit Trails & Monitoring Modules

## data_analysis/

Measurement data from external devices.

### Models

| Model         | Key Fields                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `SourceFile`  | `study`, `computer_id`, `name`, `timezone`, `file`, `is_dirty`, `import_error`                                                        |
| `Parameter`   | `study`, `name`                                                                                                                       |
| `Measurement` | `source_file`, `parameter`, `serial_number`, `probe_name`, `subject`, `kinetic`, `zone`, `product`, `repetition`, `value`, `datetime` |

### Key Endpoints

| Path                 | Permission                  |
| -------------------- | --------------------------- |
| `source_files/`      | DATA_ANALYSIS_ACCESS/UPLOAD |
| `source_files/<pk>/` | DATA_ANALYSIS_ACCESS        |
| `keys/`              | DATA_ANALYSIS_ACCESS        |
| `measurements/`      | DATA_ANALYSIS_ACCESS        |
| `area_data/`         | DATA_ANALYSIS_ACCESS        |
| `statistics/`        | DATA_ANALYSIS_ACCESS        |
| `comparison/`        | DATA_ANALYSIS_ACCESS        |
| `report/`            | DATA_ANALYSIS_ACCESS        |
| `refresh/`           | DATA_ANALYSIS_REFRESH       |

### Tasks

- `update_source_file_measurements_periodic_task` - Update dirty source files

---

## audit_trails/

Comprehensive audit logging.

### Models

| Model              | Key Fields                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `StudyAuditTrail`  | `user`, `study`, `study_center`, `event_type`, `action_type`, `is_issued_by_platform`, `timestamp`, `additional_data` |
| `GlobalAuditTrail` | `user`, `event_type`, `action_type`, `timestamp`, `additional_data`                                                   |
| `SubjectActivity`  | `subject`, `user`, `recruitment`, `type`, `details`, `changes`, `question`                                            |

### Enums

```python
# StudyActionTypes (partial)
OPEN | CREATED | UPDATED | ADDED | REMOVED | SIGNED | COUNTERSIGNED | EXCLUDED | DELETED | RANDOMISED | UNBLINDED | LOCKED | UNLOCKED | ALLOCATED | DEALLOCATED

# StudyEventTypes (partial)
STUDY | ECRF | INCLUSION | SUBJECT | QUERY | EPRO_* | ECONSENT_* | RANDOMISATION | AUTOMATION | KIT_*

# GlobalActionTypes
INVITED | CONNECTED | DISCONNECTED | DELETED | FAILED | CREATED | BLOCKED | UNBLOCKED

# GlobalEventTypes
USERS | LOGIN | LOGOUT | STUDY | AUTHENTICATION | PASSWORD

# SubjectActivityTypes
ACCOUNT_CREATION | ACCOUNT_ACTIVATED | STATUS_UPDATED | CAMPAIGN_SENT | DATA_* | PAYMENT_* | RECRUITMENT_*
```

### Key Endpoints

| Path                                                   | Permission                | REQUIRES_STUDY |
| ------------------------------------------------------ | ------------------------- | -------------- |
| `study/`                                               | STUDY_AUDIT_TRAIL_ACCESS  | Yes            |
| `/` (root)                                             | GLOBAL_AUDIT_TRAILS_READ  | No             |
| `subject/<datacapt_id>/econsent_timeline/<record_id>/` | SUBJECT_STUDY_ACCESS      | Yes            |
| `subject_activities/<subject_uuid>/`                   | SUBJECT_REPOSITORY_ACCESS | No             |

### Services

```python
create_study_audit_trail(user, study_uuid, event_type, action_type, ...)
create_global_audit_trail(user, event_type, action_type, ...)
create_subject_activity(subject, activity_type, user, ...)
```

---

## monitoring/

Data quality monitoring (queries, SDV, missing answers).

**No models** - Uses `ecrf.Query`, `ecrf.Answer`, `ecrf.EcrfReview`, `ecrf.Inclusion`

### Key Endpoints

| Path       | Permission        | Description              |
| ---------- | ----------------- | ------------------------ |
| `queries/` | MONITORING_ACCESS | Query list with stats    |
| `reviews/` | MONITORING_ACCESS | Reviews summary          |
| `sdv/`     | MONITORING_ACCESS | SDV answer list          |
| `missing/` | MONITORING_ACCESS | Missing required answers |

### Response Extras

```typescript
// Queries
{
  queries_count,
    open_queries_count,
    closed_queries_count,
    resolved_queries_count;
}

// SDV
{
  filtered_required_count, filtered_verified_count;
}

// Reviews
{
  all_subsections, reviewed_subsections;
}

// Missing
{
  missing_percentage, missing_count, missing_subjects_count;
}
```

### Filter Parameters

**Queries:**

- `status` - OPEN, CLOSED, RESOLVED
- `study_center_id` - comma-separated
- Search: `subject_id_field`, `center_code`

**SDV:**

- `subject_id_field`, `study_center_id`, `variable`
- `sdv_status` - VERIFIED/UNVERIFIED

**Missing:**

- `variable`, `variable_full`, `subsection`, `section`
- `subject_id_field`, `study_center_id`, `randomization_record_id`

### AI Chat (Queries Analysis)

```
POST queries/chat/<study_uuid>/start/   # Start AI chat
GET queries/chat/<study_uuid>/status/<task_id>/  # Check status
```

# Calendar & Automations Modules

## calendar_app/ (New Calendar)

Modern calendar with visit scheduling.

### Models

| Model                  | Key Fields                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `VisitSchedule`        | `title`, `visits_count`, `participants_count`, `booking_type`, `is_published`, `is_primary`           |
| `Schedule`             | `title`, `order`, `event_capacity/duration/interval`, `visit_payment_amount`, `color`, `instructions` |
| `ScheduleAvailability` | `schedule`, `timezone`, `start`, `end`, `is_full_day`                                                 |
| `Event`                | `type`, `is_recurring`, `recurring_period`, `title`, `capacity`, `color`, `start`, `end`              |
| `EventSlot`            | `event`, `reserved`, `reserved_until`, `reserved_subject`                                             |
| `Visit`                | `status`, `cause`, `slot`, `event`, `subject`, `project_tests` M2M                                    |

### Enums

```python
BookingType: SEQUENTIAL | OPEN
VisitStatus: SCHEDULED | COMPLETED | NOT_DONE | CANCELLED
EventType: EVENT | OUT_OF_OFFICE
RecurringPeriod: DAILY | WEEKLY | MONTHLY | ANNUALLY
```

### Key Endpoints

| Path                      | Permission          |
| ------------------------- | ------------------- |
| `events/`                 | CALENDAR_ACCESS/ADD |
| `events/<id>/book/`       | CALENDAR_EDIT       |
| `visits/`                 | CALENDAR_ACCESS     |
| `visits/<id>/reschedule/` | CALENDAR_EDIT       |
| `visits/confirm/`         | VISIT_UPDATE        |
| `visit-schedules/`        | CALENDAR_ACCESS     |

### Tasks

- `clear_expired_reservations_task` - Clear expired slot reservations
- `send_calendar_reminders` - Hourly visit reminders

---

## event_calendar/ (Legacy Calendar)

Original appointment system (being phased out).

### Models

| Model                 | Key Fields                                                                     |
| --------------------- | ------------------------------------------------------------------------------ |
| `Appointment`         | `title`, `public_title`, `timezone`, `start/end_datetime`, `capacity`, `color` |
| `AppointmentSubject`  | `appointment`, `subject`, `project_tests` M2M                                  |
| `AppointmentSchedule` | `title`, `visits_count`, `booking_type`, `is_published`                        |
| `ScheduleVisit`       | `title`, `appointment_duration`, `slot_capacity`, `booking_window`             |
| `ScheduleSlot`        | `date`, `start/end_time`, `slot_capacity`                                      |
| `ScheduleSlotSubject` | `schedule_slot`, `subject`, `status`, `cause`, `reserved_until`                |

### Key Endpoints

| Path             | Permission               |
| ---------------- | ------------------------ |
| `events/`        | CALENDAR_ACCESS          |
| `appointments/`  | CALENDAR_ACCESS/ADD/EDIT |
| `bookings/`      | CALENDAR_ACCESS          |
| `visits/causes/` | CALENDAR_ACCESS          |

### Tasks

- `send_calendar_reminders_periodic_task` - 24h/72h reminders
- `remove_expired_slot_reservations` - Cleanup
- `send_appointment_*_emails` - Appointment notifications

---

## automations/

Event-driven automation system.

### Models

| Model        | Key Fields                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `Automation` | `name`, `study`, `event`, `action`, `emails`, `roles` M2M, `email_subject/message`, `trigger_*`, `amount`, `unit` |
| `Log`        | `type`, `level`, `parameters`, `info_flag`, `error_text`                                                          |

### Enums

```python
AutomationEvent:
  SUBJECT_INCLUDED | SUBJECT_EXCLUDED | QUESTION | QUERIES_CREATED |
  ECONSENT_SIGNED | ECONSENT_REJECTED | SUBJECT_RANDOMIZED | EPRO_SENT

AutomationAction:
  EMAIL_NOTIFICATION | SUBJECT_EMAIL_NOTIFICATION | SEND_EPRO

AutomationOperators:
  EQUAL | NOT_EQUAL | GREATER | LOWER | GREATER_OR_EQUAL | LOWER_OR_EQUAL

LogLevel: ERROR | WARNING | INFO
```

### Key Endpoints

| Path    | Permission        |
| ------- | ----------------- |
| `/`     | AUTOMATION_ACCESS |
| `<id>/` | AUTOMATION_ACCESS |

### Email Placeholders

`center`, `subject_id`, `study_ref`, `randomization_id`, `randomization_configuration_code`, `query_message`, `center_code`, `randomization_payload`, `treatment_arm_code`, `treatment_arm_name`, `kit_number`

### Trigger Events

Automations triggered from:

- Subject inclusion/exclusion
- Question answer changes
- ePRO sent
- eConsent signed/rejected
- Subject randomized
- Queries created

### Update Restrictions (Live Study)

- `EMAIL_NOTIFICATION`: Only `emails`, `roles`, `email_subject`, `email_message`, `name` editable
- `SEND_EPRO`: Above + `amount`, `unit`

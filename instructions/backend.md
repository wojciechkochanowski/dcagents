# Backend Development Instructions

## Overview

Django backend for Datacapt clinical trials platform. Multi-tenant architecture via `django-tenants`.

**Repository:** `../backend` (from frontend-feature)
**Main code:** `backend/backend/datacapt_backend/`

## Project Structure

```
backend/                          # Root (docker, docs, CI)
└── backend/                      # Django project (manage.py, Pipfile)
    ├── config/                   # Django config
    │   ├── settings/             # base.py, local.py, production.py, test.py
    │   ├── urls.py               # Root URL configuration
    │   └── wsgi.py
    └── datacapt_backend/         # All Django apps (32 apps)
```

## Django Apps (32 total)

**Core:** `users`, `studies`, `subjects`, `ecrf`, `core`, `customers`
**Clinical:** `epro`, `econsent`, `econsult`, `monitoring`, `randomizations`, `allocation`
**Data:** `audit_trails`, `export`, `reports`, `data_analysis`, `analytics`, `progress`
**Features:** `templates`, `automations`, `translations`, `uploaded_files`, `invitations`
**Modules:** `recruitment`, `payments`, `product_database`, `side_by_side`, `calendar_app`, `event_calendar`, `subject_accounts`, `subject_repository`, `customer_settings`, `chat`, `taskapp`

### 📋 Module Documentation

**Read appropriate module docs before working in that area:**

| Module Group                              | Documentation                                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| core, users, studies                      | [core-users-studies.md](backend-modules/core-users-studies.md)                         |
| subjects, ecrf, epro                      | [subjects-ecrf-epro.md](backend-modules/subjects-ecrf-epro.md)                         |
| allocation, randomizations                | [allocation-randomizations.md](backend-modules/allocation-randomizations.md)           |
| recruitment, econsent                     | [recruitment-econsent.md](backend-modules/recruitment-econsent.md)                     |
| calendar_app, event_calendar, automations | [calendar-automations.md](backend-modules/calendar-automations.md)                     |
| reports, export, templates                | [reports-export-templates.md](backend-modules/reports-export-templates.md)             |
| payments, product_database, progress      | [payments-products-progress.md](backend-modules/payments-products-progress.md)         |
| data_analysis, audit_trails, monitoring   | [data-analysis-audit-monitoring.md](backend-modules/data-analysis-audit-monitoring.md) |
| Other modules                             | [utility-modules.md](backend-modules/utility-modules.md)                               |

## API Patterns

### ViewSet Convention

```python
# Pattern 1: GenericViewSet + Mixins (most common)
class KitTypeViewSet(
    PermissionsRegistryMixin,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    ...

# Pattern 2: ModelViewSet for full CRUD
class AllocationConfigurationViewSet(PermissionsRegistryMixin, viewsets.ModelViewSet):
    ...

# Pattern 3: APIView for custom endpoints
class SubjectStudyView(PermissionsRegistryMixin, views.APIView):
    ...
```

### Permission Pattern

```python
class KitTypeViewSet(PermissionsRegistryMixin, ...):
    REQUIRES_STUDY = True  # Default, requires Study-Uuid header
    permissions_registry = {
        "default": ALLOCATION_CONFIGURATION_EDIT,
        "GET": ALLOCATION_CONFIGURATION_ACCESS,
        "check_delete": ALLOCATION_CONFIGURATION_EDIT,  # Custom action
    }
```

Permission constants built via:

```python
ALLOCATION_ADD = build_permission(Categories.ALLOCATION, Action.ADD)
# Frontend: user.canDo(AclFeature.Allocation)(AclAction.Add)
```

### Serializer Naming Convention

- `{Model}Serializer` - base/create
- `{Model}ReadSerializer` - response with nested data
- `{Model}WriteSerializer` - request validation
- `{Model}UpdateSerializer` - PATCH requests
- `{Model}SearchSerializer` - query params
- `{Model}SimpleSerializer` - minimal fields

### URL Routing

```python
# SimpleRouter for ViewSets
router = routers.SimpleRouter()
router.register(r"kit-types", KitTypeViewSet, "kit-type")

urlpatterns = router.urls + [
    path("kits/import/", KitsImport.as_view()),
]
```

### Response Helpers

```python
from datacapt_backend.core.responses import error, success

return success(payload=serializer.data)
return success(status=HTTP_201_CREATED)
return error(ErrorCode.REQUEST_INVALID, InternalCodes.USER_NOT_EXISTS)
```

## Model Patterns

### Base Classes

| Class                   | Purpose         | Fields                            |
| ----------------------- | --------------- | --------------------------------- |
| `BaseModel`             | Timestamps      | `created_at`, `modified_at`       |
| `SafeDeleteModel`       | Soft delete     | `deleted` field, custom manager   |
| `StatusTransitionMixin` | State machine   | `allowed_status_transitions` dict |
| `TrackingModelMixin`    | Change tracking | `tracked_changes` property        |

### Field Conventions

- Booleans: `is_*`, `*_enabled`, `has_*`
- Dates: `*_date` (DateField), `*_at` (DateTimeField)
- FK: singular (`study`) with `related_name` plural (`studies`)
- Status: `CharField` with `choices=StatusEnum.choices()`

### Soft Delete Pattern

```python
class Subject(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE
    deleted_by_cascade = None
    objects = SafeDeleteManager()
```

## Key Headers (Frontend → Backend)

| Header            | Purpose                          |
| ----------------- | -------------------------------- |
| `Study-Uuid`      | Study context for most endpoints |
| `Study-Reference` | Study reference identifier       |
| `Language`        | Localization                     |
| `Api-Key`         | Public API authentication        |
| `Qr-Code`         | QR code context                  |

## Celery Tasks

### Task Definition

```python
from datacapt_backend.taskapp.celery import app

@app.task
def simple_task(param: str):
    ...

@app.task(bind=True)  # For retry support
def retryable_task(self, task_uuid: str):
    self.retry(countdown=60, max_retries=60)
```

### Multi-tenant Tasks

```python
for tenant in get_tenant_model().objects.exclude(schema_name="public"):
    with tenant_context(tenant):
        actual_task.delay()
```

### Periodic Tasks

18 scheduled tasks in `CELERY_BEAT_SCHEDULE`:

- ePRO invitations/reminders (every 1-5 min)
- Video call cleanup (every 5 min)
- Calendar reminders (hourly)
- Account cleanup (daily at night)
- Progress calculation (configurable)

## Exception Handling

```python
from datacapt_backend.core.exceptions import DatacaptException, ErrorCode, InternalCodes

raise DatacaptException(
    ErrorCode.FORBIDDEN,
    InternalCodes.USER_DOES_NOT_BELONG_TO_STUDY,
)
```

**ErrorCode:** HTTP-level (REQUEST_INVALID, UNAUTHORIZED, FORBIDDEN, NOT_FOUND)
**InternalCodes:** 500+ specific codes for frontend error mapping

## Key Module Relationships

```
studies.Study (central)
    ├── 1:1 ecrf.Ecrf
    ├── M:M studies.StudyCenter (via StudyCenterAssociation)
    ├── M:M users.User (via StudyUser)
    └── 1:M ecrf.SubjectInStudy

ecrf.Subject (global)
    ├── 1:M ecrf.SubjectInStudy (per study)
    └── 1:M recruitment.RecruitmentRecord

ecrf.Ecrf
    └── 1:M Section → SubSection → Block (Question/StaticContent)
```

## Development Commands

```bash
# From backend/backend/ directory
python manage.py runserver                    # Dev server
python manage.py makemigrations <app>         # Create migrations
python manage.py migrate                      # Apply migrations
python manage.py shell_plus                   # Enhanced shell
```

## Unit Tests

### Test Structure

Tests use **pytest** with pytest-django. Each app has `tests/` directory:

```
datacapt_backend/<app>/tests/
├── __init__.py
├── conftest.py       # App-specific fixtures
├── factories.py      # Factory Boy factories
├── test_views.py     # View/endpoint tests
├── test_serializers.py
├── test_models.py
└── test_services.py
```

### Running Tests

```bash
# From backend/ root (uses Docker)
make test                           # All tests
make test-app APP=users             # Single app tests
make test-app APP=ecrf              # eCRF tests

# Direct pytest (from backend/backend/)
pytest --ds config.settings.test datacapt_backend/<app>/tests -vv
pytest --ds config.settings.test datacapt_backend/users/tests/test_views.py -vv
pytest --ds config.settings.test -k "test_create_user" -vv  # By test name
```

### Test Configuration

- **Settings:** `config.settings.test`
- **Config:** `pytest.ini`, `setup.cfg`
- **Coverage:** Reports to `.unitreports/coverage.xml`
- **Flags:** `--reuse-db` (faster), `-vv` (verbose), `-x` (stop on first failure)
- **Note:** `--reuse-db` is enabled by default. If tests fail due to stale data from previous runs (e.g., unexpected users/objects in queries), run with `--create-db` to use a fresh database

### Writing Tests

```python
import pytest
from rest_framework import status

@pytest.mark.django_db
class TestMyViewSet:
    def test_list_items(self, api_client, study, user):
        api_client.force_authenticate(user)
        response = api_client.get(f"/api/items/", HTTP_STUDY_UUID=str(study.uuid))
        assert response.status_code == status.HTTP_200_OK

    def test_create_item(self, api_client, study, user):
        api_client.force_authenticate(user)
        data = {"name": "Test"}
        response = api_client.post(f"/api/items/", data, HTTP_STUDY_UUID=str(study.uuid))
        assert response.status_code == status.HTTP_201_CREATED
```

### Key Fixtures (from conftest.py)

- `api_client` - DRF APIClient
- `user`, `user_factory` - User instances
- `study`, `study_factory` - Study instances
- `study_center`, `study_center_factory` - StudyCenter instances
- `mock_send_sms`, `mock_report_event` - Common mocks

### 🚨 Test Requirements

**All new backend code MUST have unit tests:**

- New ViewSets/Views → test all actions (list, create, update, delete)
- New Serializers → test validation, edge cases
- New Services → test business logic
- New Models → test constraints, methods

**Run tests before committing:**

```bash
make test-app APP=<modified_app>
```

## DO NOT

- Skip `PermissionsRegistryMixin` on ViewSets
- Use raw Django permissions instead of `build_permission()`
- Forget `REQUIRES_STUDY = False` for study-independent endpoints
- Use generic exceptions instead of `DatacaptException`

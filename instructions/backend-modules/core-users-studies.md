# Core, Users & Studies Modules

## core/

Base module with shared utilities.

### Key Components

| File             | Purpose                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `models.py`      | `BaseModel` (timestamps), `TrackingModelMixin`, `RichTextModelMixin`, `ArchivableModelMixin`, `BankAccountModelMixin` |
| `serializers.py` | `DocumentTokenField`, `CachedSlugRelatedField`, `ListInputSerializer`, `EmailDatacaptExceptionMixin`                  |
| `permissions.py` | `build_permission()`, `PermissionsRegistryMixin`                                                                      |
| `responses.py`   | `success(payload, status)`, `error(error_code, internal_code)`                                                        |
| `exceptions.py`  | `DatacaptException`, `ErrorCode`, `InternalCodes`                                                                     |
| `enums.py`       | `PermissionCategoryTypes`, `PermissionTypes`, `EmailSubjects`, `EmailTemplates`, `Languages`                          |

### Permission Pattern

```python
from datacapt_backend.core.permissions import build_permission, Categories, Action

MY_ACCESS = build_permission(Categories.MY_CATEGORY, Action.ACCESS)
MY_EDIT = build_permission(Categories.MY_CATEGORY, Action.EDIT)
```

### Response Pattern

```python
from datacapt_backend.core.responses import error, success

return success(payload=serializer.data)
return success(status=HTTP_201_CREATED)
return error(ErrorCode.FORBIDDEN, InternalCodes.SPECIFIC_ERROR)
```

---

## users/

User management, authentication, roles.

### Models

| Model               | Key Fields                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `User`              | `email` (PK), `first_name`, `last_name`, `is_subject`, `login_type`, `role`, `blocked_until`, `_language`, `timezone`, `config` |
| `Role`              | `name`, `is_predefined`, `colour`, `permissions` M2M                                                                            |
| `Permission`        | `name`, `code`, `category`, `order`                                                                                             |
| `Invitation`        | `email`, `token`, `is_subject`, `user_registered`, `role`                                                                       |
| `JwtTokenBlacklist` | `user`, `jti`, `expires_at`, `token_type`                                                                                       |

### Key Endpoints

| Path            | View                                      | Permission               |
| --------------- | ----------------------------------------- | ------------------------ |
| `auth/token/`   | `CustomJSONWebTokenLoginOrRequestMFACode` | -                        |
| `auth/refresh/` | `TokenRefreshFromCookieView`              | -                        |
| `roles/`        | `RoleViewSet`                             | GLOBAL_USERS_ACCESS/EDIT |
| `register/`     | `RegistrationView`                        | -                        |
| `me/`           | `UserInfoView`                            | IsAuthenticated          |

### Predefined Roles

`ADMIN`, `PROJECT_MANAGER`, `DATA_MANAGER`, `INVESTIGATOR`, `MONITOR`, `AUDITOR`, `MAIN_INVESTIGATOR`

---

## studies/

Study and center management.

### Models

| Model                    | Key Fields                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `Study`                  | `uuid` (PK), `name`, `reference_number`, `status`, `inclusions`, feature flags (`epro_enabled`, etc.) |
| `StudyCenter`            | `name`, `abbreviation` (unique), `country`, bank fields, `latitude`/`longitude`                       |
| `StudyUser`              | `study`, `user`, `role`, `centers` M2M                                                                |
| `StudyCenterAssociation` | `study`, `studycenter`, `code`, `target`                                                              |

### Study Status Transitions

```
DRAFT → LIVE, ENDED
LIVE → SUSPENDED, ENDED
SUSPENDED → LIVE, ENDED
ENDED → ARCHIVED, LIVE
```

### Key Endpoints

| Path                      | View                      | Permission          |
| ------------------------- | ------------------------- | ------------------- |
| `studies/`                | `StudyListViewSet`        | STUDY_LIST_ACCESS   |
| `studies/<pk>/`           | `StudyDetailsViewSet`     | STUDY_LIST_ACCESS   |
| `studies/<uuid>/users/`   | `StudyUsersViewSet`       | STUDY_USER_EDIT     |
| `studies/<uuid>/centers/` | `StudyCenterStudyViewSet` | STUDY_CENTER_EDIT   |
| `centers/`                | `StudyCenterViewSet`      | STUDY_CENTER_ACCESS |

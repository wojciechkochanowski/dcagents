# Reports, Export & Templates Modules

## reports/

Custom report builder.

### Models

| Model                 | Key Fields                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `Report`              | `uuid` (PK), `name`, `created_by`, `is_pinned`, `main_data_source`, `additional_data_sources` |
| `Column`              | `report`, `table`, `field`                                                                    |
| `OrderField`          | `report`, `table`, `field`, `order` (ASC/DESC)                                                |
| `FilterField`         | `report`, `table`, `field`, `operator`, `selections`                                          |
| `ReportCustomization` | `report` (1:1), `icon`, `color`                                                               |

### Enums

```python
DataSource: PAYMENTS | PAYMENT_ORDERS | SUBJECTS
Table: payment | payment_order | subject | subject_database
SortOrder: ASC | DESC
FieldType: BOOLEAN | CHOICES | DATE | ID | NUMBER | STRING | VARIABLE | CENTERS
```

### Key Endpoints

| Path                    | Permission          |
| ----------------------- | ------------------- |
| `items/`                | REPORTS_EDIT/ACCESS |
| `datasources/fields/`   | REPORTS_ACCESS      |
| `data/`                 | REPORTS_ACCESS      |
| `<uuid>/customization/` | REPORTS_EDIT        |

**Note:** `REQUIRES_STUDY = False`, `tenant_module_enabled_field = "reports_enabled"`

---

## export/

Data export system (CSV, XLSX, PDF, JSON).

### Models

| Model        | Key Fields                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ExportData` | `uuid`, `export_type`, `export_data_format`, `export_file_format`, `export_files`, `language`, `failed`, `finished`, `report_file` |

Foreign keys (nullable): `study`, `recruitment_study`, `inclusion`, `epro`, `epro_record`, `econsent`, `econsent_record`, `analytics_entity`, `project`, `report`, `template`

### Enums

```python
ExportTypes: ECRF | INCLUSION | EPRO_LIST | EPRO | EPRO_RECORD | ECRF_BLANK_PDF | EPRO_BLANK_PDF | ECONSENT_BLANK_PDF | ECONSENT_PDF | ECONSENT | ANALYTICS | STUDY_AUDIT_TRAILS | GLOBAL_AUDIT_TRAILS | TEMPLATE | DATA_ANALYSIS | SUBJECTS | SUBJECT | RECRUITMENT | PAYMENTS | PAYMENT_ORDERS | SIDE_BY_SIDE_PROJECT | REPORT

ExportFileFormats: CSV | PDF | XLSX | JSON
ExportDataFormats: VALUES | LABELS
ExportStatus: IN_PROGRESS | COMPLETED | ERROR
```

### Key Endpoints

| Path                    | Permission                 |
| ----------------------- | -------------------------- |
| `ecrf/`                 | ECRF_EXPORT                |
| `epro/`                 | EPRO_EXPORT                |
| `econsent/`             | ECONSENT_EXPORT            |
| `analytics/`            | ANALYTICS_EXPORT           |
| `audit_trails/study/`   | STUDY_AUDIT_TRAIL_EXPORT   |
| `audit_trails/global/`  | GLOBAL_AUDIT_TRAILS_EXPORT |
| `subject_repository/`   | SUBJECT_REPOSITORY_EXPORT  |
| `recruitment/<uuid>/`   | RECRUITMENT_EXPORT         |
| `report/<uuid>/`        | REPORTS_ACCESS             |
| `status/<export_uuid>/` | -                          |

### Response Pattern

```json
// POST returns 202 Accepted
{ "export_uuid": "uuid-string" }

// GET status
{
  "uuid": "...",
  "status": "IN_PROGRESS|COMPLETED|ERROR",
  "report_size": number|null,
  "export_file_format": "CSV|PDF|XLSX|JSON"
}
```

### Celery Tasks

- `export_to_csv(export_uuid)`
- `export_to_xlsx(export_uuid)`
- `export_to_pdf(export_uuid)`
- `export_to_json(export_uuid)`

---

## templates/

Form templates for reuse.

### Models

| Model      | Key Fields                                                                         |
| ---------- | ---------------------------------------------------------------------------------- |
| `Template` | `title`, `description`, `structure` (JSON), `tags`, `owner`, `type`, `module_type` |

### Enums

```python
TemplateTypes: SECTION | SUBSECTION | FULL | BLOCK
TemplateModuleTypes: ECRF | EPRO | ECONSENT | RECRUITMENT | SIDE_BY_SIDE
```

### Key Endpoints

| Path           | Permission            |
| -------------- | --------------------- |
| `/`            | TEMPLATES_READ        |
| `sections/`    | TEMPLATES_READ/DELETE |
| `subsections/` | TEMPLATES_READ/DELETE |
| `full/`        | TEMPLATES_READ/DELETE |
| `blocks/`      | TEMPLATES_READ/DELETE |
| `tags/`        | TEMPLATES_READ        |
| `import/`      | TEMPLATES_READ        |

**From Template Creation:**

- `sections/{ecrf,epro,econsent,recruitment,project}/`
- `subsections/{ecrf,epro,econsent,recruitment,project}/`
- `full/{ecrf,epro,econsent,recruitment,project}/`
- `blocks/{ecrf,epro,econsent,recruitment,project}/`

**Note:** `REQUIRES_STUDY = False`

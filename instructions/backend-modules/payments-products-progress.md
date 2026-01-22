# Payments, Products & Progress Modules

## payments/

Subject payments and bank transfers.

### Models

| Model          | Key Fields                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `Payment`      | `recruitment_record`, `slot_subject` (1:1), `visit` (1:1), `status`, `amount`, `currency`, `tax`, `comment`     |
| `PaymentOrder` | `payment`, `transaction`, `center`, `center_abbreviation`, `subject_full_name`, `amount`, `status`, bank fields |
| `Transaction`  | `unique_id` (PK), `center`                                                                                      |

### Enums

```python
PaymentStatus: PENDING | CANCELLED | APPROVED | PROCESSING | ERROR | PAID | REJECTED

# Transitions:
PENDING -> APPROVED, CANCELLED
CANCELLED -> APPROVED
APPROVED -> CANCELLED, REJECTED, (confirm -> PROCESSING)
REJECTED -> APPROVED
ERROR -> (confirm -> PROCESSING)
PROCESSING, PAID -> terminal
```

### Key Endpoints

| Path                           | Permission            |
| ------------------------------ | --------------------- |
| `payments/recruitment/<uuid>/` | PAYMENTS_ACCESS       |
| `payments/<id>/`               | PAYMENTS_EDIT         |
| `payments/status/`             | PAYMENTS_EDIT         |
| `payments/confirm/`            | PAYMENTS_EDIT         |
| `payments/orders/`             | PAYMENT_ORDERS_ACCESS |
| `payments/orders/invalidate/`  | PAYMENT_ORDERS_EDIT   |
| `payments/transactions/`       | PAYMENT_ORDERS_EDIT   |

### Error Codes

- `PAYMENT_AMOUNT_CHANGE_NOT_ALLOWED_FOR_STATUS`
- `PAYMENT_COMMENT_REQUIRED`
- `PAYMENT_STATUS_ILLEGAL_TRANSITION`
- `PAYMENT_CENTER_DATA_MISSING`
- `PAYMENT_CURRENCY_MISMATCH`

---

## product_database/

Product/formula management for sensory testing.

### Models

| Model     | Key Fields                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Formula` | `brand`, `formula_number`, `type`, `product_name`, `category`, `techno`, `shade_name`, `batch_number`, `processing_time`, `status`, `master` |

### Enums

```python
FormulaType: STANDARD | SAMPLE | BENCHMARK
FormulaStatus: NOT_VALIDATED | VALIDATED | IN_PROGRESS | ABANDONED
```

### Key Endpoints

| Path               | Permission          |
| ------------------ | ------------------- |
| `products/`        | SIDE_BY_SIDE_ACCESS |
| `products/assign/` | SIDE_BY_SIDE_ACCESS |

**Note:** `REQUIRES_STUDY = False`, requires `tenant.side_by_side_enabled`

### Request Examples

```typescript
// POST products/
interface ProductCreate {
  brand_name: string;
  formula_number: string;
  type: FormulaType;
  product_name: string;
  category?: string;
  shade_name?: string;
  batch_number?: string;
  processing_time?: number;
  status?: FormulaStatus;
  master?: boolean; // default true
}

// POST products/assign/
interface AssignProducts {
  project_uuid: string;
  products?: number[]; // if omitted, uses filtered queryset
}
```

---

## progress/

Inclusion and study progress calculation.

### Models

| Model                         | Key Fields                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `ProgressStudy`               | `study` (1:1), `progress_percentage`                                                     |
| `ProgressInclusion`           | `inclusion` (1:1), `study`, `progress_percentage`, `last_updated`, `update_pending`      |
| `ProgressSectionInclusion`    | `inclusion`, `section`, `progress_percentage`, `questions_count`, `filled_answers_count` |
| `ProgressSubsectionInclusion` | `inclusion`, `subsection`, `progress_percentage`, `filled_answers_sdv_count`             |

### Key Endpoints

| Path              | Permission          |
| ----------------- | ------------------- |
| `progress/study/` | IsAuthenticatedUser |

### Response

```typescript
interface ProgressStudy {
  id: number;
  progress_percentage: number;
  study: string;
  sections: Array<{
    section_id: number;
    section_name: string;
    section_progress: number;
    questions_count: number;
    filled_answers_count: number;
    inclusions_count: number;
    completed_records: number;
  }>;
}
```

### Celery Tasks

```python
# Periodic (via CELERY_BEAT_SCHEDULE):
participant_progress_manager_task   # Reads from Redis, dispatches calculation
study_progress_manager_task         # Reads from Redis, dispatches calculation

# Worker tasks:
participant_progress_calculator_task(study, id, ...)
study_progress_calculator_task(id, ...)

# Redis keys: progress_object:{tenant}:{table}:{pk}
```

### Services

```python
ProgressPersistenceService(study, inclusion=None, user=None):
  save_study_progress()
  save_inclusion_progress()
  save_sections_progress()
  save_subsections_progress()
  save_all()
```

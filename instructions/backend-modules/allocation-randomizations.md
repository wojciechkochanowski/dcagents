# Allocation & Randomizations Modules

## allocation/

Kit inventory and subject allocation management.

### Models

| Model                     | Key Fields                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `KitType`                 | `study`, `code` (auto-increment), `label`, `description`                                   |
| `AllocationConfiguration` | `study`, `name`, `randomization` (FK)                                                      |
| `Period`                  | `allocation_config`, `order`                                                               |
| `KitTypeAssociation`      | `period`, `kit_type`, `treatment_arm`                                                      |
| `AllocationList`          | `study`, `mode` (DUMMY/PRODUCTION)                                                         |
| `Kit`                     | `kit_number`, `location`, `kit_type`, `batch`, `expiration_date`, `status`, `allocated_to` |

### Enums

```python
AllocationMode: DUMMY | PRODUCTION
AllocationStatus: AVAILABLE | ALLOCATED | INVALID | IN_TRANSFER | RECEIVED

# Status transitions:
AVAILABLE -> IN_TRANSFER, INVALID
ALLOCATED -> INVALID
IN_TRANSFER -> RECEIVED, INVALID
RECEIVED -> AVAILABLE, IN_TRANSFER
```

### Key Endpoints

| Path                    | Permission                           |
| ----------------------- | ------------------------------------ |
| `kit-types/`            | ALLOCATION_CONFIGURATION_ACCESS/EDIT |
| `configurations/`       | ALLOCATION_CONFIGURATION_ACCESS/EDIT |
| `kits/`                 | KIT_INVENTORY_ACCESS                 |
| `kits/import/`          | KIT_INVENTORY_EDIT                   |
| `kits/allocate/`        | ALLOCATION_ADD                       |
| `kits/<id>/deallocate/` | ALLOCATION_EDIT                      |

### Error Codes

- `ALLOCATION_KIT_TYPE_NOT_EXISTS`
- `ALLOCATION_KIT_TYPE_USED_IN_PRODUCTION_KITS`
- `ALLOCATION_NO_KIT_TO_ALLOCATE_IN_THIS_PERIOD`
- `ALLOCATION_MISSING_AVAILABLE_KITS_IN_INVENTORY`
- `ALLOCATION_FORBIDDEN_STATUS_TRANSITION`

---

## randomizations/

Randomization configuration and subject randomization.

### Models

| Model                           | Key Fields                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `StudyRandomizationAssociation` | `name`, `study`, `dynamic_randomization` XOR `static_randomization`           |
| `StaticRandomization`           | `blinding_type`, `seed`, `list_length`, `block_size` (JSON array)             |
| `DynamicRandomization`          | `blinding_type`, `prob_value`, `distance_method`, `selection_method`          |
| `TreatmentArm`                  | `study_randomization`, `name`, `code`, `weight`                               |
| `Stratum`                       | `study_randomization`, `stratum_type` (CENTER/QUESTION), `question`, `weight` |
| `RandomizationList`             | `study_randomization`, `type`, `center`                                       |
| `RandomizationSlot`             | `position`, `assigned_arm`, `block_identifier`, `is_assigned` (static only)   |
| `SubjectRandomizationRecord`    | `randomization_list`, `subject`, `assigned_arm`, `randomization_id`           |

### Enums

```python
RandomizationType: STATIC | DYNAMIC | IMPORT
StratumType: CENTER | QUESTION
BlindingType: OPEN | SINGLE_BLIND | DOUBLE_BLIND
DistanceMethod: RANGE | VARIANCE | MAXIMUM  # dynamic
SelectionMethod: BEST | PROBABILITY  # dynamic
```

### Key Endpoints

| Path                            | Permission                         |
| ------------------------------- | ---------------------------------- |
| `/`                             | RANDOMIZATION_CONFIGURATION_ACCESS |
| `create-static-randomization/`  | RANDOMIZATION_CONFIGURATION_EDIT   |
| `create-dynamic-randomization/` | RANDOMIZATION_CONFIGURATION_EDIT   |
| `<id>/import/`                  | RANDOMIZATION_LIST_EDIT            |
| `<id>/randomized-subjects/`     | RANDOMIZATION_LIST_ACCESS          |
| `<id>/unblind-subject/`         | ECRF_EMERGENCY_UNBLIND             |
| `randomize-subject/`            | ECRF_ANSWER                        |

### TypeScript Interface

```typescript
interface CreateStaticRandomization {
  name: string;
  blinding_type: "OPEN" | "SINGLE_BLIND" | "DOUBLE_BLIND";
  block_size: number[]; // e.g., [4, 6, 8]
  list_length?: number;
  treatment_arms: Array<{
    name: string;
    code: number;
    weight: number;
    description?: string;
  }>;
  strata?: Array<{
    stratum_type: "CENTER" | "QUESTION";
    question?: number;
    weight?: number;
  }>;
}

interface RandomizeSubject {
  subject_id: string; // datacapt_id
  button_id: number; // ButtonContent.id
  password?: string; // required for SAML users
}
```

### Error Codes

- `RANDOMIZATION_NOT_EXISTS`
- `RANDOMIZATION_NO_TREATMENT_ARMS`
- `RANDOMIZATION_BLOCK_SIZE_INVALID`
- `RANDOMIZATION_NO_AVAILABLE_SLOTS`
- `RANDOMIZATION_SUBJECT_ALREADY_RANDOMIZED`
- `RANDOMIZATION_DELETE_FORBIDDEN`

---

## Integration

```
allocation.AllocationConfiguration
    └── randomization: FK(StudyRandomizationAssociation)

allocation.KitTypeAssociation
    └── treatment_arm: FK(TreatmentArm)

# Both use:
# - DUMMY (Draft study) / PRODUCTION (Live study) modes
# - SubjectInStudy as subject reference
# - Study-Uuid header for context
```

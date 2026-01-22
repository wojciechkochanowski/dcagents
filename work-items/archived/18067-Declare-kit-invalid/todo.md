# Task List: 18067 - Declare a Kit as Invalid

## Planning Phase ✅
- [x] Analiza istniejącej funkcjonalności undo kit allocation
- [x] Badanie struktury komponentów i API patterns
- [x] Stworzenie requirements.md
- [x] Stworzenie implementation.md
- [x] Podział na sub-agent tasks

## Development Phase
### API Layer
- [x] Implementacja `declareKitInvalid` function w subjectsInApp.ts
- [x] Interface `DeclareKitInvalidOptions` z required reason
- [x] Error handling pattern dla allocation not found
- [x] Response handlers (onSuccess, onRequestError, onAllocationNotFound)

### UI Components  
- [x] Stworzenie DeclareInvalidModal component
- [x] Props interface (isOpened, onClose, onConfirm, allocation, loading)
- [x] Form z wymaganym reason field + validation
- [x] Styling .less z invalid color scheme
- [x] Integration z AllocationButtonControl
- [x] Dropdown menu option "Declare invalid"
- [x] State management (declareInvalidModal, isDeclaring)
- [x] Handler functions (handleDeclareInvalid, handleConfirmDeclareInvalid)

### Visual Indicators
- [x] Invalid kit display styling
- [x] Status badge "INVALID"  
- [x] Icon z warning/invalid colors
- [x] Strikethrough text styling
- [x] Distinct colors from undo action

### Translations
- [x] declare_invalid key
- [x] confirm_declare_invalid key  
- [x] reason_for_declaring_invalid key
- [x] invalid_kit_status key

## Integration Phase
- [x] Import testing wszystkich komponentów
- [x] Permission validation (allocation.edit)
- [x] Error handling verification
- [x] UI/UX consistency check
- [x] Existing undo functionality preservation

## Validation Phase  
- [x] Linting workflow execution
- [x] Manual testing w eCRF
- [x] Permission edge cases
- [x] API error scenarios
- [x] Visual state verification

## Backend Dependencies
- [ ] PUT /api/allocation/kits/{allocationId}/invalidate endpoint
- [ ] Request body z reason field
- [ ] Response error codes alignment
- [ ] Audit trail implementation

## Notes
- Backend endpoint będzie implementowany równolegle
- Frontend structure może być przygotowana z placeholder API
- Wzorować się ściśle na undo allocation pattern
- Zachować wszystkie istniejące properties kits oprócz status
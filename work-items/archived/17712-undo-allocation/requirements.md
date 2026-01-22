# 17712 - Undo Allocation

## Analiza zadania

**Cel:** Dodanie funkcji cofania alokacji kitu uczestnikowi przez opcję "Undo Allocation" w menu akcji.

**Acceptance Criteria:**
- **Given:** Kit został już przydzielony uczestnikowi
- **When:** Kliknę w menu akcji i wybiorę "Undo Allocation" 
- **Then:** Wybrany kit zostaje usunięty z listy alokacji

## Aktualny stan kodu

### ✅ Co już jest gotowe:
- **UI Components**: Komponent `AllocationActionMenu` z opcją "Undo Allocation" już istnieje
- **Enum**: `ActionType.Undo` zdefiniowany w linii 20
- **Tłumaczenia**: Klucz `"studies.inclusion.allocation.button.undo_allocation": "Undo kit allocation"` już istnieje
- **Style CSS**: Klasa `.dropdown-menu__item--red` dla czerwonego elementu menu już dostępna
- **Struktura**: Menu akcji już podłączone do każdego elementu alokacji w `AllocationListItem`

### ❌ Co brakuje:
- **Funkcja onUndo**: Obecnie pusta funkcja `() => {}` w linii 65
- **API funkcja**: Brak funkcji `undoAllocationSubject` w requests
- **Modal potwierdzenia**: Opcjonalnie dla lepszego UX

## Uwagi techniczne

1. **Bezpieczeństwo**: Operacja undo powinna być bezpieczna i odwracalna
2. **UX**: Rozważyć dodanie modal potwierdzenia w przyszłości  
3. **Performance**: Używać useCallback dla funkcji handleUndo
4. **Error handling**: Obsłużyć wszystkie scenariusze błędów z API
5. **Accessibility**: Menu dropdown już ma odpowiednie aria attributes

## Definicja "Done"

- ✅ Użytkownik może kliknąć na menu akcji przy alokacji
- ✅ Opcja "Undo Allocation" jest widoczna i aktywna
- ✅ Po kliknięciu undo alokacja znika z listy
- ✅ Wyświetlane są odpowiednie komunikaty sukcesu/błędu
- ✅ Nie ma błędów TypeScript ani ESLint
- ✅ Acceptance Criteria są w 100% spełnione
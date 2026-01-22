# Plan implementacji: 16952 Emergency Unblinding

## KROK 1: Przygotowanie komponentów bazowych (Sub-agent 1)

**Zadanie**: Implementacja dropdown menu w RandomisationButtonControl

**Szczegóły**:
- **Lokalizacja**: `/apps/datacapt/src/components/shared/Fulfillment/FulfillmentButton/RandomisationButtonControl/RandomisationButtonControl.tsx`
- **Zastąpić**: button z `dots-vertical` na pełny `DatacDropdownMenu`
- **Opcje menu**: "Unblind" z ikoną `eye-off` (czerwona)
- **Uprawnienia**: sprawdzanie `AclFeature.EmergencyUnblind` (nowe uprawnienie)
- **Obsługa**: callback do otwierania modala

**Kryteria ukończenia**:
- Dropdown menu działa poprawnie
- Opcja "Unblind" widoczna tylko dla uprawnień
- Kliknięcie otwiera modal (placeholder)

## KROK 2: System uprawnień (Sub-agent 2) 

**Zadanie**: Dodanie nowego uprawnienia EmergencyUnblind

**Szczegóły**:
- **Lokalizacja**: `/common/requests/generalSettings/roles.ts`
- **Nowe uprawnienie**: `AclFeature.EmergencyUnblind = 'EMERGENCY_UNBLIND'`
- **Integracja**: we wszystkich komponentach używających uprawnień
- **Sprawdzanie**: `user.canAccess(AclFeature.EmergencyUnblind)`

**Miejsca do aktualizacji**:
- RandomisationButtonControl (pokazanie opcji menu)
- EmergencyUnblindModal (dostęp do modala)

**Kryteria ukończenia**:
- Uprawnienie dodane i poprawnie sprawdzane
- Wszystkie komponenty respektują nowe uprawnienie
- Backend integration gotowy (placeholder calls)

## KROK 3: Tłumaczenia (Sub-agent 3)

**Zadanie**: Dodanie tekstów angielskich dla Emergency Unblinding

**Szczegóły**:
- **Lokalizacja**: `/common/intl/en.json` 
- **Format**: płaski (jak w aplikacji), nie zagnieżdżony
- **Klucze wzorowane na**: `studies.inclusion.randomisation.*`

**Teksty do dodania** (zgodnie z istniejącym formatem):
```json
"studies.inclusion.randomisation.emergency_unblind.menu_option": "Unblind",
"studies.inclusion.randomisation.emergency_unblind.modal.title": "Unblind subject",
"studies.inclusion.randomisation.emergency_unblind.modal.info": "Emergency unblinding will unblind the participant randomization for all users with the appropriate permissions.",
"studies.inclusion.randomisation.emergency_unblind.modal.password_required": "You must enter your password to confirm.",
"studies.inclusion.randomisation.emergency_unblind.modal.password_label": "Enter your password",
"studies.inclusion.randomisation.emergency_unblind.modal.show_password": "Show",
"studies.inclusion.randomisation.emergency_unblind.modal.button_submit": "Unblind subject",
"studies.inclusion.randomisation.emergency_unblind.modal.button_cancel": "Cancel",
"studies.inclusion.randomisation.emergency_unblind.success.title": "Participant Unblinded",
"studies.inclusion.randomisation.emergency_unblind.success.message": "Every user with the appropriate permission will now see the Randomization Treatment Group."
```

**Kryteria ukończenia**:
- Teksty dodane do en.json w poprawnym formacie
- Integracja z komponentami
- Zgodność z konwencją nazewnictwa aplikacji

## KROK 4: Backend integration (Sub-agent 4)

**Zadanie**: Implementacja API calls dla emergency unblinding

**Szczegóły**:
- **Lokalizacja**: `/common/requests/subjects/subjectsInApp.ts`
- **Nowa funkcja**: `emergencyUnblindSubject(subjectId, password)`
- **Endpoint**: `POST /subjects/{id}/emergency-unblind` (backend implementuje)
- **Request body**: `{ password: string }` (backend loguje powód automatycznie)
- **Response**: informacje o unblinded treatment group

**Error handling**:
- Niepoprawne hasło
- Brak uprawnień  
- Subject już unblinded
- Błędy serwera

**Kryteria ukończenia**:
- API call poprawnie zaimplementowany
- Error handling zgodny z wzorcami aplikacji
- TypeScript interfaces dodane

## KROK 5: EmergencyUnblindModal + Success Toast (Sub-agent 5)

**Zadanie**: Stworzenie modala Emergency Unblinding + success toast

**Link do Figma**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25060-116258&m=dev

**Szczegóły modala**:
- **Lokalizacja**: `/apps/datacapt/src/components/shared/Fulfillment/EmergencyUnblindModal/`
- **Struktura**: `EmergencyUnblindModal.tsx`, `EmergencyUnblindModal.less`, `index.tsx`
- **Bazuje na**: `DatacModal` (jak inne modale w aplikacji)

**Komponenty modala**:
1. **Header**: "Unblind subject" + close button
2. **Info box**: niebieskie tło, ikona info, tekst informacyjny
3. **Password field**: "Enter your password" + "Show" button 
4. **Footer**: "Cancel" + "Unblind subject" (niebieski)

**Success Toast** (po successful unblind):
- **Design**: zgodny z Figma (zielony toast)
- **Tytuł**: "Participant Unblinded"  
- **Tekst**: "Every user with the appropriate permission will now see..."
- **Wyświetlanie**: automatycznie po successful API response

**Funkcjonalności**:
- Walidacja hasła po stronie frontendu
- Loading state podczas API call
- Error handling (błędne hasło, błędy serwera)
- Success toast po udanym unblind
- Integracja z `FulfillmentContext`

**Kryteria ukończenia**:
- Modal zgodny z designem 1:1
- Toast wyświetla się po successful unblinding
- Error states zaimplementowane
- Integracja z istniejącą architekturą

## Plan dla głównego agenta po zakończeniu prac sub-agentów

### KROK 6: Integration Testing & Fixes

**Zadania głównego agenta**:
1. **Sprawdzenie integracji** wszystkich komponentów
2. **End-to-end testing** całego flow
3. **Poprawki** issues między komponentami  
4. **Styling fixes** - dostosowanie do design systemu
5. **Performance check** - ładowanie, responsywność

### KROK 7: Display Treatment Group (po unblinding)

**Wyświetlanie treatment group**:
- **RandomisationButtonControl**: pokazanie unblinded treatment group
- **RandomisationModal**: rozszerzenie o unblinded information
- **Styling**: wyraźne oznaczenie że subject jest unblinded

### KROK 8: Final Testing & Polish

**Końcowe zadania**:
1. **Testowanie uprawnień** - różne role użytkowników
2. **Error scenarios** - wszystkie edge cases
3. **UI/UX polish** - zgodność z design systemem
4. **Code review preparation** - czystość kodu, komentarze
5. **Documentation update** - jeśli potrzebne

## Uwagi techniczne

### Istniejąca architektura do wykorzystania:
- `FulfillmentContextWrapper` - kontekst danych uczestnika
- `UserContext` - system uprawnień
- `DatacModal` - komponent bazowy modala
- `DatacDropdownMenu` - dropdown menu
- Toast system - powiadomienia
- **Backend** - automatyczne logowanie audit trail

### Bezpieczeństwo:
- Walidacja hasła po stronie backendu
- Sprawdzanie uprawnień na każdym poziomie
- Backend automatycznie loguje w audit trail
- Secure password handling (nie logowanie haseł)

### Performance:
- Lazy loading modala
- Minimalne re-renders
- Efficient API calls
- Proper cleanup

## Kryteria akceptacji całego zadania

✅ **AC1**: Opcja unblind widoczna w menu randomisation button (dla uprawnień)
✅ **AC2**: Modal z powodem i weryfikacją hasła 
✅ **AC3**: Wyświetlanie treatment group po unblind
✅ **AC4**: Pełne logowanie w audit trail

## Szacowany czas implementacji: 2-3 dni robocze

### Kolejność prac:
1. **Sub-agent 2** (uprawnienia) - pierwszy, potrzebne dla innych
2. **Sub-agent 3** (tłumaczenia) - równolegle z uprawnień
3. **Sub-agent 1** (dropdown menu) - po uprawnień
4. **Sub-agent 4** (API) - równolegle z dropdown
5. **Sub-agent 5** (modal + toast) - po API i tłumaczenia
6. **Główny agent** (integracja, testing, polish)

Każdy sub-agent powinien przygotować raport z wykonanych prac aby główny agent mógł wykonać integrację i finalne testy.
# Todo List - 16952 Emergency Unblinding

## KROK 1: Przygotowanie komponentów bazowych (Sub-agent 1)
- [ ] Implementacja dropdown menu w RandomisationButtonControl
- [ ] Zastąpienie button z `dots-vertical` na pełny `DatacDropdownMenu`
- [ ] Dodanie opcji "Unblind" z ikoną `eye-off` (czerwona)
- [ ] Sprawdzanie uprawnień `AclFeature.EmergencyUnblind`
- [ ] Obsługa callback do otwierania modala

## KROK 2: System uprawnień (Sub-agent 2)
- [ ] Dodanie nowego uprawnienia `AclFeature.EmergencyUnblind = 'EMERGENCY_UNBLIND'`
- [ ] Aktualizacja `/common/requests/generalSettings/roles.ts`
- [ ] Integracja we wszystkich komponentach używających uprawnień
- [ ] Sprawdzanie `user.canAccess(AclFeature.EmergencyUnblind)`

## KROK 3: Tłumaczenia (Sub-agent 3)
- [ ] Dodanie tekstów angielskich do `/common/intl/en.json`
- [ ] Klucze zgodne z wzorcem `studies.inclusion.randomisation.*`
- [ ] Integracja z komponentami
- [ ] Zgodność z konwencją nazewnictwa aplikacji

## KROK 4: Backend integration (Sub-agent 4)
- [ ] Implementacja API calls w `/common/requests/subjects/subjectsInApp.ts`
- [ ] Nowa funkcja `emergencyUnblindSubject(subjectId, password)`
- [ ] Endpoint `POST /subjects/{id}/emergency-unblind`
- [ ] Error handling (niepoprawne hasło, brak uprawnień, itp.)
- [ ] TypeScript interfaces

## KROK 5: EmergencyUnblindModal + Success Toast (Sub-agent 5)
- [ ] Stworzenie modala w `/apps/datacapt/src/components/shared/Fulfillment/EmergencyUnblindModal/`
- [ ] Modal zgodny z designem Figma
- [ ] Password field z "Show" button
- [ ] Success toast po udanym unblind
- [ ] Error handling i loading states
- [ ] Integracja z `FulfillmentContext`

## KROK 6: Integration Testing & Fixes (Główny agent)
- [ ] Sprawdzenie integracji wszystkich komponentów
- [ ] End-to-end testing całego flow
- [ ] Poprawki issues między komponentami
- [ ] Styling fixes - dostosowanie do design systemu
- [ ] Performance check

## KROK 7: Display Treatment Group (Główny agent)
- [ ] Wyświetlanie treatment group w RandomisationButtonControl
- [ ] Rozszerzenie RandomisationModal o unblinded information
- [ ] Styling - wyraźne oznaczenie że subject jest unblinded

## KROK 8: Final Testing & Polish (Główny agent)
- [ ] Testowanie uprawnień - różne role użytkowników
- [ ] Error scenarios - wszystkie edge cases
- [ ] UI/UX polish - zgodność z design systemem
- [ ] Code review preparation
- [ ] Wykonanie flow z `~/work/datacapt/.claude/commands/fast-check.md`
- [ ] Wykonanie flow z `~/work/datacapt/instructions/lint.md`
- [ ] Sprawdzenie requirements.md - czy o niczym nie zapomniano
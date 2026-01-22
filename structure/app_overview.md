# Datacapt App - Przegląd Struktury Komponentów

## Lokalizacja

`frontend/apps/datacapt/src/components/`

## Główne moduły aplikacji (15 modułów)

### 1. **auth** - Autoryzacja i autentykacja

- **Komponenty**: 14 komponentów
- **Funkcja**: Logowanie, rejestracja, odzyskiwanie hasła, sesje
- **Kluczowe**: SignInContent, SignUpContent, AuthRoute, UserContext

### 2. **studies** - Zarządzanie badaniami

- **Komponenty**: 4 główne grupy
- **Funkcja**: CRUD badań, szczegóły badań, konsultacje, skracanie linków
- **Kluczowe**: StudiesContent, StudyDetailsContent, Econsult

### 3. **recruitment** - Rekrutacja uczestników

- **Komponenty**: 2 główne grupy
- **Funkcja**: Zarządzanie rekrutacją, szczegóły badań rekrutacyjnych
- **Kluczowe**: RecruitmentStudiesContent, RecruitmentStudyDetailsContent

### 4. **calendar** - System kalendarzowy

- **Komponenty**: 3 główne grupy + store
- **Funkcja**: Zarządzanie wizytami, harmonogramem, rezerwacjami
- **Kluczowe**: CalendarContent, BookingsContent, CalendarLayout

### 5. **shared** - Komponenty współdzielone

- **Komponenty**: 12 głównych grup
- **Funkcja**: Builder formularzy, Fulfillment, Survey, Editor, tabele
- **Kluczowe**: Builder, Fulfillment, Survey, Editor

### 6. **SubjectRepository** - Repozytorium uczestników

- **Komponenty**: 6 głównych grup
- **Funkcja**: Zarządzanie bazą uczestników, profile, ustawienia
- **Kluczowe**: SubjectRepositoryDashboard, SubjectRepositoryProfile

### 7. **SubjectDashboard** - Dashboard uczestnika

- **Komponenty**: 7 głównych grup
- **Funkcja**: Interfejs dla uczestników, konta, wizyty
- **Kluczowe**: SubjectDashboard, BookAppointments, AccountDetails

### 8. **settings** - Ustawienia systemu

- **Komponenty**: 12 głównych grup
- **Funkcja**: Konfiguracja systemu, użytkownicy, role, szablony
- **Kluczowe**: SettingsLayout, SettingsUsersContent, SettingsRolesContent

### 9. **payments** - System płatności

- **Komponenty**: 5 głównych grup
- **Funkcja**: Płatności, zamówienia, dashboard płatności
- **Kluczowe**: PaymentsDashboard, PaymentOrdersDashboard

### 10. **sideBySide** - Porównanie projektów

- **Komponenty**: 2 główne grupy
- **Funkcja**: Zarządzanie projektami side-by-side
- **Kluczowe**: SideBySideProjectsContent, SideBySideProjectDetailsContent

### 11. **BasicLayout** - Layout podstawowy

- **Komponenty**: 2 podgrupy
- **Funkcja**: Podstawowy layout aplikacji
- **Kluczowe**: BasicLayout, BottomPopup, InformationBanner

### 12. **ContentLayout** - Layout treści

- **Komponenty**: Pojedynczy komponent
- **Funkcja**: Layout dla głównej treści

### 13. **Products** - Produkty

- **Komponenty**: 1 główna grupa
- **Funkcja**: Zarządzanie produktami

### 14. **LP** - Landing Page

- **Komponenty**: 1 komponent
- **Funkcja**: Strona docelowa

### 15. **NotFound** - Strona błędu

- **Komponenty**: Pojedynczy komponent
- **Funkcja**: Obsługa błędu 404

## Statystyki

- **Łącznie katalogów**: 307
- **Łącznie plików**: 272
- **Średnia głębokość**: 3-4 poziomy
- **Konwencja**: każdy komponent ma `index.tsx` + `ComponentName.tsx` + style `.less`

# Recruitment Study Details - Szczegóły badania rekrutacyjnego

## Lokalizacja w kodzie
- **Page component**: Komponent w `pages/recruitment/[id]/` (routing do szczegółów recruitment study)
- **UI components**: (klasy CSS znalezione na stronie)
  - `recruitment-study-details-layout` - główny layout strony
  - `recruitment-study-details-layout__header` - nagłówek z nawigacją
  - `recruitment-study-details-layout__tabs` - kontener zakładek
  - `basic-layout__content` - główny obszar zawartości
  - `ant-tabs`, `ant-tabs-nav-list` - komponenty zakładek Ant Design
  - `status-tag`, `study-status-tag` - komponenty statusu study

## Dostęp
- Z [[recruitment-studies|listy Recruitment Studies]] → kliknięcie nazwy study
- URL pattern: `/en/recruitment/[uuid]`

## Struktura strony

### Nagłówek
- **Powrót**: "← Back to studies" (klasa: `recruitment-study-details-layout__header__go-back`)
- **Nazwa study**: Dynamiczna nazwa study (klasa: `recruitment-study-details-layout__header__name`)
- **Status**: Badge ze statusem study (klasy: `status-tag study-status-tag study-status-tag--background-draft`)
- **Przycisk akcji**: "Add Participants" (klasa: `recruitment-study-details-layout__header__fixed-button`)

### System zakładek
- **Participants** - zarządzanie uczestnikami [[recruitment-study-participants|→]]
- **Schedules** - harmonogramy wizyt [[recruitment-study-schedules|→]]
- **Payments** - płatności dla uczestników [[recruitment-study-payments|→]]
- **Settings** - ustawienia badania [[recruitment-study-settings|→]]

## Stan dynamiczny
- Nazwa study pochodzą z API (dynamiczne)
- Status study może być: Draft, Active, Completed, Archived (różne klasy CSS)
- Zawartość każdej zakładki zależy od danych study z backendu
- Przycisk "Add Participants" zawsze widoczny

## Nawigacja
- Powrót do [[recruitment-studies|Recruitment Studies]]
- Przejście do poszczególnych zakładek w obrębie tego study

## URL Pattern
- `/en/recruitment/[study-uuid]` - domyślnie otwiera zakładkę Participants
- `/en/recruitment/[study-uuid]?tab=schedules` - otwiera konkretną zakładkę
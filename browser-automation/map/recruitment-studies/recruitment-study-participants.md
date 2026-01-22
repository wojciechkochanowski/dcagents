# Recruitment Study - Participants Tab

## Lokalizacja w kodzie
- **UI components**: (klasy CSS znalezione na stronie)
  - `participants-dashboard-target` - widget celu rekrutacji
  - `participants-dashboard-kpis` - dashboard statusów uczestników
  - `ant-tabs-tabpane` - kontener zawartości zakładki
  - `ant-table` - tabela uczestników (Ant Design)
  - `ant-empty` - komponent pustego stanu

## Dostęp
- Z [[recruitment-study-details|szczegółów recruitment study]] → zakładka "Participants"

## Struktura zakładki

### Recruitment Target (lewy górny)
- **Klasa CSS**: `participants-dashboard-target`
- **Obecny progress**: Liczba recruited/target (dynamiczne z API)
- **Pasek postępu**: Wizualizacja progresu rekrutacji
- **Target %**: Procent osiągnięcia celu (obliczany)
- **Left**: Pozostała liczba do osiągnięcia celu z procentem

### Dashboard statusów uczestników
- **Klasa CSS**: `participants-dashboard-kpis`
- **Kolorowe kafelki z liczbami** (wszystkie liczby dynamiczne z API):
  - **PROSPECT** (niebieski) - potencjalni kandydaci
  - **CONTACTED** (niebieski) - skontaktowani
  - **INTERESTED** (zielony) - zainteresowani  
  - **QUALIFIED** (zielony) - zakwalifikowani
  - **ENROLLED** (zielony) - zapisani
  - **COMPLETED** (zielony) - ukończyli
  - **DISQUALIFIED** (czerwony) - zdyskwalifikowani
  - **NOT INTERESTED** (pomarańczowy) - niezainteresowani
  - **EXCLUDED** (żółty) - wykluczeni

### Tabela uczestników
**Kolumny:**
- **Checkbox** - selekcja uczestników
- **CONTACT DETAIL** - dane kontaktowe
- **STATUS** - aktualny status uczestnika
- **IN ANOTHER STUDY** - czy uczestniczy w innym badaniu
- **CENTER** - przypisane centrum
- **SOURCE** - źródło rekrutacji
- **LAST CONTACT** - data ostatniego kontaktu
- **APPLIED** - data aplikacji

### Funkcjonalności
- **Wyszukiwanie**: Ikona lupy dla filtrowania
- **Filtry**: Dodatkowe opcje filtrowania
- **Ustawienia**: Opcje wyświetlania
- **Stan pusty**: "No data" gdy brak uczestników
- **Paginacja**: "0-0 of 0" z opcjami stron

## Stan dynamiczny
- Wszystkie liczby w dashboard pochodzą z API calls (dynamiczne)
- Tabela wyświetla dane uczestników z backendu (może być pusta)
- Progress target obliczany na podstawie enrolled vs target number
- Stan pusty: komponent `ant-empty` z komunikatem "No data"

## Powiązania
- Powrót do [[recruitment-study-details|głównej strony study]]
- Przejście do innych zakładek tego samego study
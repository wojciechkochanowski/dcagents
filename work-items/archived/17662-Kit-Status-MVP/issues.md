# Issues & Problems - Kit Status MVP (17662)

## Problemy napotkane podczas implementacji

### Problem: Uproszczenie interfejsów komponentu StatusChangeDrawer
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: StatusChangeDrawer miał zbyt skomplikowane API props z dużą liczbą parametrów. Komponent wymagał osobno przekazywania selectedItems, isBulkMode, currentStatuses i loading state.
**Rozwiązanie**: Uproszczono API do dwóch głównych props:
- `selectedItemsIds: string[]` - tylko ID zamiast pełnych obiektów
- `knownItems: IpRecord[]` - pełne obiekty z kontekstu rodzica, filtrowane wewnętrznie
- usunięto `isBulkMode` (automatycznie wykrywane z `selectedItemsIds.length`)  
- usunięto `currentStatuses` (wykrywane z pierwszego elementu knownItems)
- usunięto `loading` state (nie był potrzebny w tym przypadku)
**Pliki zmienione**: 
- `StatusChangeDrawer.tsx` - uproszczony interface props
- `StudyRandomisationIpList.tsx` - przekazywanie selectedItemsIds zamiast pełnych obiektów
**Czas rozwiązania**: ~20 minut

### Problem: Nadmierne komentarze w utility functions
**Data**: 2025-08-14  
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: W pliku `statusTransitions.ts` były zbędne komentarze tłumaczące oczywiste rzeczy jak "niebieski", "czerwony" przy zmiennych kolorów oraz komentarze opisujące logikę która jest jasna z kodu.
**Rozwiązanie**: Usunięto wszystkie zbędne komentarze pozostawiając tylko kod. Zgodnie z zasadami projektu komentarze dodajemy tylko w wyjątkowych sytuacjach.
**Pliki zmienione**: 
- `statusTransitions.ts` - usunięto nadmiarowe komentarze
- `getStatusOptions()` - uproszczono do jednej strzałkowej funkcji
**Czas rozwiązania**: ~5 minut

### Problem: Niepotrzebne kompleksowe API w ipList.ts  
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: Funkcja `changeKitStatus` miała zbędny parametr `check` i nadmiarowe error handlery które nie były używane w frontendzie. Dodatkowo była duplikowana logika z `invalidIpRecords`.
**Rozwiązanie**: 
- Usunięto parametr `check` z interfejsu `ChangeKitStatusRequest`
- Usunięto nieużywane error handlery (`onKitNotExists`, `onInsufficientPermissions`)
- Usunięto całą funkcję `invalidIpRecords` - teraz wykorzystujemy `changeKitStatus` z `IpRecordStatus.Invalid`
- Uproszczono parseRemoteIpRecord dodając tymczasowe ID (TODO dla backendu)
**Pliki zmienione**: 
- `ipList.ts` - usunięto zbędne funkcje i parametry
**Czas rozwiązania**: ~15 minut

### Problem: Nadużywanie komponenty design system
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: W StatusChangeDrawer używano `DsInputRadio` opakowującego standardową `Radio.Group`, co dodawało zbędną kompleksność. Również używano nieistniejących klas CSS w LESS.
**Rozwiązanie**: 
- Zastąpiono `DsInputRadio` + `Radio.Group` bezpośrednio przez `Radio.Group`
- Zastąpiono nieistniejące klasy CSS (`@spacing-*`) przez prawidłowe (`@lg`, `@md`, `@xs`)
- Zastąpiono `body-md-medium()` przez `body-md()` 
- Dodano `DatacRecordStatusTag` do wyświetlania obecnego statusu w single mode
**Pliki zmienione**: 
- `StatusChangeDrawer.tsx` - uproszczono komponenty form
- `StatusChangeDrawer.less` - poprawiono nazwy klas CSS
**Czas rozwiązania**: ~10 minut

## Template do dodawania problemów:

### Problem: [Tytuł problemu]
**Data**: [YYYY-MM-DD]
**Sub-agent/Agent**: [który agent napotkał problem]
**Opis**: [szczegółowy opis problemu]
**Rozwiązanie**: [jak zostało rozwiązane]
**Pliki zmienione**: [lista plików które wymagały zmian]
**Czas rozwiązania**: [ile czasu zajęło]

---

### Problem: [Kolejny problem]
...

## Uwagi dla przyszłych implementacji

### Projektowanie komponentów React
- **Uprść API props** - przekazuj minimalną liczbę parametrów, preferuj przekazywanie ID zamiast pełnych obiektów gdy to możliwe
- **Automatyczne wykrywanie stanów** - zamiast przekazywać `isBulkMode` jako props, wykrywaj to z długości tablicy (`selectedIds.length > 1`)
- **Unikaj loading state** - jeśli operacja jest szybka lub nie blokuje UI, nie dodawaj zbędnego loading state
- **Używaj prostych form controls** - nie opakuj standardowych Ant Design komponentów jeśli nie jest to konieczne

### Utility functions i logika biznesowa
- **Nie komentuj oczywistych rzeczy** - komentarze typu "// niebieski" przy `@fg-brand-primary` są zbędne
- **Upraszczaj do arrow functions** - krótkie utility funkcje można zapisać jako one-liner arrow functions
- **Unikaj duplikacji logiki** - jeśli masz funkcję `changeKitStatus`, nie twórz osobnej `invalidIpRecords` która tylko wywołuje pierwszą

### API Design (Frontend request functions)
- **Minimalne parametry** - nie dodawaj parametrów które nie są używane (jak `check: boolean`)
- **Uproszczone error handling** - dodawaj tylko te error handlery które faktycznie obsługujesz w UI
- **Jednolite wzorce** - jeśli masz wzorzec dla jednego typu operacji, używaj go konsekwentnie dla podobnych

### CSS i stylowanie  
- **Używaj prawidłowych nazw klas** - sprawdzaj czy klasy CSS (`@spacing-*` vs `@lg`) faktycznie istnieją w design systemie
- **Używaj componentów design systemu świadomie** - `DatacRecordStatusTag` zamiast custom znaczników HTML dla statusów

### Restructura i przeprojektowanie komponentów (na podstawie doświadczeń z StatusChangeDrawer)
- **Hierarchiczne nazewnictwo CSS** - używaj pełnych nazw odzwierciedlających hierarchię komponentów (`component-parent-child-element`) zamiast generycznych (`status-change-drawer`)
- **Wykorzystuj istniejące komponenty design systemu** - przed tworzeniem custom styling sprawdź czy nie istnieje już komponent (np. `DatacRecordStatusTag` zamiast custom span z kolorami)
- **Flexbox dla layout** - nowoczesne drawer komponenty powinny używać flexbox z `flex: 1` dla main content i fixed sections dla header/footer
- **Pełna wysokość ekranu** - drawer komponenty często wymagają `calc(100vh - offset)` dla pełnej wysokości
- **Parametryzowane tłumaczenia** - używaj kluczy z parametrami `{number}` zamiast hardcoded stringów dla liczb
- **Hierarchia tłumaczeń** - preferuj `common.save` nad `save` dla często używanych tekstów

### Internationalization best practices
- **Singular/plural forms** - zawsze dodawaj obydwie formy (`selected_kit` i `selected_kits`)
- **Parametrized strings** - używaj `{number}` zamiast konkatenacji stringów
- **Hierarchical keys** - organizuj klucze w hierarchię (`common.button.save` lepsze niż `save`)
- **No hardcoded text** - każdy wyświetlany tekst musi przechodzić przez system tłumaczeń

---

### Problem: Kompletne przeprojektowanie struktury komponentu StatusChangeDrawer
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: Początkowa implementacja StatusChangeDrawer była zbyt generyczna i nie pasowała do konkretnego design systemu projektu. Wymagała kompletnego przeprojektowania według nowych standardów UI/UX.
**Rozwiązanie**: 
- **Zmiana nazewnictwa klas CSS** - z generycznego `status-change-drawer` na specyficzne `randomisation-settings-ip-list-status-change-drawer` zgodnie z BEM i hierarchią komponentów
- **Restructura layoutu** - usunięto wrapper `__content`, drawer bezpośrednio zawiera sekcje `__selected-kits`, `__form`, `__actions`
- **Nowy system spacing** - drawer używa teraz pełnej wysokości ekranu z `calc(100vh - 7rem)` i flexbox layout
- **Uproszczenie radio buttons** - usunięto custom rendering funkcję i style, zastąpiono bezpośrednim `DatacRecordStatusTag` w Radio.Group
- **Centrowanie i padding** - nowe podejście do paddingu i marginesów bardziej zgodne z design systemem
- **Zmiana szerokości** - stała szerokość `35rem` zamiast automatycznej
- **Border styling** - dodano `border-top` dla sekcji actions
- **Flex layout dla buttons** - przyciski teraz `flex: 1` dla równomiernego rozkładu
**Pliki zmienione**: 
- `StatusChangeDrawer.less` - kompletna przebudowa struktury CSS
- `StatusChangeDrawer.tsx` - uproszczenie JSX i usunięcie custom render funkcji
- `en.json` - dodanie klucza `more` dla "more items" i `selected_kit` dla single mode
**Czas rozwiązania**: ~45 minut

### Problem: Migrating od custom status labels do DatacRecordStatusTag
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany) 
**Opis**: Początkowe rozwiązanie używało custom span elementów z własnym kolorami CSS zamiast wykorzystać istniejący komponent `DatacRecordStatusTag` z design systemu.
**Rozwiązanie**: 
- Usunięto custom funkcję `renderStatusRadioOptions()` 
- Usunięto wszystkie custom CSS klasy dla statusów (`__status-option--available`, `__status-option--invalid` itp.)
- Zastąpiono inline map w JSX z `DatacRecordStatusTag` komponentem
- Uprościło to kod i zapewniło spójność z resztą aplikacji
**Dlaczego lepsze**: `DatacRecordStatusTag` jest standardowym komponentem używanym w całej aplikacji, ma już wszystkie style i kolory statusów, automatycznie obsługuje internationalization
**Pliki zmienione**:
- `StatusChangeDrawer.tsx` - usunięto custom render funkcję
- `StatusChangeDrawer.less` - usunięto custom CSS classes dla statusów
**Czas rozwiązania**: ~15 minut

### Problem: Internationalization improvements
**Data**: 2025-08-14
**Agent**: Użytkownik (niezakomitowane zmiany)
**Opis**: Brak odpowiednich kluczy tłumaczeń dla niektórych elementów UI oraz użycie hardcoded stringów.
**Rozwiązanie**:
- Dodano klucz `selected_kit` (singular) obok `selected_kits` (plural) dla lepszej gramatyki
- Dodano klucz `more` z parametrem `{number}` dla wyświetlania "+ X more" zamiast hardcoded string
- Zmieniono `intl('save')` i `intl('cancel')` na `intl('common.save')` i `intl('common.cancel')` dla lepszej hierarchii
**Dlaczego ważne**: Proper internationalization oznacza że każdy string może być przetłumaczony, a parametryzowane klucze pozwalają na lepszą gramatykę w różnych językach
**Pliki zmienione**:
- `en.json` - dodanie nowych kluczy
- `StatusChangeDrawer.tsx` - użycie parametryzowanych kluczy
**Czas rozwiązania**: ~10 minut
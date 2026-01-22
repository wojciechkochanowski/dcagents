# Todo List - 17736 EDC buttons - new design in a few places

## Etap 1: Przygotowanie (15 min)
- [ ] Przeanalizować `common/components/FiltersDropdown/FiltersDropdown.tsx`
- [ ] Sprawdzić jak obecnie są zaimplementowane style
- [ ] Zidentyfikować button "Add centers" w Study Settings

## Etap 2: Implementacja nowego designu buttonów (45 min)

### 2.1 Aktualizacja FiltersDropdown komponentu
- [ ] Zaktualizować `common/components/FiltersDropdown/FiltersDropdown.tsx`
- [ ] Usunąć ikonę filtra z buttona
- [ ] Zastosować nowy design z primary blue background
- [ ] Poprawić spacing i typography zgodnie z design systemem

### 2.2 Aktualizacja "Add centers" button
- [ ] Znaleźć komponent Study Settings → Centers
- [ ] Zaktualizować button "Add centers" do nowego designu
- [ ] Upewnić się że pasuje do FiltersDropdown stylu

## Etap 3: Weryfikacja i testy (30 min)

### 3.1 Sprawdzenie wszystkich 4 miejsc
- [ ] eConsent Forms - button "Filters"
- [ ] Audit trails - button "Filters"
- [ ] Manage users - button "Filters"
- [ ] Study Settings → Centers - buttony "Filters" i "Add centers"

### 3.2 Testy funkcjonalności
- [ ] Sprawdzić czy buttony nadal działają poprawnie
- [ ] Przetestować hover states i interakcje
- [ ] Upewnić się że nie zepsuły się inne funkcjonalności

## Etap 4: Quality checks (15 min)
- [ ] Wykonać instrukcje z pliku `~/work/datacapt/.claude/commands/fast-check.md`
- [ ] Wykonać instrukcje z pliku `~/work/datacapt/instructions/lint.md`
- [ ] Uruchomić tsc, eslint, prettier zgodnie z procedurami

## Etap 5: Finalizacja (10 min)
- [ ] Uruchomić ponownie `~/work/llm/workitem-tool/workitem-tool`
- [ ] Upewnić się że wszystkie wymagania zostały spełnione
- [ ] Nanieść ewentualne poprawki jeśli coś zostało pominięte
- [ ] Sprawdzić requirements.md - czy o niczym nie zapomniano
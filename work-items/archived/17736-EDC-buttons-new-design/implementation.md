# Plan implementacji: 17736 - EDC buttons - new design in a few places

## PLAN IMPLEMENTACJI DLA GŁÓWNEGO AGENTA

### Etap 1: Przygotowanie (15 min)
1. **Sprawdzenie aktualnego stanu komponentów**
   - Przeanalizuj `common/components/FiltersDropdown/FiltersDropdown.tsx`
   - Sprawdź jak obecnie są zaimplementowane style
   - Zidentyfikuj button "Add centers" w Study Settings

### Etap 2: Implementacja nowego designu buttonów (45 min)

#### 2.1 Aktualizacja FiltersDropdown komponentu
- Zaktualizuj `common/components/FiltersDropdown/FiltersDropdown.tsx` 
- Usuń ikonę filtra z buttona
- Zastosuj nowy design z primary blue background
- Popraw spacing i typography zgodnie z design systemem
- **Ta zmiana automatycznie zaktualizuje 3 miejsca:** eConsent Forms, Audit trails, Manage users

#### 2.2 Aktualizacja "Add centers" button
- Znajdź komponent Study Settings → Centers 
- Zaktualizuj button "Add centers" do nowego designu
- Upewnij się że pasuje do FiltersDropdown stylu

### Etap 3: Weryfikacja i testy (30 min)

#### 3.1 Sprawdzenie wszystkich 4 miejsc
- eConsent Forms - button "Filters"
- Audit trails - button "Filters" 
- Manage users - button "Filters"
- Study Settings → Centers - buttony "Filters" i "Add centers"

#### 3.2 Testy funkcjonalności
- Sprawdź czy buttony nadal działają poprawnie
- Przetestuj hover states i interakcje
- Upewnij się że nie zepsuły się inne funkcjonalności

### Etap 4: Quality checks (15 min)

#### 4.1 Fast-check flow
- Wykonaj instrukcje z pliku `~/work/datacapt/.claude/commands/fast-check.md`
- Agent musi sam sprawdzić ten plik i wykonać procedury

#### 4.2 Lint flow 
- Wykonaj instrukcje z pliku `~/work/datacapt/instructions/lint.md`
- Agent musi sam sprawdzić ten plik i wykonać procedury
- Uruchom tsc, eslint, prettier zgodnie z procedurami

### Etap 5: Finalizacja (10 min)

#### 5.1 Sprawdzenie AC
- Uruchom ponownie `~/work/llm/workitem-tool/workitem-tool`
- Upewnij się że wszystkie wymagania zostały spełnione

#### 5.2 Poprawki (jeśli potrzebne)
- Nanieś ewentualne poprawki jeśli coś zostało pominięte

## Dodatkowe uwagi

### Dlaczego bez sub-agentów:
1. **Prostota zadania** - to głównie zmiana stylu w 1-2 komponentach
2. **Centralizacja** - jedna zmiana wpływa na 3 z 4 miejsc
3. **Spójność** - lepiej gdy jedna osoba zadba o konsystentny design
4. **Speed** - szybsze niż koordynacja między agentami
5. **Risk** - mniejsze ryzyko niespójności między zmianami

**Szacowany czas realizacji:** 115 minut (2 godziny)
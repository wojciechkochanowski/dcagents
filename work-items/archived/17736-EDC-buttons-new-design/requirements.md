# 17736 - EDC buttons - new design in a few places

## Acceptance Criteria

**Zadanie:** 17736: EDC buttons - new design in a few places

**Opis:** Aktualizacja designu buttonów w następujących miejscach:
- Study Centers
- Study Users  
- Audit trails
- eConsent forms

**Link do Figmy:** https://www.figma.com/design/XVHrCMnRJRMvF9CRfQPNiG/Design-System?node-id=1215-2912&t=mbl52QFMz1VklvNj-4

## Analiza problemów

### Obecny stan (nieprawidłowy):
- Wszystkie buttony "Filters" mają stary design z ikoną filtra
- Button "Add centers" w Study Settings ma nieodpowiedni styl
- Buttony nie pasują do nowego design systemu

### Docelowy stan (z Figmy):
- Nowoczesne button bez tła (typ outline) 
- Kompaktowy, clean design
- Odpowiedni spacing i typography zgodny z design systemem

### Lokalizacja problemów:
1. **eConsent Forms** - button "Filters" 
2. **Audit trails** - button "Filters"
3. **Manage users** - button "Filters" 
4. **Study Settings → Centers** - buttony "Filters" i "Add centers"

## Analiza techniczna

### Kluczowe ustalenia z analizy kodu:
- Wszystkie buttony "Filters" używają tego samego komponentu `FiltersDropdown`
- Button "Add centers" używa standardowego `DatacButton`
- **JEDNA centralna zmiana** w `FiltersDropdown` zaktualizuje 3 z 4 miejsc jednocześnie
- Komponenty znajdują się w `common/components/FiltersDropdown/`

### Decyzja architektoniczna:
**NIE używamy sub-agentów** - zadanie jest zbyt proste i skoncentrowane. Bardziej efektywne będzie wykonanie przez jednego developera.

### Kluczowe pliki do modyfikacji:
- `common/components/FiltersDropdown/FiltersDropdown.tsx`
- Komponent Study Settings → Centers (do znalezienia)
- Ewentualne pliki stylów (.less)

### Ważne zasady:
- Kod po angielsku, komentarze po angielsku
- Minimalistyczne podejście do komentarzy
- Używamy pnpm, nie npm
- Pracuj w katalogu `/Users/bartek/work/datacapt/frontend/`
- Do plików tłumaczeń dodaj tylko angielską wersję
- Nie dodawaj testów do repo
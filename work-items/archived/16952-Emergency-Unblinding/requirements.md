# 16952 Emergency Unblinding

## Opis zadania
**As a** user with unblinding permissions,
**I want** to be able to unblind a participant treatment allocation in case of an emergency,
**So that** I can make informed medical decisions based on the subject's actual treatment group.

## Acceptance Criteria

### AC1: Display Unblinding Option
✅ Użytkownik z odpowiednimi uprawnieniami widzi opcję "Unblind" w menu randomisation button

### AC2: Prompt for Reason and Authentication  
✅ Po wybraniu unblind: modal z informacją + pole na hasło + przycisk "Unblind subject"

### AC3: Display Treatment Group
✅ Po weryfikacji: ujawnienie grupy terapeutycznej dla wszystkich z uprawnieniami + wyświetlanie w allocation/randomization widget i modal

### AC4: Audit Trail Logging
✅ Logowanie zdarzenia: WHO, WHEN, WHERE, IP, Kit Number, Reason (bez wyświetlania grupy w audit trail)

## Analiza designu Figma

### Modal "Unblind subject"
- **Tytuł**: "Unblind subject" 
- **Informacja**: Niebieskie info box z tekstem o emergency unblinding i wymogu hasła
- **Pole hasła**: "Enter your password" z przyciskiem "Show"
- **Przyciski**: "Cancel" (biały) + "Unblind subject" (niebieski)

### Dropdown menu opcja  
- **Ikona**: eye-off (czerwona)
- **Tekst**: "Unblind"
- **Kolor tekstu**: #060a32

### Toast po sukcesie
- **Tytuł**: "Participant Unblinded"
- **Tekst**: "Every user with the appropriate permission will now see the Randomization Treatment Group."
- **Kolor**: zielony (#1bcfa9)
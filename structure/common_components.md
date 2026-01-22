# Komponenty Frontend Datacapt - Przegląd

## Struktura komponentów

Frontend aplikacji Datacapt zawiera **71 komponentów** podzielonych na dwie kategorie:

### 1. Komponenty Datacapt (67 komponentów)

Komponenty z prefiksem `Datac` - główne komponenty UI aplikacji klinicznej.

### 2. Komponenty Design System (4 komponenty)

Komponenty z prefiksem `Ds` - nowoczesny system designu w fazie wprowadzania.

## Konwencje nazewnictwa

- **DatacXxx** - Legacy komponenty aplikacji
- **DsXxx** - Nowe komponenty design system
- Każdy komponent ma strukturę:
  - `index.tsx` - eksport główny
  - `ComponentName.tsx` - implementacja
  - Podkatalogi dla subkomponentów

## Katalogi funkcjonalne

### UI Controls & Input

- DatacButton, DatacSwitch, DatacSelect
- DsInput, DsInputText, DsInputNumber, etc.
- DatacDigitsInput, DatacPhoneInput, DatacColorPicker

### Data Display

- DatacTable, DatacPagination, DatacStatistic
- DatacCard, DatacBox, DatacTabs
- DatacAvatar, DatacIcon, DatacBadge (Ds)

### Form Components

- DatacFormItem, DsFormItem
- DatacValidationMessage, DsFormItemMessage
- DatacFileUpload, DatacImageUpload, DsUpload

### Navigation & Layout

- DatacSidebar, DatacDrawer, DatacModal
- DatacTabs, DatacDropdownMenu
- DatacPageTitle, DatacTitle, DatacSubtitle

### Specialized Components

- DatacMap, DatacQrCodes, DatacMessage
- DatacAdvancedFilters, DatacFilters
- DatacDistribution, DatacLanguageSelector

### Status & Feedback

- DatacStatusTag, DatacStudyStatusTag, DatacRecordStatusTag
- DatacLoading, DatacErrorPage, DatacInformationMessage
- DatacTooltip, DatacInstructionTooltip

## Migration Status

Komponenty `Ds*` to nowy design system. Stopniowa migracja z `Datac*` do `Ds*`.

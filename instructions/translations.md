# Translation Files Management

## Location

All translation files are located in `~/work/datacapt/frontend/common/intl/`

## File Structure

```
common/intl/
├── en.json     # Source of truth - PRIMARY LANGUAGE
├── pl.json     # Polish
├── fr.json     # French (special case - copies English text)
├── de.json     # German
├── es.json     # Spanish
├── it.json     # Italian
├── ja.json     # Japanese
├── pt.json     # Portuguese
└── zh.json     # Chinese
```

## Developer Rules

### Adding New Translations

**CRITICAL**: Only add to `en.json` - other languages handled by `/translate` command

**US English spelling**: Use American spellings (randomization, customization, organize) not British (randomisation, customisation, organise)

**No hardcoded text** - always use translation system in React components

### Usage in React Components

```tsx
import { useScopedIntl } from "common/hooks";

const Component = () => {
  const intlSomething = useScopedIntl("xxx.yyy.zzz.something");
  const intl = useScopedIntl();

  return (
    <div>
      <div>{intlSomething("text")}</div>
      <div>{intl("common.common_text")}</div>
    </div>
  );
};
```

### Key Structure Convention

Use hierarchical dot notation: `"module.section.element.type"`

## Language-Specific Rules

### French (fr.json) - SPECIAL CASE

**French copies English text exactly** - external translator handles French conversion

### Medical/Clinical Terminology

#### Polish Clinical Terms:

- "subject" → "badany" (study participant, NOT "temat")
- "study" → "badanie" (clinical study/trial)
- "investigator" → "badacz"
- "site" → "ośrodek"
- "visit" → "wizyta"
- "form" → "formularz"
- "consent" → "zgoda"

#### German Clinical Terms:

- "subject/subjects" → "Proband/Probanden" (study participants)
- "randomization/randomisation" → "Randomisierung" (both US/UK spellings)

**AVOID German mistranslations:**

- ❌ "subject" → "Betreff" (email subject)
- ❌ "subject" → "Thema" (topic)
- ✅ "subject" → "Proband" (study participant)

## Technical Requirements

### Variable Preservation

Keep `{variable}` placeholders EXACTLY as in English:

```json
"message": "Welcome {userName} to study {studyName}"
```

### JSON Escaping

Use `\"` for quotes inside strings:

```json
"confirmation": "Delete \"{itemName}\"?"
```

### Complex UI Patterns

Support flattened nested objects with dynamic keys:

```json
"delete_confirmation.{mode}.title": "Delete Item Type",
"delete_confirmation.{mode}.message": "Are you sure you want to delete \"{label}\"?",
"delete_confirmation.warning.dummy": "This type is used in {count} dummy items.",
"delete_confirmation.error.production": "Cannot delete - type is used in production."
```

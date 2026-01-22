# AI Improvements - Plan Prac

## Przegląd

Lista ulepszeń dla funkcji AI Chat/Copilot w Datacapt. Zmiany obejmują frontend i backend.

---

## 1. UI Modal - Modernizacja i Rebranding ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Frontend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Tytuł drawera zmieniony na "Datacapt Copilot"
- Tłumaczenia zaktualizowane (EN)

**Pliki zmodyfikowane:**

- `frontend/common/intl/en.json` - zmieniono `studies.builder.chat.toggle`, `studies.inclusions.chat.toggle`, `studies.monitoring.queries.chat.toggle`

**Pozostałe zadania:**

- [x] Zmienić tytuł drawera na "Datacapt Copilot"
- [ ] **Uruchomić `/translate` dla pozostałych języków (FR, PL, DE, ES, IT, PT, JA, ZH)**

---

## 2. Ikona AI - Widoczność i Kolor ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Frontend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Button zmieniony na `type="primary"` (niebieski)
- Ikona zmieniona na `sparkle-01` (bez tekstu)
- Dodano `shape="rounded"` (okrągły)
- Dodano `box-shadow: @shadow-lg` i hover state `@shadow-xl`
- Usunięto białe tło

**Pliki zmodyfikowane:**

- `frontend/apps/datacapt/src/components/shared/Builder/Builder.tsx`
- `frontend/apps/datacapt/src/components/shared/Builder/Builder.less`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/Inclusions.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/Inclusions.less`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyMonitoringContent/StudyMonitoringQueries/StudyMonitoringQueries.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyMonitoringContent/StudyMonitoringQueries/StudyMonitoringQueries.less`

**Zadania:**

- [x] Zmienić `background-color` na niebieski (via type="primary")
- [x] Usunąć tekst, zostawić tylko ikonę AI (`sparkle-01`)
- [x] Dodać `shape="rounded"` (okrągły)
- [x] Dodać `box-shadow` dla widoczności
- [x] Dodać hover state

---

## 3. Historia Konwersacji (Tematy) ⏸️ POMINIĘTE

**Priorytet:** Niski (LESS URGENT)
**Zakres:** Frontend + Backend
**Status:** ⏸️ POMINIĘTE (zgodnie z planem - "na razie bez historii")

---

## 4. Data Validation Query Message Generator ✅ DONE

**Priorytet:** Średni
**Zakres:** Frontend + Backend
**Status:** ✅ ZROBIONE

**Backend - DONE:**

- Utworzono endpoint `POST /studies/<study_uuid>/ai/validation-query-message/`
- Utworzono API request function `generateValidationQueryMessage`
- Dodano testy jednostkowe `test_ai_views.py`

**Pliki utworzone/zmodyfikowane (Backend):**

- `backend/datacapt_backend/studies/views/ai.py` - dodano `ValidationQueryMessageView`
- `backend/datacapt_backend/studies/urls/studies.py` - dodano URL route
- `backend/datacapt_backend/studies/tests/test_views/test_ai_views.py` - testy

**Frontend - DONE:**

- Dodano przycisk AI `sparkle-01` do pola message w `ValidationCommonFields`
- Używa `BuilderContext.study.id` dla studyId
- Przekazuje `ruleContext` z formularza (operator, value, fieldName, fieldType, messageType, operatorArgs)
- Loader animation podczas generowania

**Pliki zmodyfikowane (Frontend):**

- `frontend/common/requests/studies/studyAi.ts` - API request function
- `frontend/apps/datacapt/src/components/shared/Builder/QuestionBuilder/ValidationFields/ValidationFields.tsx` - główna logika
- `frontend/apps/datacapt/src/components/shared/Builder/QuestionBuilder/ValidationFields/NumberFields/NumberFields.tsx` - przekazanie ruleContext
- `frontend/apps/datacapt/src/components/shared/Builder/QuestionBuilder/ValidationFields/RadioFields/RadioFields.tsx` - przekazanie ruleContext
- `frontend/apps/datacapt/src/components/shared/Builder/QuestionBuilder/ValidationFields/DateTimeFields/DateTimeFields.tsx` - przekazanie ruleContext + operatorArgs
- `frontend/apps/datacapt/src/components/shared/Builder/QuestionBuilder/ValidationFields/ValidationFields.less` - style dla ai-icon

**Zadania:**

- [x] Backend endpoint
- [x] Frontend API request
- [x] Frontend UI przycisk
- [x] Testy backendowe

---

## 5. Tool Calls Dropdown (Collapsible Analysis) ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Frontend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Dodano stan `isToolsExpanded` (domyślnie false)
- Loading header z klikanym obszarem
- Spinner + tekst "Thinking..." + chevron (gdy są pending tools)
- Po rozwinięciu: lista tool badges
- Animacja spinner (CSS keyframes)

**Pliki zmodyfikowane:**

- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.tsx`
- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.less`

**Zadania:**

- [x] Dodać stan `isToolsExpanded` (domyślnie false)
- [x] Utworzyć collapsible wrapper z chevronem
- [x] Domyślnie: "Thinking..." + spinner + chevron down
- [x] Po rozwinięciu: lista tool calls + chevron up
- [x] Animacja spinner

---

## 6. Ikona Minimize (Redukcja Chatu) ✅ DONE

**Priorytet:** Średni
**Zakres:** Frontend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Dodano prop `closable` do `DatacDrawer`
- Wszystkie chat drawery używają `closable={false}` (bez X w headerze)
- Dodano prop `onMinimize` do `DatacChat` i wszystkich wrapper components
- Dodano przycisk minimize (czarne kółko z chevron-down) w prawym dolnym rogu chatu
- Style: `@bg-primary-solid` background, `@fg-white` kolor ikony, `@shadow-lg` cień

**Pliki zmodyfikowane:**

- `frontend/common/components/DatacDrawer/DatacDrawer.tsx` - dodano prop `closable`
- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.tsx` - dodano przycisk minimize
- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.less` - style dla minimize button
- `frontend/apps/datacapt/src/components/shared/Builder/Builder.tsx` - `closable={false}`, `onMinimize`
- `frontend/apps/datacapt/src/components/shared/Builder/BuilderChat/BuilderChat.tsx` - prop `onMinimize`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/Inclusions.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/InclusionsChat.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyMonitoringContent/StudyMonitoringQueries/StudyMonitoringQueries.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyMonitoringContent/StudyMonitoringQueries/QueriesChat.tsx`

**Zadania:**

- [x] Usunąć domyślny X z `DatacDrawer` (prop `closable={false}`)
- [x] Dodać przycisk chevron w `DatacChat` - position absolute, bottom right
- [x] Styl: czarne kółko, biały chevron down, border-radius full
- [x] onClick = zamknięcie drawera (minimize)

---

## 7. AI Disclaimer ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Frontend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Dodano prop `disclaimer` do `DatacChatTranslations` interface
- Dodano `<div className="datac-chat__disclaimer">` na końcu komponentu
- Style: `@body-xs-font-size`, `@fg-quaternary`, centered
- Tłumaczenia dodane dla EN

**Pliki zmodyfikowane:**

- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.tsx`
- `frontend/apps/datacapt/src/components/shared/Chat/DatacChat.less`
- `frontend/apps/datacapt/src/components/shared/Builder/BuilderChat/BuilderChat.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/InclusionsChat.tsx`
- `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyMonitoringContent/StudyMonitoringQueries/QueriesChat.tsx`
- `frontend/common/intl/en.json`

**Pozostałe zadania:**

- [x] Dodać disclaimer div
- [x] Dodać style
- [x] Dodać tłumaczenie EN
- [ ] **Uruchomić `/translate` dla pozostałych języków**

---

## 8. Bug: Date Rules Not Working ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Backend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Poprawiono opisy parametrów w tool definitions (add_validation_rule.py, edit_validation_rule.py)
- Dodano jasne instrukcje dla `validation_type="LINKED"` przy porównywaniu dat
- Dodano format `value={"question_id": <id>}` dla compare date
- Dodano wymagany format `operator_args={"period_amount": <n>, "period_type": "YEARS"|"MONTHS"|"DAYS"|...}`
- Dodano sekcję "Date Validation Rules" do `STUDY_CHAT_BASE_RULES` z przykładami

**Pliki zmodyfikowane:**

- `backend/datacapt_backend/chat/tools/study/add_validation_rule.py`
- `backend/datacapt_backend/chat/tools/study/edit_validation_rule.py`
- `backend/datacapt_backend/chat/prompts/study_chat.py`

**Pliki z testami:**

- `backend/datacapt_backend/chat/tests/test_tools_study.py` - testy `TestAddValidationRuleTool`, `TestEditValidationRuleTool`

**Zadania:**

- [x] Zdiagnozować problem z compare date
- [x] Sprawdzić logikę period time/type
- [x] Naprawić (poprawione opisy i prompty)
- [x] Dodać testy jednostkowe

---

## 9. Populate Study (Test Data Generator) ❌ NOT DONE

**Priorytet:** Średni
**Zakres:** Backend
**Status:** ❌ NIE ZROBIONE

**Zadania do wykonania:**

- [ ] Utworzyć tool `create_test_patients` (domyślnie 10, parametr count)
- [ ] Utworzyć tool `fill_ecrf_forms` (wypełnia formularze dla pacjentów)
- [ ] Utworzyć tool `create_test_queries` (tworzy queries z odpowiedziami)
- [ ] Walidacja że study jest DRAFT
- [ ] Zarejestrować tools w registry dla INCLUSIONS context
- [ ] **Dodać testy jednostkowe**

---

## 10. Base Prompt dla Wszystkich Studiów ✅ DONE

**Priorytet:** Wysoki
**Zakres:** Backend
**Status:** ✅ ZROBIONE

**Zmiany wprowadzone:**

- Utworzono `STUDY_CHAT_BASE_RULES` constant z:
  - Terminologia (Section=Visit, Subsection=Form, Conditional Logic=Conditional Visibility, Data Validation=Edit Checks)
  - CDISC CDASH variable naming rules
  - Options configuration (label=text, value=integer only)
  - Confirmation-first protocol
  - Date Validation Rules z przykładami

**Pliki zmodyfikowane:**

- `backend/datacapt_backend/chat/prompts/study_chat.py` - dodano `STUDY_CHAT_BASE_RULES`
- `backend/datacapt_backend/chat/prompts/__init__.py` - eksport
- `backend/datacapt_backend/chat/context.py` - integracja z system prompt dla STUDY context

**Pliki z testami:**

- `backend/datacapt_backend/chat/tests/test_prompts.py` - testy `TestStudyChatBaseRules`

**Zadania:**

- [x] Dodać base prompt do `study_chat.py`
- [x] Zintegrować z system prompt builder
- [x] Upewnić się że prompt jest używany dla wszystkich studiów
- [x] Dodać testy jednostkowe

---

## Podsumowanie Statusu

| #   | Zadanie             | Status       | Testy BE | Tłumaczenia |
| --- | ------------------- | ------------ | -------- | ----------- |
| 1   | UI Modal            | ✅ DONE      | N/A      | ⚠️ tylko EN |
| 2   | Ikona AI            | ✅ DONE      | N/A      | N/A         |
| 3   | Historia            | ⏸️ POMINIĘTE | -        | -           |
| 4   | Query Generator     | ✅ DONE      | ✅ DONE  | N/A         |
| 5   | Tool Calls Dropdown | ✅ DONE      | N/A      | N/A         |
| 6   | Minimize Icon       | ✅ DONE      | N/A      | N/A         |
| 7   | Disclaimer          | ✅ DONE      | N/A      | ⚠️ tylko EN |
| 8   | Date Rules Bug      | ✅ DONE      | ✅ DONE  | N/A         |
| 9   | Populate Study      | ❌ NOT DONE  | -        | N/A         |
| 10  | Base Prompt         | ✅ DONE      | ✅ DONE  | N/A         |

---

## Pozostałe Zadania

### Frontend

1. **Tłumaczenia** - uruchomić `/translate` dla:
   - `studies.builder.chat.toggle` (zmienione na "Datacapt Copilot")
   - `studies.inclusions.chat.toggle`
   - `studies.monitoring.queries.chat.toggle`
   - `studies.builder.chat.disclaimer`
   - `studies.inclusions.chat.disclaimer`
   - `studies.monitoring.queries.chat.disclaimer`

### Backend

1. **#9 Populate Study** - cała implementacja:
   - `create_test_patients` tool
   - `fill_ecrf_forms` tool
   - `create_test_queries` tool
   - Rejestracja w INCLUSIONS context
   - Testy jednostkowe

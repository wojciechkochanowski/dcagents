# AI Chat POC - Task List

**NOTE**: Backend modification is an exception to normal rules for this POC task.

## Phase 1: Backend API (manual in ../backend)

### Task 1.1: LLM Service Setup

- [x] Create `backend/datacapt_backend/chat/` app directory
- [x] Create `__init__.py` and `apps.py`
- [x] Implement `services/llm.py` with LiteLLM wrapper
- [x] Create `tasks.py` with Celery chat completion task
- [x] Create `views.py` with StartChatView and ChatStatusView
- [x] Create `urls.py` with routes

### Task 1.2: Settings & Dependencies

- [x] Add `litellm` to `backend/Pipfile`
- [x] Add `LLM_MODEL` setting to `backend/config/settings/base.py`
- [x] Add `datacapt_backend.chat` to INSTALLED_APPS
- [x] Include chat urls in `backend/config/urls.py`

## Phase 2: Frontend API & Component (Sequential execution)

### Task 2.1: API Requests (api-requests-manager)

- [x] Create `common/requests/chat/` directory
- [x] Implement `startChat.ts` with response handlers pattern
- [x] Implement `getChatStatus.ts` with response handlers pattern
- [x] Create `index.ts` with exports

### Task 2.2-2.3: Chat Widget (react-component-creator)

- [x] Create `BuilderChat/` directory in `apps/datacapt/src/components/shared/Builder/`
- [x] Implement `BuilderChat.tsx` component with TypeScript interfaces
- [x] Implement `useChatPolling.ts` hook with timeout and cancellation
- [x] Style with `BuilderChat.less` using design system variables
- [x] Create `index.ts` with exports

## Phase 3: Integration (main agent)

### Task 3.1: Builder Integration

- [x] Add chat panel state to Builder.tsx
- [x] Add toggle button (DatacButton with icon)
- [x] Render BuilderChat as side panel
- [x] Pass structure and sectionId from BuilderContext

### Task 3.2: Styles

- [x] Add chat panel styles to Builder.less
- [x] Review with less-style-reviewer if needed

### Task 3.3: Translations

- [x] Add translation keys to `common/intl/en.json` only
- [ ] Run `/translate` command for other languages

## Validation

- [ ] Test backend endpoints manually (curl/Postman)
- [ ] Test full flow with Gemini Flash
- [ ] Test timeout handling (60s limit)
- [ ] Test cancellation on component unmount
- [ ] Test error scenarios
- [ ] Verify no UI blocking during polling

# AI Chat POC - Builder Assistant

## Task Description

Proof of Concept for AI-powered chat assistant in the Form Builder. Users can ask questions about the current form structure, questions, and logic. The system provides contextual answers based on the builder's current state.

## Acceptance Criteria

1. Chat widget in Builder UI
2. User can type questions about current form structure
3. System passes builder context (structure, questions, logic) to LLM
4. Responses displayed in chat interface
5. Support for Gemini Flash with easy switch to ChatGPT
6. No blocking of main UI during LLM processing

## Technical Requirements

### Backend

- **Endpoint**: `POST /api/chat/start` - initiates chat task
- **Endpoint**: `GET /api/chat/status/{task_id}` - polling for response
- **Celery Task**: Async LLM completion
- **LiteLLM**: Universal LLM wrapper for provider switching
- **Config**: `LLM_MODEL` env variable (default: `gemini/gemini-1.5-flash`)

### Frontend

- **Location**: `apps/datacapt/src/components/shared/Builder/`
- **Component**: `BuilderChat` - chat widget with input and message history
- **Hook**: `useChatPolling` - handles task creation and status polling
- **Context**: Extract from `BuilderContext` - structure, questions, subsections

### Data Flow

```
User Input → Frontend adds context → POST /chat/start → Celery Task
                                                            ↓
                                                       LiteLLM → LLM API
                                                            ↓
Frontend ← GET /chat/status (polling) ← Task Result ←──────┘
```

## Interfaces

### Request: Start Chat

```typescript
interface StartChatRequest {
  message: string;
  context: {
    structure: BuilderStructure;
    questions: BuilderQuestion[];
    currentSection?: string;
    currentSubsection?: string;
  };
}
```

### Response: Start Chat

```typescript
interface StartChatResponse {
  taskId: string;
}
```

### Response: Chat Status

```typescript
interface ChatStatusResponse {
  status: "pending" | "done" | "error";
  response?: string;
  error?: string;
}
```

## Dependencies

- Backend: `litellm`, `celery` (existing)
- Frontend: No new dependencies

## Out of Scope

- Chat history persistence
- Multiple conversations
- File/image uploads
- Streaming responses (polling only for POC)
- Authentication for LLM (uses backend-stored keys)

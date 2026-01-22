# Implementation Plan - AI Chat POC

## Overview

3 phases: Backend API → Frontend (API + Component) → Integration

**NOTE**: Backend modification is an exception to normal rules for this POC task.

---

## Phase 1: Backend API (manual implementation in ../backend)

### Task 1.1: LLM Service Setup

**Location**: `backend/datacapt_backend/chat/` (new app)

**Files to create**:

- `__init__.py`
- `apps.py` - Django app config
- `services/llm.py` - LiteLLM wrapper
- `tasks.py` - Celery task for chat completion
- `views.py` - API endpoints
- `urls.py` - URL routing

**Implementation**:

```python
# services/llm.py
from litellm import completion
from django.conf import settings

def chat_completion(messages: list[dict]) -> str:
    response = completion(
        model=settings.LLM_MODEL,
        messages=messages
    )
    return response.choices[0].message.content
```

```python
# tasks.py
from celery import shared_task
from .services.llm import chat_completion

@shared_task
def chat_completion_task(message: str, context: dict) -> str:
    system_prompt = build_system_prompt(context)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]
    return chat_completion(messages)

def build_system_prompt(context: dict) -> str:
    return f"""You are a helpful assistant for a clinical trial form builder.
Current form structure:
{context.get('structure', 'No structure provided')}

Answer questions about this form structure, suggest improvements, or explain existing logic."""
```

```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from celery.result import AsyncResult
from .tasks import chat_completion_task

class StartChatView(APIView):
    def post(self, request):
        message = request.data.get('message')
        context = request.data.get('context', {})
        task = chat_completion_task.delay(message, context)
        return Response({'task_id': task.id})

class ChatStatusView(APIView):
    def get(self, request, task_id):
        result = AsyncResult(task_id)
        if result.ready():
            if result.successful():
                return Response({'status': 'done', 'response': result.get()})
            return Response({'status': 'error', 'error': str(result.result)})
        return Response({'status': 'pending'})
```

```python
# urls.py
from django.urls import path
from .views import StartChatView, ChatStatusView

urlpatterns = [
    path('start', StartChatView.as_view(), name='chat-start'),
    path('status/<str:task_id>', ChatStatusView.as_view(), name='chat-status'),
]
```

### Task 1.2: Settings & Dependencies

**Files to modify**:

- `backend/config/settings/base.py` - add LLM_MODEL setting and INSTALLED_APPS
- `backend/requirements/base.txt` - add litellm
- `backend/config/urls.py` - include chat urls

**Settings**:

```python
# base.py
INSTALLED_APPS = [
    ...
    'datacapt_backend.chat',
]

LLM_MODEL = env("LLM_MODEL", default="gemini/gemini-1.5-flash")
```

**URLs**:

```python
# config/urls.py
urlpatterns = [
    ...
    path('api/chat/', include('datacapt_backend.chat.urls')),
]
```

**Requirements**:

```
litellm>=1.0.0
```

---

## Phase 2: Frontend API & Component (Sequential execution)

### Task 2.1: API Requests (api-requests-manager)

**Location**: `common/requests/chat/` (new directory)

**Files to create**:

- `index.ts` - exports
- `startChat.ts` - POST /chat/start
- `getChatStatus.ts` - GET /chat/status/{taskId}

**Implementation** (following project patterns):

```typescript
// common/requests/chat/startChat.ts
import { createErrorsHandlers } from "../../utils";
import { fetchApi } from "../fetchApi";

export interface ChatContext {
  structure: Structure;
  currentSectionId?: string;
  currentSubsectionId?: string;
}

export interface StartChatPayload {
  message: string;
  context: ChatContext;
}

export interface StartChatResponseHandlers {
  onSuccess?: (data: { taskId: string }) => void;
  onError?: (error: string) => void;
}

interface RemoteStartChatResponse {
  task_id: string;
}

export const startChat = (
  payload: StartChatPayload,
  responseHandlers?: StartChatResponseHandlers,
) => {
  const { req, cancel } = fetchApi.post<RemoteStartChatResponse>("chat/start", {
    message: payload.message,
    context: payload.context,
  });

  req.then(({ error, body, status }) => {
    if (error) {
      createErrorsHandlers({}, error, responseHandlers, status);
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess({ taskId: body.task_id });
    }
  });

  return { cancel };
};
```

```typescript
// common/requests/chat/getChatStatus.ts
import { createErrorsHandlers } from "../../utils";
import { fetchApi } from "../fetchApi";

export type ChatStatus = "pending" | "done" | "error";

export interface ChatStatusData {
  status: ChatStatus;
  response?: string;
  error?: string;
}

export interface GetChatStatusResponseHandlers {
  onSuccess?: (data: ChatStatusData) => void;
  onError?: (error: string) => void;
}

interface RemoteChatStatusResponse {
  status: ChatStatus;
  response?: string;
  error?: string;
}

export const getChatStatus = (
  taskId: string,
  responseHandlers?: GetChatStatusResponseHandlers,
) => {
  const { req, cancel } = fetchApi.get<RemoteChatStatusResponse>(
    `chat/status/${taskId}`,
  );

  req.then(({ error, body, status }) => {
    if (error) {
      createErrorsHandlers({}, error, responseHandlers, status);
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess({
        status: body.status,
        response: body.response,
        error: body.error,
      });
    }
  });

  return { cancel };
};
```

---

### Task 2.2: Chat Widget Component (react-component-creator)

**Location**: `apps/datacapt/src/components/shared/Builder/BuilderChat/`

**Files to create**:

- `index.ts` - exports
- `BuilderChat.tsx` - main chat component
- `BuilderChat.less` - styles
- `useChatPolling.ts` - polling hook with timeout and cancellation

**Component Structure**:

```typescript
// BuilderChat.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Input } from 'antd'
import { DatacButton } from 'common/components'
import { Structure } from 'common/requests'
import { useScopedIntl } from 'common/hooks'
import { useChatPolling } from './useChatPolling'
import './BuilderChat.less'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface BuilderChatProps {
  structure: Structure
  currentSectionId?: string
  currentSubsectionId?: string
}

export const BuilderChat: React.FC<BuilderChatProps> = ({
  structure,
  currentSectionId,
  currentSubsectionId
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const { sendMessage, isLoading, cancel } = useChatPolling()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intlChat = useScopedIntl('builder.chat')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => cancel()
  }, [cancel])

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    sendMessage(
      input,
      { structure, currentSectionId, currentSubsectionId },
      {
        onSuccess: (response) => {
          setMessages(prev => [...prev, { role: 'assistant', content: response }])
        },
        onError: (error) => {
          setMessages(prev => [...prev, { role: 'assistant', content: error }])
        }
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="builder-chat">
      <div className="builder-chat__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`builder-chat__message builder-chat__message--${msg.role}`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="builder-chat__typing">{intlChat('thinking')}</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="builder-chat__input">
        <Input.TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={intlChat('placeholder')}
          disabled={isLoading}
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <DatacButton
          type="primary"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          {intlChat('send')}
        </DatacButton>
      </div>
    </div>
  )
}
```

### Task 2.3: Polling Hook with Timeout and Cancellation

```typescript
// useChatPolling.ts
import { useState, useRef, useCallback } from "react";
import { startChat, getChatStatus, ChatContext } from "common/requests";

const POLL_INTERVAL = 1500;
const TIMEOUT = 60000; // 60 seconds max

interface SendMessageHandlers {
  onSuccess: (response: string) => void;
  onError: (error: string) => void;
}

export const useChatPolling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    (message: string, context: ChatContext, handlers: SendMessageHandlers) => {
      setIsLoading(true);
      const startTime = Date.now();

      const { cancel: cancelStart } = startChat(
        { message, context },
        {
          onSuccess: ({ taskId }) => {
            const pollStatus = () => {
              if (Date.now() - startTime > TIMEOUT) {
                setIsLoading(false);
                handlers.onError("Request timed out");
                return;
              }

              const { cancel: cancelStatus } = getChatStatus(taskId, {
                onSuccess: (data) => {
                  if (data.status === "done") {
                    setIsLoading(false);
                    handlers.onSuccess(data.response || "");
                  } else if (data.status === "error") {
                    setIsLoading(false);
                    handlers.onError(data.error || "Unknown error");
                  } else {
                    timeoutRef.current = window.setTimeout(
                      pollStatus,
                      POLL_INTERVAL,
                    );
                  }
                },
                onError: (error) => {
                  setIsLoading(false);
                  handlers.onError(error);
                },
              });
              cancelRef.current = cancelStatus;
            };

            pollStatus();
          },
          onError: (error) => {
            setIsLoading(false);
            handlers.onError(error);
          },
        },
      );
      cancelRef.current = cancelStart;
    },
    [],
  );

  return { sendMessage, isLoading, cancel };
};
```

---

## Phase 3: Integration (main agent)

### Task 3.1: Add Chat to Builder

**Files to modify**:

- `apps/datacapt/src/components/shared/Builder/Builder.tsx`
- `apps/datacapt/src/components/shared/Builder/Builder.less`

**Integration**:

- Add state for chat panel visibility
- Add toggle button (DatacButton with icon) in Builder header area
- Render BuilderChat as collapsible side panel
- Pass `section` (contains Structure), `sectionId` from BuilderContext

**Implementation sketch**:

```typescript
// In Builder.tsx
import { BuilderChat } from './BuilderChat'

const Builder = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { section, sectionId } = useContext(BuilderContext)

  return (
    <div className="builder">
      {/* Existing builder content */}

      <DatacButton
        type="ghost"
        icon="chat"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="builder__chat-toggle"
      >
        {intl('builder.chat.toggle')}
      </DatacButton>

      {isChatOpen && (
        <div className="builder__chat-panel">
          <BuilderChat
            structure={{ sections: [section] }}
            currentSectionId={sectionId}
          />
        </div>
      )}
    </div>
  )
}
```

### Task 3.2: LESS Styles for Chat Panel

**Add to Builder.less**:

```less
.builder {
  &__chat-toggle {
    // Position in header area
  }

  &__chat-panel {
    position: fixed;
    right: 0;
    top: @header-height;
    width: 24rem;
    height: calc(100vh - @header-height);
    background: @bg-primary;
    border-left: 1px solid @border-subtle;
    z-index: @z-index-dropdown;
    display: flex;
    flex-direction: column;
  }
}
```

### Task 3.3: Translations (en.json only)

**Add to `common/intl/en.json`**:

```json
{
  "builder.chat.toggle": "AI Assistant",
  "builder.chat.placeholder": "Ask about this form...",
  "builder.chat.thinking": "Thinking...",
  "builder.chat.send": "Send",
  "builder.chat.error": "Failed to get response",
  "builder.chat.timeout": "Request timed out"
}
```

**NOTE**: Only add to `en.json`. Other languages will be handled by `/translate` command.

---

## Execution Order (Sequential)

1. **Task 1.1**: LLM Service Setup (backend)
2. **Task 1.2**: Settings & Dependencies (backend)
3. **Task 2.1**: API Requests (api-requests-manager)
4. **Task 2.2**: Chat Widget Component (react-component-creator)
5. **Task 2.3**: Polling Hook (part of react-component-creator)
6. **Task 3.1**: Builder Integration (main agent)
7. **Task 3.2**: Styles (main agent or less-style-reviewer)
8. **Task 3.3**: Translations (main agent adds en.json, then /translate)

**CRITICAL**: Execute tasks sequentially, not in parallel. Wait for each sub-agent to complete before starting next.

## Estimated Effort

- Phase 1: ~2h (backend Django app + endpoints)
- Phase 2: ~3h (API requests + component + hook)
- Phase 3: ~1.5h (integration + styling + translations)

Total: ~6.5h

## Dependencies

- Existing Celery setup in backend
- Existing `common/requests/fetchApi.ts` utilities
- Existing `common/components/DatacButton`
- Design system variables in `common/styles/`
- LLM API keys (GEMINI_API_KEY or OPENAI_API_KEY in environment)

# API Requests & Interfaces

## Location

All API request functions and interfaces are located in `common/requests/`

## File Structure

```
common/requests/
├── module1/
│   ├── index.ts          // Export all functions
│   ├── function1.ts      // Specific API functions
│   └── function2.ts
├── fetchApi.ts           // Base fetch utility
├── RequestError.ts       // Error handling types
└── SorterOrder.ts        // Common types
```

## Naming Conventions

- **Files**: camelCase (`userProfile.ts`, `paymentOrders.ts`)
- **Functions**: camelCase (`fetchUserData`, `createPaymentOrder`)
- **Interfaces**: PascalCase (`UserData`, `PaymentOrderRequest`)
- **Types**: PascalCase (`SorterOrder`, `BackendError`)

## Function Structure

### Datacapt API Pattern with Response Handlers

```typescript
import { createErrorsHandlers } from "../../utils";
import { fetchApi } from "../fetchApi";

// Remote data interface (from backend)
export interface RemoteCenterData {
  id: number;
  name: string;
  country: string;
  status: CenterStatus;
  users_count?: number;
  has_subjects?: boolean;
}

// Options interfaces
export interface FetchCentersOptions {
  limit: number;
  offset: number;
  search?: string;
  filters?: {
    status?: CenterStatus;
    country?: string;
  };
}

// Response handler interfaces
export interface FetchCentersResponseHandlers {
  onSuccess?: (data: {
    centers: ParsedCenterData[];
    allCentersCount: number;
    countries: string[];
  }) => void;
  onValidationError?: (errors: ValidationErrors) => void;
  onError?: (error: string) => void;
}

// Main API function with response handlers pattern
export const fetchCenters = (
  { studyId, options }: { studyId: string; options: FetchCentersOptions },
  responseHandlers?: FetchCentersResponseHandlers,
) => {
  const query = {
    limit: options.limit,
    offset: options.offset,
    search: options.search,
    status: options.filters?.status,
    country: options.filters?.country,
  };

  const { req, cancel } = fetchApi.get<FetchCentersResponse>(
    "study_centers",
    query,
    { studyId },
  );

  req.then(({ error, body, status }) => {
    if (error) {
      createErrorsHandlers<FetchCentersResponseHandlers>(
        {},
        error,
        responseHandlers,
        status,
      );
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess({
        centers: body.results.map(parseRemoteCenterData),
        allCentersCount: body.count,
        countries: body.countries,
      });
    }
  });

  return { cancel };
};

// Data parsing function
export const parseRemoteCenterData = (center: RemoteCenterData) => {
  return {
    id: String(center.id),
    name: center.name,
    country: center.country,
    status: center.status,
    usersCount: center.users_count,
    hasSubjects: center.has_subjects,
  };
};
```

### Complex Error Handling Example

```typescript
interface CreateRoomPayload {
  study: string;
  subject: string;
  messageType: MessageType;
  smsBody: string;
  emailBody: string;
  emailSubject: string;
}

interface RoomResponseHandlers {
  onSuccess?: (response: RemoteMeetingInfo) => void;
  onRequestError?: (code: number) => void;
  onTenantForbidden?: () => void;
  onSubjectStudyNotExist?: () => void;
  onTooManyRequests?: () => void;
  onNoEmail?: () => void;
  onNoPhone?: () => void;
}

export const createRoom = (
  payload: CreateRoomPayload,
  responseHandlers: RoomResponseHandlers,
) => {
  const query = {
    user: payload.user,
    subject: payload.subject,
    sms_body: payload.smsBody,
    email_body: payload.emailBody,
    email_subject: payload.emailSubject,
    message_type: payload.messageType,
  };
  const { req, cancel } = fetchApi.post<RoomResponse>("econsult", query, {
    studyId: payload.study,
  });

  req.then(({ error, body, status }) => {
    if (status === 429) {
      if (responseHandlers.onTooManyRequests) {
        responseHandlers.onTooManyRequests();
      }
    } else if (error || status === 429) {
      createErrorsHandlers<RoomResponseHandlers>(
        {
          // HTTP status codes
          429: "onTooManyRequests",
          // Backend error codes mapped to handler methods
          [BackendError.INVITE_SUBJECT_HAS_NO_EMAIL]: "onNoEmail",
          [BackendError.INVITE_SUBJECT_HAS_NO_PHONE]: "onNoPhone",
          [BackendError.ECONSULT_MODULE_FORBIDDEN]: "onTenantForbidden",
          [BackendError.ECONSULT_SUBJECT_STUDY_DOES_NOT_EXIST]:
            "onSubjectStudyNotExist",
        },
        error,
        responseHandlers,
        status,
      );
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess(parseRemoteCreateRoom(body));
    }
  });

  return { cancel };
};
```

### Simple POST Example

```typescript
export const createAnalyticsChart = (
  { studyId, variable, type, tabId }: CreateAnalyticsChartPayload,
  responseHandlers?: CreateAnalyticsChartResponseHandlers,
) => {
  const { req, cancel } = fetchApi.post(
    `analytics/${tabId}/charts`,
    { question: variable, study: studyId, type },
    { studyId },
  );

  req.then(({ error, status }) => {
    if (error) {
      createErrorsHandlers<CreateAnalyticsChartResponseHandlers>(
        {
          [BackendError.ANALYTICS_CHART_LIMIT_REACHED]: "onChartLimit",
        },
        error,
        responseHandlers,
        status,
      );
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess();
    }
  });

  return { cancel };
};
```

## Error Handling

- Use `createErrorsHandlers` utility for mapping backend errors to handler methods
- First parameter is error mapping object: `{ [BackendError.CODE]: 'handlerMethodName' }`
- Can map both HTTP status codes (e.g., `429`) and BackendError constants
- Response handlers pattern with specific error callbacks (`onNoEmail`, `onTenantForbidden`, etc.)
- Functions return `{ cancel }` object for request cancellation
- Error handling is done in the request `.then()` callback, not with try/catch
- Handle special HTTP status codes before calling `createErrorsHandlers`

## Data Parsing Utilities

- `parseEditorContentForSave` - for rich text editor content
- `parseRemoteEditorContent` - for incoming editor content
- `parseRemotePhoneNumber` - for phone number parsing
- `phoneNumberToString` - for phone number formatting
- `prepareSorter` - for table sorting preparation

## Export Pattern

Each module should have an `index.ts` that exports all functions:

```typescript
export * from "./userProfile";
export * from "./settings";
export * from "./dashboard";
```

## Key Patterns

### FetchApi Usage

```typescript
// GET with query parameters and context
const { req, cancel } = fetchApi.get<ResponseType>("endpoint", queryParams, {
  studyId,
});

// POST with body
const { req, cancel } = fetchApi.post<ResponseType>("endpoint", bodyData);

// DELETE
const { req, cancel } = fetchApi.delete("endpoint/id");

// PUT with body
const { req, cancel } = fetchApi.put<ResponseType>("endpoint/id", bodyData);
```

### Response Handler Pattern

All API functions use response handlers instead of returning promises:

```typescript
export interface ApiResponseHandlers {
  onSuccess?: (data: SuccessData) => void;
  onValidationError?: (errors: ValidationErrors) => void;
  onError?: (error: string) => void;
}
```

### Data Transformation

- `Remote*` interfaces for backend data (snake_case fields)
- `parse*` functions convert backend data to frontend format (camelCase)
- Separate interfaces for options, responses, and parsed data

### Module Organization

Organize API functions by domain:

```
common/requests/
├── subjects/          // Subject management
├── forms/            // Form handling
├── econsent/         // eConsent workflows
├── epros/            // ePRO management
├── recruitment/      // Recruitment flows
├── generalSettings/  // App configuration
├── studies/          // Study management
└── calendar/         // Calendar/scheduling
```

Each module should have an `index.ts` that re-exports:

```typescript
export * from "./subjectActions";
export * from "./subjectData";
export * from "./subjectAllocation";
```

## Best Practices

- Always define TypeScript interfaces for all data structures
- Use response handlers pattern, not async/await with try/catch
- Include request cancellation capability (`return cancel` - direct function, not object)
- Parse backend data to match frontend conventions (snake_case → camelCase)
- Use descriptive function names that indicate the action and resource
- Import utilities like `createErrorsHandlers`, `parseRemotePhoneNumber` when needed
- Group related functions by domain/module

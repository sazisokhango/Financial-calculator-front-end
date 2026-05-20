# Data Model: User Registration

**Feature**: 002-user-registration
**Date**: 2026-05-20

---

## DTOs

### RegisterRequest (sent to API)

| Field     | Type   | Required | Validation          |
|-----------|--------|----------|---------------------|
| firstName | string | Yes      | Not blank           |
| lastName  | string | Yes      | Not blank           |
| email     | string | Yes      | Valid email, trimmed |

### UserResponse (received from API on 201)

| Field     | Type   | Notes                      |
|-----------|--------|----------------------------|
| id        | number | System-generated; not stored locally |
| firstName | string | Echoed back                |
| lastName  | string | Echoed back                |
| email     | string | Echoed back                |

---

## TypeScript Interfaces

```typescript
// src/app/models/register-request.model.ts
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
}

// UserResponse reuses the existing User interface from user.model.ts
```

---

## Component State

### RegisterComponent signals

| Signal       | Type              | Initial | Description                          |
|--------------|-------------------|---------|--------------------------------------|
| `submitting` | `signal<boolean>` | `false` | True while POST is in flight          |
| `apiError`   | `signal<string \| null>` | `null` | API error message to display   |

### Form

| Control     | Validators                          |
|-------------|-------------------------------------|
| `firstName` | `Validators.required`               |
| `lastName`  | `Validators.required`               |
| `email`     | `Validators.required`, `Validators.email` |

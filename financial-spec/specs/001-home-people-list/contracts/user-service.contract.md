# Contract: UserService — Home Page

**Feature**: 001-home-people-list
**Date**: 2026-05-20

---

## Service Interface

```typescript
// src/app/services/user.service.ts
interface UserService {
  getAll(): Observable<User[]>;
}
```

---

## HTTP Contract

### GET /api/user

| Property    | Value |
|-------------|-------|
| Method      | GET |
| URL         | `${environment.apiBaseUrl}/user` |
| Auth header | None |
| Success     | 200 OK — `User[]` |
| Error       | Any non-2xx → caught, `error.error.message` displayed to user |

**Success response shape**:
```json
[
  { "id": 1, "firstName": "Saziso", "lastName": "Khango", "email": "saziso@example.com" },
  { "id": 2, "firstName": "John",   "lastName": "Doe",    "email": "john@example.com" }
]
```

**Error response shape** (from back-end `GlobalExceptionHandler`):
```json
{ "status": 500, "error": "Internal Server Error", "message": "Could not retrieve users" }
```

---

## Component Contract

`HomeComponent` depends on `UserService` and `Router` only.

| Input      | Type | Description |
|------------|------|-------------|
| none       | —    | No `@Input()` — component is routed directly |

| Output     | Type | Description |
|------------|------|-------------|
| none       | —    | No `@Output()` — navigation via `Router.navigate()` |

| Navigation | Target          | Trigger |
|------------|-----------------|---------|
| User click | `/user/:id`     | User clicks their name button |
| Register   | `/register`     | User clicks the Register button |

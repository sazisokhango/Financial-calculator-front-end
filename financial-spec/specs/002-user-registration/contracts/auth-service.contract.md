# Contract: AuthService — Registration

**Feature**: 002-user-registration
**Date**: 2026-05-20

---

## Service Interface

```typescript
interface AuthService {
  register(payload: RegisterRequest): Observable<User>;
}
```

---

## HTTP Contract

### POST /api/auth/register

| Property | Value |
|----------|-------|
| Method   | POST |
| URL      | `${environment.apiBaseUrl}/auth/register` |
| Body     | `{ firstName, lastName, email }` |
| Success  | `201 Created` → `User` object |
| Error    | `400 Bad Request` → `{ status, error, message }` |

**Success response**:
```json
{ "id": 1, "firstName": "Saziso", "lastName": "Khango", "email": "saziso@example.com" }
```

**Error response**:
```json
{ "status": 400, "error": "Bad Request", "message": "Email already registered" }
```

---

## Component Contract

`RegisterComponent` depends on `AuthService` and `Router` only.

| Navigation | Target | Trigger |
|------------|--------|---------|
| Success    | `/`    | `201 Created` response |
| Back link  | `/`    | User clicks "Already registered?" |

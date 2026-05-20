# Data Model: Home Page — People List

**Feature**: 001-home-people-list
**Date**: 2026-05-20

---

## Entities

### User (read-only, from API)

Represents a registered person returned by `GET /api/user`.

| Field       | Type   | Source      | Displayed |
|-------------|--------|-------------|-----------|
| id          | number | API         | No (used for navigation) |
| firstName   | string | API         | Yes (part of full name) |
| lastName    | string | API         | Yes (part of full name) |
| email       | string | API         | No (not shown on home page) |

**Display name**: `${user.firstName} ${user.lastName}`

---

## Component State

### HomeComponent signals

| Signal          | Type        | Initial value | Description |
|-----------------|-------------|---------------|-------------|
| `users`         | `User[]`    | `[]`          | Full list from API, set once on load |
| `loading`       | `boolean`   | `true`        | True while API call is in flight |
| `error`         | `string \| null` | `null`   | API error message if call fails |
| `filterControl` | `FormControl<string>` | `''` | Reactive Forms control for search input |
| `filterValue`   | `Signal<string>` | `''`     | `toSignal(filterControl.valueChanges)` |
| `filteredUsers` | `computed<User[]>` | —        | Derived: users whose full name contains filterValue (case-insensitive) |

---

## TypeScript Interface

```typescript
// src/app/models/user.model.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
```

---

## Validation Rules

- No user input is validated on the home page (read-only view + filter only).
- The filter is case-insensitive and matches any substring of `firstName + ' ' + lastName`.
- An empty or whitespace-only filter shows the full list.

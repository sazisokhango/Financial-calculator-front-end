# Contract: TaxService & UserService — Dashboard

**Feature**: 003-user-dashboard
**Date**: 2026-05-20

---

## UserService addition

```typescript
getById(id: number): Observable<User>
// GET ${environment.apiBaseUrl}/user/${id}
```

## TaxService (new)

```typescript
getAllByUser(userId: number): Observable<TaxCalculation[]>
// GET ${environment.apiBaseUrl}/tax?userId=${userId}

delete(id: number): Observable<void>
// DELETE ${environment.apiBaseUrl}/tax/${id}
```

---

## HTTP Contracts

| Method | URL | Success | Error |
|--------|-----|---------|-------|
| GET | `/api/user/:id` | 200 `User` | 404 |
| GET | `/api/tax?userId=:id` | 200 `TaxCalculation[]` | 4xx/5xx |
| DELETE | `/api/tax/:id` | 204 No Content | 4xx/5xx |

---

## Component Contract

`DashboardComponent` — no `@Input()` / `@Output()`. Reads `:id` from `ActivatedRoute`.

| Navigation | Target | Trigger |
|------------|--------|---------|
| Card click | `/user/:id/calculations/:calcId` | User clicks a card |
| New Calculation | `/user/:id/calculate` | Button click |

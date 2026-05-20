# Implementation Plan: User Dashboard

**Branch**: `feature/003-user-dashboard` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

---

## Summary

Build `DashboardComponent` at `/user/:id`. Uses `forkJoin` to parallel-fetch the user profile and their saved calculations. Renders calculation cards (title, description, date). Card click navigates to the view page; delete icon fires `window.confirm` then `DELETE /api/tax/:id`; "New Calculation" button navigates to the calculate page.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: `HttpClient`, `ActivatedRoute`, `Router`, `forkJoin` (RxJS), Angular Signals, `DatePipe`

**Storage**: None

**Testing**: Angular TestBed + Jasmine; one SpecKit spec per component/service

**Target Platform**: Browser — modern Chrome/Firefox/Edge

**Constraints**: `apiBaseUrl` from environment only; `@for`/`@if` only; no component libraries

---

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Standalone components | ✅ `DashboardComponent` standalone |
| II. `@for` / `@if` | ✅ All list/conditional rendering via new syntax |
| III. Reactive Forms | ✅ N/A — no forms on this page |
| IV. API contract | ✅ `GET /api/user/:id`, `GET /api/tax?userId`, `DELETE /api/tax/:id` via environment |
| V. Identity flow | ✅ `userId` from URL param only — no session/token |

---

## Project Structure

### Source Code

```
src/app/
├── models/
│   └── tax-calculation.model.ts        ← NEW: TaxCalculation interface
├── services/
│   ├── user.service.ts                 ← MODIFY: add getById()
│   ├── tax.service.ts                  ← NEW: getAllByUser(), delete()
│   └── tax.service.spec.ts             ← NEW
└── dashboard/
    ├── dashboard.component.ts          ← NEW
    ├── dashboard.component.html        ← NEW
    ├── dashboard.component.css         ← NEW (empty)
    └── dashboard.component.spec.ts     ← NEW

src/app/app.routes.ts                   ← MODIFY: add user/:id route
```

---

## Implementation Phases

### Phase 1 — Model & Services
1. Create `src/app/models/tax-calculation.model.ts` — `TaxCalculation` interface
2. Add `getById(id: number): Observable<User>` to `src/app/services/user.service.ts`
3. Create `src/app/services/tax.service.ts` — `getAllByUser(userId)` and `delete(id)`

### Phase 2 — Component
4. Create `src/app/dashboard/dashboard.component.ts` — inject `ActivatedRoute`, `Router`, `UserService`, `TaxService`; `forkJoin` on init; signals for `user`, `calculations`, `loading`, `error`; `viewCalc(id)`, `newCalc()`, `deleteCalc(id)` with `window.confirm`
5. Create `src/app/dashboard/dashboard.component.html` — header with user full name + "New Calculation" button; `@if(loading())` spinner; `@if(error())` banner; `@for` cards with title/description/date + delete icon; empty state
6. Create `src/app/dashboard/dashboard.component.css` — empty

### Phase 3 — Routing
7. Add `{ path: 'user/:id', component: DashboardComponent }` to `app.routes.ts`

### Phase 4 — Specs
8. Create `src/app/services/tax.service.spec.ts`
9. Create `src/app/dashboard/dashboard.component.spec.ts`

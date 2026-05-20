# Implementation Plan: View Calculation

**Branch**: `feature/005-view-calculation` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

---

## Summary

Build `ViewCalculationComponent` at `/user/:id/calculations/:calcId`. Fetches the calculation via `TaxService.getById()`, displays inputs and tax breakdown in two sections with ZAR currency formatting, and provides Edit, Delete (with `window.confirm`), and Back navigation.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: `ActivatedRoute`, `Router`, `TaxService` (existing), `CurrencyPipe`, `DatePipe`, Angular Signals

**Storage**: None — read-only page

**Testing**: Angular TestBed + Jasmine; one SpecKit spec

**Constraints**: `apiBaseUrl` from environment; `@if` only; `CurrencyPipe` with `en-ZA` locale

---

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Standalone components | ✅ `ViewCalculationComponent` standalone |
| II. `@for` / `@if` | ✅ Conditional rendering via `@if` |
| III. Reactive Forms | ✅ N/A — read-only page |
| IV. API contract | ✅ `GET /api/tax/:id`, `DELETE /api/tax/:id` via environment |
| V. Identity flow | ✅ `userId` + `calcId` from URL params only |

---

## Project Structure

### Source Code

```
src/app/
├── view-calculation/
│   ├── view-calculation.component.ts     ← NEW
│   ├── view-calculation.component.html   ← NEW
│   ├── view-calculation.component.css    ← NEW (empty)
│   └── view-calculation.component.spec.ts ← NEW

src/app/app.config.ts                     ← MODIFY: register en-ZA locale
src/app/app.routes.ts                     ← MODIFY: add user/:id/calculations/:calcId
```

No new models or services needed — everything reuses existing code.

---

## Implementation Phases

### Phase 1 — Setup
1. Register `en-ZA` locale in `app.config.ts`
2. Add route `user/:id/calculations/:calcId` to `app.routes.ts`
3. Create empty `view-calculation.component.css`

### Phase 2 — Component
4. Create `view-calculation.component.ts` — inject `ActivatedRoute`, `Router`, `TaxService`; signals `calc`, `loading`, `error`; `ngOnInit` fetches by `calcId`; `editCalc()`, `deleteCalc()` with `window.confirm`, `goBack()`
5. Create `view-calculation.component.html` — header (title + Edit/Back buttons), error banner, loading spinner, Inputs card, Tax Breakdown card with highlighted final liability, Delete button

### Phase 3 — Spec
6. Create `view-calculation.component.spec.ts`

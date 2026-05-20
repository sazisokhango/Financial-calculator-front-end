# Implementation Plan: Edit Calculation

**Branch**: `feature/006-edit-calculation` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

---

## Summary

Build `EditCalculationComponent` at `/user/:id/calculations/:calcId/edit`. Uses `forkJoin` to fetch the user email and existing calculation in parallel, patches the form with existing values, and submits via `PUT /api/tax/:calcId`. Navigates to the view page on success; cancel also returns to the view page. Identical form layout and validation to `CalculateComponent`.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: `FormBuilder`, `Validators`, `ReactiveFormsModule`, `forkJoin`, `ActivatedRoute`, `Router`, Angular Signals, existing `UserService` + `TaxService`

**Storage**: None

**Testing**: Angular TestBed + Jasmine; one SpecKit spec

**Constraints**: `apiBaseUrl` from environment; `@if` only; no component libraries; no new models or services

---

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Standalone components | ✅ `EditCalculationComponent` standalone |
| II. `@for` / `@if` | ✅ Validation errors and loading use `@if` |
| III. Reactive Forms | ✅ `FormBuilder.group()` + `patchValue()` |
| IV. API contract | ✅ `PUT /api/tax/:id` via `environment.apiBaseUrl` |
| V. Identity flow | ✅ `userEmail` from `GET /api/user/:id`, never manual |

---

## Project Structure

### Source Code

```
src/app/
└── edit-calculation/
    ├── edit-calculation.component.ts      ← NEW
    ├── edit-calculation.component.html    ← NEW
    ├── edit-calculation.component.css     ← NEW (empty)
    └── edit-calculation.component.spec.ts ← NEW

src/app/app.routes.ts                      ← MODIFY: add edit route
```

No new models or services — everything already exists.

---

## Implementation Phases

### Phase 1 — Setup
1. Create empty `edit-calculation.component.css`
2. Add `user/:id/calculations/:calcId/edit` route to `app.routes.ts`

### Phase 2 — Component
3. Create `edit-calculation.component.ts` — same form group as `CalculateComponent`; `forkJoin` init; `form.patchValue()` to pre-fill; `onSubmit()` calls `taxService.update(calcId, payload)`; navigates to view page on success; `cancel()` navigates to view page
4. Create `edit-calculation.component.html` — identical layout to calculate form, header changed to "Edit Calculation", submit button reads "Save Changes"

### Phase 3 — Spec
5. Create `edit-calculation.component.spec.ts`

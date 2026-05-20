# Implementation Plan: Tax Calculation Form

**Branch**: `feature/004-tax-calculation` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

---

## Summary

Build `CalculateComponent` at `/user/:id/calculate`. Fetches the user's email on init, renders a 10-field Reactive Form in two sections (details + income), validates on submit, posts to `POST /api/tax`, and navigates to the result view on success.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: `FormBuilder`, `Validators`, `ReactiveFormsModule`, `HttpClient`, `ActivatedRoute`, `Router`, Angular Signals

**Storage**: None

**Testing**: Angular TestBed + Jasmine; one SpecKit spec per component

**Target Platform**: Browser — modern

**Constraints**: `apiBaseUrl` from environment; `@if` only; no component libraries; numeric fields default to `0`

---

## Constitution Check

| Principle | Status |
|-----------|--------|
| I. Standalone components | ✅ `CalculateComponent` standalone |
| II. `@for` / `@if` | ✅ Validation errors use `@if` |
| III. Reactive Forms | ✅ `FormBuilder.group()` with `Validators` |
| IV. API contract | ✅ `POST /api/tax` via `environment.apiBaseUrl` |
| V. Identity flow | ✅ `userEmail` from `GET /api/user/:id`, never manual |

---

## Project Structure

### Source Code

```
src/app/
├── models/
│   └── tax-calculation-request.model.ts   ← NEW
├── services/
│   └── tax.service.ts                     ← MODIFY: add calculate()
└── calculate/
    ├── calculate.component.ts             ← NEW
    ├── calculate.component.html           ← NEW
    ├── calculate.component.css            ← NEW (empty)
    └── calculate.component.spec.ts        ← NEW

src/app/app.routes.ts                      ← MODIFY: add user/:id/calculate
```

---

## Implementation Phases

### Phase 1 — Model & Service
1. Create `src/app/models/tax-calculation-request.model.ts`
2. Add `calculate(payload): Observable<TaxCalculation>` to `tax.service.ts`

### Phase 2 — Component
3. Create `calculate.component.ts` — inject `ActivatedRoute`, `Router`, `UserService`, `TaxService`, `FormBuilder`; `ngOnInit` fetches user email; `FormGroup` with all controls; `onSubmit()` with `markAllAsTouched` guard, coerce numerics to `0`, call `taxService.calculate()`, navigate on success; `cancel()` navigates to `/user/:id`
4. Create `calculate.component.html` — two-section form (Details / Income & Deductions), `@if` inline errors per field, API error banner, Cancel + Submit buttons
5. Create `calculate.component.css` — empty

### Phase 3 — Routing
6. Add `{ path: 'user/:id/calculate', component: CalculateComponent }` to `app.routes.ts`

### Phase 4 — Spec
7. Create `calculate.component.spec.ts`

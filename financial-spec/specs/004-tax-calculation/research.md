# Research: Tax Calculation Form

**Feature**: 004-tax-calculation
**Date**: 2026-05-20

---

## Decision 1 — Numeric field handling: null vs 0

**Decision**: All numeric FormControls are initialised with `0` (not `''` or `null`). Before submission, `getRawValue()` is used and numeric fields are coerced with `Number(val) || 0` to guarantee no `null` reaches the payload.

**Rationale**: The spec and constitution both mandate that empty numeric fields become `0`. Using `0` as the initial value also avoids the `null` type mismatch Angular Reactive Forms can introduce with number inputs.

---

## Decision 2 — userEmail resolution

**Decision**: `ngOnInit` calls `userService.getById(userId)` to fetch the user and store their email in a component property. If this call fails, the error is shown and the form submit is blocked.

**Rationale**: The spec explicitly states `userEmail` must never be entered manually. Resolving it at init means the submit handler can assume it is always available (or the form is in error state).

---

## Decision 3 — TaxCalculationRequest model

**Decision**: Create `src/app/models/tax-calculation-request.model.ts` with the full POST payload interface.

**Rationale**: Provides type safety for the `TaxService.calculate()` call and avoids inline object literals.

---

## Decision 4 — TaxService.calculate()

**Decision**: Add `calculate(payload: TaxCalculationRequest): Observable<TaxCalculation>` to the existing `TaxService` (returns the full `TaxCalculation` response including the new `id`).

**Rationale**: `TaxService` already owns all `/api/tax` calls. Adding `calculate()` is a natural extension — no new service needed.

---

## Decision 5 — Form layout

**Decision**: Group fields visually into two sections: "Calculation Details" (title, description, age) and "Income & Deductions" (all monetary fields). Each monetary field uses `type="number"` with `min="0"` and `step="0.01"`.

**Rationale**: 10 fields on one flat form is overwhelming. Grouping reduces cognitive load and makes the `min` attribute enforce non-negative values at the browser level as a UX aid (validation still happens in Angular).

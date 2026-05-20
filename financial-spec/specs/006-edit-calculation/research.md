# Research: Edit Calculation

**Feature**: 006-edit-calculation
**Date**: 2026-05-20

---

## Decision 1 — Reuse CalculateComponent pattern, not the component itself

**Decision**: Create a separate `EditCalculationComponent` that duplicates the form structure from `CalculateComponent` rather than making `CalculateComponent` dual-purpose.

**Rationale**: The two forms differ in init (pre-population vs blank), submit action (PUT vs POST), and cancel target (view page vs dashboard). Making one component handle both via an `@Input` flag would create hidden conditional paths that are hard to test and maintain. Two focused components are cleaner.

---

## Decision 2 — Parallel init: fetch user email + existing calculation together

**Decision**: Use `forkJoin([userService.getById(userId), taxService.getById(calcId)])` in `ngOnInit`. On success, patch the form and store `userEmail`.

**Rationale**: Both calls are independent and both are needed before the form can render. `forkJoin` cuts init time in half compared to sequential calls.

---

## Decision 3 — Form patching

**Decision**: Use `form.patchValue()` to pre-populate after `forkJoin` resolves. This avoids resetting validators and is the Angular-idiomatic approach for pre-filling a `FormGroup`.

**Rationale**: `patchValue` only updates the fields provided, leaving untouched controls at their defaults — safe even if the API adds new fields in future.

---

## Decision 4 — No new service methods needed

**Decision**: `TaxService.update(id, payload)` was already added in feature 004 (stubbed ahead of this feature). `UserService.getById()` and `TaxService.getById()` also exist. No service changes required.

**Rationale**: All required HTTP methods were implemented in earlier features in anticipation.

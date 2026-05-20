# Research: User Registration

**Feature**: 002-user-registration
**Date**: 2026-05-20

---

## Decision 1 — Form Structure: FormGroup vs individual FormControls

**Decision**: Use a single `FormGroup` with three `FormControl` fields (`firstName`, `lastName`, `email`) built via `FormBuilder`.

**Rationale**: Registration is a submitted form — `FormGroup` models the submit unit correctly and allows the validity of all fields to be checked at once before submission. `FormBuilder.group()` reduces boilerplate.

**Alternatives considered**:
- Individual FormControls — works but loses the single-submit validity check and makes the template more verbose.

---

## Decision 2 — API call: AuthService vs inline HttpClient

**Decision**: Create `src/app/services/auth.service.ts` with a `register()` method. The component injects `AuthService`, not `HttpClient` directly.

**Rationale**: Constitution standard — one service per API resource. `AuthService` is reusable if a login endpoint is added later. Keeps the component thin.

---

## Decision 3 — Submitting state

**Decision**: Use a `submitting = signal(false)` on the component. Set to `true` on submit, back to `false` on success or error. Button `[disabled]="submitting()"`.

**Rationale**: Prevents double-submission. Signals are the Angular 21 primitive for component state (consistent with feature 001).

---

## Decision 4 — Email trimming

**Decision**: Trim leading/trailing whitespace from email in the component before passing to `AuthService.register()`. Use `value.trim()` on the raw form value.

**Rationale**: Spec requires client-side trimming. Simple one-liner before the service call — no custom validator needed.

---

## No Unknowns Remaining

All decisions resolved. Ready for Phase 1 design.

# Research: Home Page — People List

**Feature**: 001-home-people-list
**Date**: 2026-05-20

---

## Decision 1 — Component State: Signals vs Observables

**Decision**: Use Angular Signals (`signal()`, `computed()`) for component-local state; keep `HttpClient` returning `Observable<User[]>` in the service and convert with `toSignal()` at the component boundary.

**Rationale**: Angular 21 treats signals as the primary reactivity primitive for component state. `toSignal()` bridges the HTTP Observable cleanly, avoids `async` pipe, and works naturally with `@for` / `@if` control flow without needing `| async`. The service stays Observable-based so it remains testable and reusable by other components.

**Alternatives considered**:
- Pure observables + `async` pipe — works but `async` pipe is discouraged in Angular 21 in favour of signals.
- Pure signals with `fetch()` — bypasses HttpClient, loses interceptors and testability.

---

## Decision 2 — Filter Input: FormControl vs plain signal

**Decision**: Use a standalone `FormControl` (not a full `FormGroup`) for the search input, and derive `filteredUsers` as a `computed()` signal from both the user list signal and the filter value.

**Rationale**: The constitution mandates Reactive Forms for all form inputs. A single `FormControl` satisfies this without the overhead of a `FormGroup` (no submission needed here). `valueChanges` is converted to a signal via `toSignal()` so the `computed()` stays synchronous and avoids subscriptions in the component.

**Alternatives considered**:
- Template variable + event binding — violates the Reactive Forms mandate.
- Full `FormGroup` — unnecessary for a single non-submitted field.

---

## Decision 3 — Error Handling

**Decision**: Catch HTTP errors in the service using `catchError`, return an empty array and expose the error message through a dedicated `error` signal on the component.

**Rationale**: Keeps the service method signature simple (`Observable<User[]>`) while allowing the component to show an error banner. The error `message` field from the API `{ status, error, message }` shape is displayed verbatim as required by the constitution.

**Alternatives considered**:
- Re-throw from service and catch in component — creates tighter coupling and requires try/catch around `toSignal()`.
- Return `Observable<User[] | null>` — adds type complexity without benefit.

---

## Decision 4 — Routing

**Decision**: Register `HomeComponent` at the `''` path in `app.routes.ts`. Use Angular `Router.navigate(['/user', user.id])` on name click (not `routerLink` attribute) so the click handler is testable.

**Rationale**: `routerLink` on a `<li>` element has accessibility implications. A button with `(click)` handler calling `Router.navigate()` is fully accessible and unit-testable by spying on the router.

---

## No Unknowns Remaining

All technical decisions are resolved. Ready for Phase 1 design.

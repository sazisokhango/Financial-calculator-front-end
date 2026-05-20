# Research: User Dashboard

**Feature**: 003-user-dashboard
**Date**: 2026-05-20

---

## Decision 1 — TaxCalculationResponse model location

**Decision**: Create `src/app/models/tax-calculation.model.ts` with `TaxCalculationResponse` interface covering all fields returned by the API. Reused by features 003, 004, 005, 006.

**Rationale**: Shared model prevents duplication across all four tax-related features. Centralising it now avoids refactoring later.

---

## Decision 2 — TaxService

**Decision**: Create `src/app/services/tax.service.ts` with `getAllByUser(userId)`, `getById(id)`, `delete(id)`, and stub `calculate()` / `update()` methods (implemented fully in features 004 and 006). Constitution mandates one service per API resource.

**Rationale**: `getAllByUser` and `delete` are needed now. Stubbing the remaining methods keeps the service complete from day one.

---

## Decision 3 — Parallel data fetching (user profile + calculations)

**Decision**: Use `forkJoin([userService.getById(id), taxService.getAllByUser(id)])` in `ngOnInit` to fetch both in parallel. A single `loading` signal covers both.

**Rationale**: Both calls are independent — sequential fetching would add unnecessary latency. `forkJoin` fails fast if either call errors.

---

## Decision 4 — Delete confirmation

**Decision**: Use `window.confirm()` for the confirmation dialog in v1 as stated in the spec assumptions. Remove card from the local `calculations` signal on successful delete (optimistic-style local update, no full reload).

**Rationale**: Simplest compliant approach. A custom modal can replace it in a future iteration without changing the surrounding logic.

---

## Decision 5 — UserService.getById()

**Decision**: Add `getById(id: number): Observable<User>` to the existing `UserService` rather than creating a separate service.

**Rationale**: `UserService` already handles `GET /api/user`. Adding `getById` is a natural extension — no new file needed.

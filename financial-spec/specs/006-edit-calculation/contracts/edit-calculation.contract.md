# Contract: EditCalculationComponent

**Feature**: 006-edit-calculation
**Date**: 2026-05-20

---

## HTTP Calls (all existing service methods)

| Method | URL | Used for |
|--------|-----|----------|
| GET | `/api/user/:id` | Resolve userEmail on init |
| GET | `/api/tax/:calcId` | Pre-populate form on init |
| PUT | `/api/tax/:calcId` | Save updated calculation |

---

## Component Contract

Reads `:id` (userId) and `:calcId` from `ActivatedRoute`. No `@Input()`.

| Navigation | Target | Trigger |
|------------|--------|---------|
| Save success | `/user/:id/calculations/:calcId` | `200 OK` |
| Cancel | `/user/:id/calculations/:calcId` | Cancel button |

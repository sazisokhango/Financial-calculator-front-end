# Contract: ViewCalculationComponent

**Feature**: 005-view-calculation
**Date**: 2026-05-20

---

## HTTP Calls (existing TaxService methods)

| Method | URL | Used for |
|--------|-----|----------|
| GET | `/api/tax/:calcId` | Load calculation on init |
| DELETE | `/api/tax/:calcId` | Delete on confirm |

---

## Component Contract

Reads `:id` (userId) and `:calcId` from `ActivatedRoute`.

| Navigation | Target | Trigger |
|------------|--------|---------|
| Edit | `/user/:id/calculations/:calcId/edit` | Edit button |
| Delete (success) | `/user/:id` | Confirmed delete |
| Back | `/user/:id` | Back link |

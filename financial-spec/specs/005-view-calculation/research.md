# Research: View Calculation

**Feature**: 005-view-calculation
**Date**: 2026-05-20

---

## Decision 1 — Currency formatting

**Decision**: Use Angular `CurrencyPipe` with `currencyCode='ZAR'`, `display='symbol'`, `digitsInfo='1.2-2'`, and `locale='en-ZA'`. Register `en-ZA` locale in `app.config.ts` via `registerLocaleData`.

**Rationale**: Constitution mandates `R #,###.##` with `en-ZA` locale. `CurrencyPipe` handles this natively when the locale is registered. No third-party library needed.

---

## Decision 2 — No new service methods needed

**Decision**: `TaxService.getById(id)` already exists from feature 003. `TaxService.delete(id)` also exists. No service changes required.

**Rationale**: All required HTTP calls were implemented in feature 003 in anticipation of this feature.

---

## Decision 3 — Two-section layout

**Decision**: Render two visually distinct cards: **Inputs** (what the user entered) and **Tax Breakdown** (what the system calculated). Monetary inputs also formatted as currency for consistency.

**Rationale**: Clearly separates user-supplied data from computed results, making the breakdown easy to read at a glance.

---

## Decision 4 — Delete flow

**Decision**: `window.confirm()` → `taxService.delete(calcId)` → `router.navigate(['/user', userId])`. Consistent with feature 003 dashboard delete.

**Rationale**: Same pattern as dashboard delete; no new abstraction needed.

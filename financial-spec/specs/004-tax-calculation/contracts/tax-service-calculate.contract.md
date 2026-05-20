# Contract: TaxService.calculate() — Tax Calculation Form

**Feature**: 004-tax-calculation
**Date**: 2026-05-20

---

## Service Addition

```typescript
// Added to src/app/services/tax.service.ts
calculate(payload: TaxCalculationRequest): Observable<TaxCalculation>
// POST ${environment.apiBaseUrl}/tax
```

---

## HTTP Contract

| Property | Value |
|----------|-------|
| Method   | POST  |
| URL      | `${environment.apiBaseUrl}/tax` |
| Body     | `TaxCalculationRequest` |
| Success  | `201 Created` → `TaxCalculation` (with `id` and full breakdown) |
| Error    | `400` → `{ status, error, message }` |

---

## Navigation on Success

```
/user/:userId/calculations/:newCalcId
```
Where `newCalcId` = `response.id` from the `201` body.

---

## Component Contract

`CalculateComponent` reads `:id` from `ActivatedRoute`.

| Input  | Type | Source |
|--------|------|--------|
| userId | number | `ActivatedRoute` param `:id` |

| Navigation | Target | Trigger |
|------------|--------|---------|
| Success    | `/user/:id/calculations/:newId` | `201 Created` |
| Cancel     | `/user/:id` | Cancel button click |

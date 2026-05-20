# Data Model: User Dashboard

**Feature**: 003-user-dashboard
**Date**: 2026-05-20

---

## TaxCalculationResponse (from API)

| Field              | Type   | Display on card |
|--------------------|--------|-----------------|
| id                 | number | No (navigation) |
| title              | string | Yes             |
| description        | string | Yes (truncated ~80 chars) |
| salary             | number | No              |
| interestIncome     | number | No              |
| dividend           | number | No              |
| capitalGain        | number | No              |
| bonus              | number | No              |
| retirementAnnuity  | number | No              |
| taxAlreadyPaid     | number | No              |
| age                | number | No              |
| totalGrossIncome   | number | No              |
| totalDeductions    | number | No              |
| netTaxableIncome   | number | No              |
| taxBeforeRebate    | number | No              |
| rebate             | number | No              |
| finalTaxLiability  | number | No              |
| createdAt          | string | Yes (formatted `dd MMM yyyy`) |
| updatedAt          | string | No              |

---

## Component State

### DashboardComponent signals

| Signal          | Type                          | Initial | Description                      |
|-----------------|-------------------------------|---------|----------------------------------|
| `user`          | `signal<User \| null>`        | `null`  | Loaded from `GET /api/user/:id`  |
| `calculations`  | `signal<TaxCalculation[]>`    | `[]`    | Loaded from `GET /api/tax?userId` |
| `loading`       | `signal<boolean>`             | `true`  | True while either API call is in flight |
| `error`         | `signal<string \| null>`      | `null`  | Any API error message            |

---

## TypeScript Interface

```typescript
// src/app/models/tax-calculation.model.ts
export interface TaxCalculation {
  id: number;
  title: string;
  description: string;
  salary: number;
  interestIncome: number;
  dividend: number;
  capitalGain: number;
  bonus: number;
  retirementAnnuity: number;
  taxAlreadyPaid: number;
  age: number;
  totalGrossIncome: number;
  totalDeductions: number;
  netTaxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  finalTaxLiability: number;
  createdAt: string;
  updatedAt: string;
}
```

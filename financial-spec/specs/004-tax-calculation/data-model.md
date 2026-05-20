# Data Model: Tax Calculation Form

**Feature**: 004-tax-calculation
**Date**: 2026-05-20

---

## TaxCalculationRequest (sent to API)

| Field              | Type   | Required | Default | Validation  |
|--------------------|--------|----------|---------|-------------|
| userEmail          | string | Yes      | auto    | From profile, not entered |
| title              | string | Yes      | —       | Not blank   |
| description        | string | No       | `''`    | —           |
| salary             | number | No       | `0`     | >= 0        |
| interestIncome     | number | No       | `0`     | >= 0        |
| dividend           | number | No       | `0`     | >= 0        |
| capitalGain        | number | No       | `0`     | >= 0        |
| bonus              | number | No       | `0`     | >= 0        |
| retirementAnnuity  | number | No       | `0`     | >= 0        |
| taxAlreadyPaid     | number | No       | `0`     | >= 0        |
| age                | number | Yes      | —       | >= 0, integer |

---

## TypeScript Interface

```typescript
// src/app/models/tax-calculation-request.model.ts
export interface TaxCalculationRequest {
  userEmail: string;
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
}
```

---

## Component State

| Signal / Property  | Type                   | Initial | Description                          |
|--------------------|------------------------|---------|--------------------------------------|
| `userEmail`        | `string`               | `''`    | Resolved from `GET /api/user/:id`    |
| `submitting`       | `signal<boolean>`      | `false` | True while POST is in flight         |
| `error`            | `signal<string\|null>` | `null`  | API or profile fetch error           |
| `form`             | `FormGroup`            | —       | 10 controls + title + description + age |

---

## Form Controls

| Control            | Initial | Validators                     |
|--------------------|---------|--------------------------------|
| title              | `''`    | `required`                     |
| description        | `''`    | —                              |
| salary             | `0`     | `required`, `min(0)`           |
| interestIncome     | `0`     | `required`, `min(0)`           |
| dividend           | `0`     | `required`, `min(0)`           |
| capitalGain        | `0`     | `required`, `min(0)`           |
| bonus              | `0`     | `required`, `min(0)`           |
| retirementAnnuity  | `0`     | `required`, `min(0)`           |
| taxAlreadyPaid     | `0`     | `required`, `min(0)`           |
| age                | `''`    | `required`, `min(0)`           |

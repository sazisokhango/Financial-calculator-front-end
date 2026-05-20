# Data Model: Edit Calculation

**Feature**: 006-edit-calculation
**Date**: 2026-05-20

---

## Reused Models

- `TaxCalculation` — loaded on init, used to pre-populate the form
- `TaxCalculationRequest` — built from form values and sent via PUT
- `User` — loaded on init to resolve `userEmail`

No new models needed.

---

## Component State

| Signal / Property | Type                        | Initial | Description                          |
|-------------------|-----------------------------|---------|--------------------------------------|
| `userEmail`       | `string`                    | `''`    | Resolved from `GET /api/user/:id`    |
| `submitting`      | `signal<boolean>`           | `false` | True while PUT is in flight          |
| `error`           | `signal<string\|null>`      | `null`  | API or fetch error message           |
| `loading`         | `signal<boolean>`           | `true`  | True while forkJoin is in flight     |

---

## Form Controls (same as CalculateComponent)

| Control            | Initial value from calc | Validators              |
|--------------------|------------------------|-------------------------|
| title              | `calc.title`           | `required`              |
| description        | `calc.description`     | —                       |
| salary             | `calc.salary`          | `required`, `min(0)`    |
| interestIncome     | `calc.interestIncome`  | `required`, `min(0)`    |
| dividend           | `calc.dividend`        | `required`, `min(0)`    |
| capitalGain        | `calc.capitalGain`     | `required`, `min(0)`    |
| bonus              | `calc.bonus`           | `required`, `min(0)`    |
| retirementAnnuity  | `calc.retirementAnnuity` | `required`, `min(0)`  |
| taxAlreadyPaid     | `calc.taxAlreadyPaid`  | `required`, `min(0)`    |
| age                | `calc.age`             | `required`, `min(0)`    |

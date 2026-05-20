# Data Model: View Calculation

**Feature**: 005-view-calculation
**Date**: 2026-05-20

---

## Data Source

Existing `TaxCalculation` interface (`src/app/models/tax-calculation.model.ts`) — no new model needed.

---

## Display Mapping

### Inputs Section

| Label                | Field              | Format        |
|----------------------|--------------------|---------------|
| Description          | description        | Plain text    |
| Salary               | salary             | ZAR currency  |
| Interest Income      | interestIncome     | ZAR currency  |
| Dividend             | dividend           | ZAR currency  |
| Capital Gain         | capitalGain        | ZAR currency  |
| Bonus                | bonus              | ZAR currency  |
| Retirement Annuity   | retirementAnnuity  | ZAR currency  |
| Tax Already Paid     | taxAlreadyPaid     | ZAR currency  |
| Age                  | age                | Plain number  |
| Date Saved           | createdAt          | dd MMM yyyy   |

### Tax Breakdown Section

| Label                | Field              | Format        |
|----------------------|--------------------|---------------|
| Total Gross Income   | totalGrossIncome   | ZAR currency  |
| Total Deductions     | totalDeductions    | ZAR currency  |
| Net Taxable Income   | netTaxableIncome   | ZAR currency  |
| Tax Before Rebate    | taxBeforeRebate    | ZAR currency  |
| Rebate               | rebate             | ZAR currency  |
| **Final Tax Liability** | finalTaxLiability | ZAR currency (highlighted) |

---

## Component State

| Signal      | Type                        | Initial | Description              |
|-------------|-----------------------------|---------|--------------------------|
| `calc`      | `signal<TaxCalculation\|null>` | `null`  | Loaded calculation       |
| `loading`   | `signal<boolean>`           | `true`  | In-flight indicator      |
| `error`     | `signal<string\|null>`      | `null`  | API error message        |

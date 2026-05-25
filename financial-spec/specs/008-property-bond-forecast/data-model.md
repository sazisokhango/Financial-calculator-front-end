# Data Model: Property Bond Forecast

**Feature**: 008-property-bond-forecast | **Date**: 2026-05-22

---

## BondMonthlyProjection (nested type)

Defined in `property-bond.model.ts`.

```typescript
export interface BondMonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyPayment: number;
  interestCharged: number;
  principalPaid: number;
  endingBalance: number;
}
```

---

## BondForecastResult (nested type)

Defined in `property-bond.model.ts`.

```typescript
export interface BondForecastResult {
  totalLoanAmount: number;
  totalRepayments: number;
  totalInterestPaid: number;
  remainingBalance: number;
  estimatedPayoffMonth: number;
  fullyPaid: boolean;
}
```

---

## PropertyBond (response)

File: `src/app/models/property-bond.model.ts`

```typescript
export interface BondMonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyPayment: number;
  interestCharged: number;
  principalPaid: number;
  endingBalance: number;
}

export interface BondForecastResult {
  totalLoanAmount: number;
  totalRepayments: number;
  totalInterestPaid: number;
  remainingBalance: number;
  estimatedPayoffMonth: number;
  fullyPaid: boolean;
}

export interface PropertyBond {
  id: number;
  userEmail: string;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  interestRate: number;
  forecastResults: BondForecastResult;
  monthlyProjection: BondMonthlyProjection[];
}
```

---

## PropertyBondRequest (request body)

File: `src/app/models/property-bond-request.model.ts`

```typescript
export interface PropertyBondRequest {
  userEmail: string;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  interestRate: number;
}
```

---

## Validation Rules (form → model mapping)

| Field               | Form Validator                                      | Model Field           | Error Message                    |
|---------------------|-----------------------------------------------------|-----------------------|----------------------------------|
| title               | `Validators.required`                               | `title`               | "Title is required"              |
| description         | none                                                | `description`         | —                                |
| initialAmount       | `Validators.required, Validators.min(1)`            | `initialAmount`       | "Must be greater than 0"         |
| monthlyContribution | `Validators.required, Validators.min(1)`            | `monthlyContribution` | "Must be greater than 0"         |
| termMonths          | `Validators.required, Validators.min(1)`            | `termMonths`          | "Must be greater than 0"         |
| interestRate        | `Validators.required, Validators.min(0), Validators.max(100)` | `interestRate`  | "Must be between 0 and 100"      |

---

## Affected Existing Files

| File | Change |
|------|--------|
| `src/app/dashboard/dashboard.component.ts` | `activeTab` signal type extended to `'tax' \| 'investments' \| 'bonds'`; new `bonds` signal of type `PropertyBond[]`; `bondsError` signal; data loading strategy changed (see research.md) |
| `src/app/dashboard/dashboard.component.html` | Third tab added; bond cards section added |
| `src/app/app.routes.ts` | Three new bond routes added |

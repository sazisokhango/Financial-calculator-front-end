# Data Model: Investment Forecast

**Feature**: 007-investment-forecast | **Date**: 2026-05-21

---

## MonthlyProjection (nested type)

Defined in `investment-forecast.model.ts`.

```typescript
export interface MonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyContribution: number;
  interestEarned: number;
  endingBalance: number;
}
```

---

## InvestmentForecast (response)

File: `src/app/models/investment-forecast.model.ts`

```typescript
export interface MonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyContribution: number;
  interestEarned: number;
  endingBalance: number;
}

export interface InvestmentForecast {
  id: number;
  userId: number;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  annualInterestRate: number;
  finalProjectedValue: number;
  totalContributions: number;
  totalInterestEarned: number;
  roiPercentage: number;
  averageMonthlyGrowth: number;
  monthlyProjections: MonthlyProjection[];
  createdAt: string;
  updatedAt: string;
}
```

---

## InvestmentForecastRequest (request body)

File: `src/app/models/investment-forecast-request.model.ts`

```typescript
export interface InvestmentForecastRequest {
  userId: number;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  annualInterestRate: number;
}
```

---

## Validation Rules (form → model mapping)

| Field               | Form Validator                        | Model Field           |
|---------------------|---------------------------------------|-----------------------|
| title               | `Validators.required`                 | `title`               |
| description         | none                                  | `description`         |
| initialAmount       | `Validators.required, Validators.min(0)` | `initialAmount`    |
| monthlyContribution | `Validators.required, Validators.min(0)` | `monthlyContribution` |
| termMonths          | `Validators.required, Validators.min(1)` | `termMonths`       |
| annualInterestRate  | `Validators.required, Validators.min(0), Validators.max(100)` | `annualInterestRate` |

---

## Affected Existing Models

No changes to existing models. `DashboardComponent` gains a new `forecasts` signal of type `InvestmentForecast[]`.

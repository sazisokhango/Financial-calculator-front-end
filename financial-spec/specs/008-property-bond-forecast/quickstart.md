# Quickstart: Property Bond Forecast

**Feature**: 008-property-bond-forecast | **Date**: 2026-05-22

---

## Prerequisites

- Node v20 (via nvm): `nvm use 20`
- Backend running at `http://localhost:8080`

## Run Dev Server

```bash
cd /home/saziso/Desktop/Financial-calculator-front-end
npm start
# → http://localhost:4200
```

## Happy Path (manual verification)

1. Open `http://localhost:4200`, select a user from the list.
2. On the Dashboard, click the **"Property Bond Forecast"** tab — URL updates to `?tab=bonds`, no page reload.
3. Click **"New Bond Forecast"** → `/user/:id/bonds/forecast`.
4. Fill in: Title="Family Home Bond", Initial Amount=`1200000`, Monthly Contribution=`12000`, Term=`240`, Interest Rate=`11`.
5. Click **"Calculate Bond Forecast"** — button shows spinner while loading.
6. Result page renders: summary section (Total Loan Amount, Total Repayments, Total Interest Paid, Remaining Balance, Estimated Payoff Month, Fully Paid) and monthly repayment table (240 rows, 6 columns).
7. Click **"Edit"** — form pre-populated with existing values. Change interest rate to `10`, submit.
8. Result page reflects updated values.
9. Click **"Delete"**, confirm — navigated back to Dashboard `?tab=bonds`.
10. Click **"Investment Forecast"** tab — investment cards render, URL is `?tab=investments`. Click **"Tax Calculator"** tab — tax list renders, URL is `?tab=tax`.

## Tab Deep-link Check

Navigate directly to `http://localhost:4200/user/1?tab=bonds` — Property Bond Forecast tab must be active and bond forecasts loaded without interaction.

## Monetary Formatting Check

All currency values (R 1,200,000.00 style) on the result page and the repayment table must use South African Rand format.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/models/property-bond.model.ts` | `PropertyBond`, `BondForecastResult`, `BondMonthlyProjection` interfaces |
| `src/app/models/property-bond-request.model.ts` | `PropertyBondRequest` interface |
| `src/app/services/bond.service.ts` | HTTP service for all 5 bond endpoints |
| `src/app/dashboard/dashboard.component.ts` | Modified: 3rd tab, bonds signal, switchMap loading strategy |
| `src/app/bond-forecast/bond-forecast.component.ts` | New bond forecast form |
| `src/app/view-bond/view-bond.component.ts` | Bond result page + monthly repayment table |
| `src/app/edit-bond/edit-bond.component.ts` | Edit bond forecast form |
| `src/app/app.routes.ts` | 3 new bond routes added |

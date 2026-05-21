# Quickstart: Investment Forecast

**Feature**: 007-investment-forecast | **Date**: 2026-05-21

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
2. On the Dashboard, click the **"Investment Forecast"** tab — URL updates to `?tab=investments`, no page reload.
3. Click **"New Forecast"** → `/user/:id/investments/forecast`.
4. Fill in: Title, Initial Amount `10000`, Monthly Contribution `2000`, Term `60`, Interest Rate `10`.
5. Click **"Calculate Forecast"** — button shows spinner while loading.
6. Result page renders: summary section (Final Projected Value, Total Contributions, Total Interest Earned, ROI %, Avg Monthly Growth) and monthly projection table (60 rows).
7. Click **"Edit"** — form pre-populated with existing values. Change interest rate to `8`, submit.
8. Result page reflects updated values.
9. Click **"Delete"**, confirm — navigated back to Dashboard `?tab=investments`.
10. Click **"Tax Calculator"** tab — tax calculations list renders, URL is `?tab=tax`.

## Tab Deep-link Check

Navigate directly to `http://localhost:4200/user/1?tab=investments` — Investment Forecast tab must be active and forecasts loaded without interaction.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/models/investment-forecast.model.ts` | `InvestmentForecast` + `MonthlyProjection` interfaces |
| `src/app/models/investment-forecast-request.model.ts` | `InvestmentForecastRequest` interface |
| `src/app/services/investment.service.ts` | HTTP service for all 5 investment endpoints |
| `src/app/dashboard/dashboard.component.ts` | Modified: tab signal, forecasts signal, forkJoin with investments |
| `src/app/investment-forecast/investment-forecast.component.ts` | New forecast form |
| `src/app/view-investment/view-investment.component.ts` | Forecast result + monthly table |
| `src/app/edit-investment/edit-investment.component.ts` | Edit forecast form |
| `src/app/app.routes.ts` | 3 new routes added |

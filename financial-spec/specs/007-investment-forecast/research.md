# Research: Investment Forecast

**Feature**: 007-investment-forecast | **Date**: 2026-05-21

---

## Decision 1: Tab Navigation Strategy

**Decision**: Use Angular Router query parameters (`?tab=tax` | `?tab=investments`) with `ActivatedRoute.queryParams` observable to drive tab state in `DashboardComponent`.

**Rationale**: Meets Constitution Section VI exactly. Query params are bookmarkable, support deep-linking, and update the URL without a page reload. The `queryParamsHandling: 'merge'` option on `[queryParams]` bindings preserves the `:id` route param when switching tabs.

**Alternatives considered**:
- Component-level boolean signal (`showInvestments = signal(false)`): rejected — breaks deep-linking and back-button behaviour.
- Child routes with `<router-outlet>`: rejected — requires structural change to all existing dashboard routes and violates YAGNI for this release.

---

## Decision 2: Dashboard Data Loading

**Decision**: Load user profile, tax calculations, and investment forecasts together in a single `forkJoin([user$, tax$, investments$])` on `ngOnInit`, regardless of which tab is active.

**Rationale**: Simplest implementation — avoids conditional lazy-loading logic and keeps the component reactive to a single loading/error signal pair. Tab switch is instant (data already in memory). The dashboard already uses `forkJoin` for user + tax; extending it to three observables follows the same pattern.

**Alternatives considered**:
- Lazy-load investments only when the investments tab is first activated: more complex, requires tracking "has loaded" state per tab, not worth the added complexity for the data volumes expected.

---

## Decision 3: New Models

**Decision**: Create two new TypeScript interfaces:
- `src/app/models/investment-forecast.model.ts` → `InvestmentForecast` (response shape including `monthlyProjections: MonthlyProjection[]`)
- `src/app/models/investment-forecast-request.model.ts` → `InvestmentForecastRequest`
- `MonthlyProjection` interface is defined in `investment-forecast.model.ts` (co-located, not a separate file — it is only ever used as a nested type of `InvestmentForecast`).

**Rationale**: Mirrors the pattern of `tax-calculation.model.ts` + `tax-calculation-request.model.ts`. Keeps request and response shapes separate for clarity.

---

## Decision 4: New Service

**Decision**: Create `src/app/services/investment.service.ts` with five methods matching the five controller endpoints. Error mapping follows the same `catchError → throwError` pattern as `TaxService`.

**Rationale**: Constitution Section IV requires one service per API resource. `investment.service.ts` is the single gateway for `GET /api/investments?userId`, `GET /api/investments/{id}`, `POST /api/investments/forecast`, `PUT /api/investments/{id}`, `DELETE /api/investments/{id}`.

---

## Decision 5: New Components

**Decision**: Three new standalone components following existing naming conventions:
- `src/app/investment-forecast/investment-forecast.component.ts` — new forecast form
- `src/app/view-investment/view-investment.component.ts` — result page + monthly table
- `src/app/edit-investment/edit-investment.component.ts` — edit form (reuses same form group as new form, pre-populated via `patchValue`)

**Rationale**: Mirrors the tax flow: `calculate` → `view-calculation` → `edit-calculation`. Consistent naming and separation of concerns.

---

## Decision 6: Monthly Projection Table Rendering

**Decision**: Render the full `monthlyProjections` array with `@for` directly in the template — no pagination, no virtual scroll.

**Rationale**: The spec assumption states the backend returns all rows and the front-end renders them all. For typical term lengths (12–360 months), this is well within DOM performance limits.

---

## Decision 7: userId in Request Body

**Decision**: `InvestmentForecastRequest.userId` is typed as `number` (matching `GET /api/investments?userId={id}` which uses `Long userId` server-side). Sourced from the URL `:id` parameter, consistent with how `TaxCalculationRequest.userId` is sourced.

**Rationale**: The backend controller uses `Long userId` for the GET endpoint; the POST request body DTO is assumed to carry the same type. Using `number` (not `string`) aligns with how the URL param is parsed (`Number(route.snapshot.paramMap.get('id'))`).

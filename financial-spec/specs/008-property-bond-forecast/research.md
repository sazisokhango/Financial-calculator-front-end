# Research: Property Bond Forecast

**Feature**: 008-property-bond-forecast | **Date**: 2026-05-22

---

## Decision 1: Tab Navigation Strategy

**Decision**: Add `?tab=bonds` as a third valid value for the existing dashboard tab query parameter. The `activeTab` signal type is extended from `'tax' | 'investments'` to `'tax' | 'investments' | 'bonds'`. The `queryParams` subscription logic is updated to handle the third case.

**Rationale**: Follows the identical pattern established by feature 007 for `?tab=investments`. No structural change to the router is required. `queryParamsHandling: 'merge'` on all tab links continues to preserve the `:id` route param.

**Alternatives considered**:
- Component-level boolean: rejected — breaks deep-linking, same reason as 007.
- Child routes with `<router-outlet>`: rejected — requires structural change to all dashboard routes.

---

## Decision 2: Dashboard Data Loading — userEmail Dependency

**Decision**: Change the dashboard loading strategy from a flat `forkJoin([user$, tax$, investments$])` to a chained `userService.getById().pipe(switchMap(user => forkJoin([tax$, investments$, bonds$])))`. The user object is set on the signal before the inner `forkJoin` runs. Bond data is fetched via `bondService.getAllByUser(user.email)`.

**Rationale**: Bond data requires `userEmail`, which is only known after the `User` is loaded. The simplest correct approach is to load the user first (via `switchMap`), then fan out to load tax calculations, investment forecasts, and bond forecasts in parallel. The inner `forkJoin` preserves parallel loading for the three data sets.

**Alternatives considered**:
- Keep flat `forkJoin` and derive email from a pre-loaded source (e.g. localStorage): rejected — no such source exists; the app does not cache user data client-side.
- Load bonds lazily when the bonds tab is first activated: more complex (requires "has-loaded" state tracking per tab), not worth added complexity for the expected data volumes.
- Add bonds to the existing flat `forkJoin` using a placeholder email: rejected — cannot know email before user is loaded.

---

## Decision 3: New Models

**Decision**: Create two new TypeScript model files:
- `src/app/models/property-bond.model.ts` — `PropertyBond` response (with nested `BondForecastResult` and `BondMonthlyProjection`)
- `src/app/models/property-bond-request.model.ts` — `PropertyBondRequest`

All three interfaces (`BondMonthlyProjection`, `BondForecastResult`, `PropertyBond`) are co-located in a single file because `BondMonthlyProjection` and `BondForecastResult` are only ever used as nested types of `PropertyBond`.

**Rationale**: Mirrors the pattern established in 007 (`investment-forecast.model.ts` + `investment-forecast-request.model.ts`).

---

## Decision 4: New Service

**Decision**: Create `src/app/services/bond.service.ts` with five methods:
- `getAllByUser(userEmail: string)` → `GET /api/bonds?userEmail={email}`
- `getById(id: number)` → `GET /api/bonds/{id}`
- `create(payload: PropertyBondRequest)` → `POST /api/bonds`
- `update(id: number, payload: PropertyBondRequest)` → `PUT /api/bonds/{id}`
- `delete(id: number)` → `DELETE /api/bonds/{id}`

All methods use `catchError → throwError` with `err.error?.message` fallback.

**Rationale**: Same single-gateway-per-resource pattern as `TaxService` and `InvestmentService`. Note the key difference from `InvestmentService`: the GET-all endpoint uses `userEmail: string` (not `userId: number`) because the backend `PropertyBondController` is keyed on email.

---

## Decision 5: New Components

**Decision**: Three new standalone components:
- `src/app/bond-forecast/bond-forecast.component.ts` — new bond form
- `src/app/view-bond/view-bond.component.ts` — result page with repayment table
- `src/app/edit-bond/edit-bond.component.ts` — edit form

**Rationale**: Mirrors the two-tier pattern established by the tax and investment flows (`calculate` → `view-calculation` → `edit-calculation`, `investment-forecast` → `view-investment` → `edit-investment`). Consistent naming.

---

## Decision 6: userEmail in Request Body

**Decision**: `PropertyBondRequest.userEmail` is typed as `string` and sourced from `user().email` on the dashboard's loaded `User` signal, passed through the route state or re-read from the service. In the `bond-forecast` and `edit-bond` components, `userEmail` is obtained by calling `userService.getById(userId)` on `ngOnInit` and storing it in a component signal — it is never a form field.

**Rationale**: The backend `PropertyBondRequest` has `@NotBlank @Email String userEmail`. The frontend must supply it without exposing it as a user-editable input. Mirroring how `userId` is sourced from the URL param in the investment feature.

---

## Decision 7: Monthly Repayment Table Rendering

**Decision**: Render the full `monthlyProjection` array with `@for` directly in the template — no pagination, no virtual scroll.

**Rationale**: Same assumption as 007 — for typical term lengths (12–360 months) this is well within browser DOM performance limits. The backend returns all rows; the front-end renders them all.

---

## Decision 8: fullyPaid Display

**Decision**: The `fullyPaid: boolean` field from `BondForecastResult` is displayed as "Yes" or "No" using `@if / @else` in the template.

**Rationale**: A boolean field rendered as text is the clearest presentation for a summary table. No special pipe or formatter needed.

# Tasks: Investment Forecast

**Input**: Design documents from `specs/007-investment-forecast/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Spec files are included (Jasmine/TestBed) — no TDD-first approach was requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: New models and service that ALL user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Angular will not compile if service or component tasks reference types that don't exist. Complete this phase first.

- [x] T001 [P] Create `InvestmentForecast` and `MonthlyProjection` interfaces in `src/app/models/investment-forecast.model.ts` — fields: id, userId, title, description, initialAmount, monthlyContribution, termMonths, annualInterestRate, finalProjectedValue, totalContributions, totalInterestEarned, roiPercentage, averageMonthlyGrowth, monthlyProjections (MonthlyProjection[]), createdAt, updatedAt
- [x] T002 [P] Create `InvestmentForecastRequest` interface in `src/app/models/investment-forecast-request.model.ts` — fields: userId (number), title, description, initialAmount, monthlyContribution, termMonths, annualInterestRate
- [x] T003 Create `InvestmentService` in `src/app/services/investment.service.ts` with five methods: `getAllByUser(userId)` → `GET ${environment.apiBaseUrl}/investments?userId=`, `getById(id)` → `GET .../investments/{id}`, `create(payload)` → `POST .../investments/forecast`, `update(id, payload)` → `PUT .../investments/{id}`, `delete(id)` → `DELETE .../investments/{id}` — all use `catchError(err => throwError(() => new Error(err.error?.message ?? 'fallback')))`
- [x] T004 Create `src/app/services/investment.service.spec.ts` — basic TestBed scaffold with `HttpClientTestingModule`

**Checkpoint**: Models and service compile cleanly. All user stories can now proceed.

---

## Phase 2: User Story 1 — Calculate Investment Forecast (Priority: P1) 🎯 MVP

**Goal**: User can navigate to the new forecast form, fill in investment details, submit, and see the calculated result page with summary and monthly projection table.

**Independent Test**: Navigate to `/user/1/investments/forecast`, fill title="Test", initialAmount=10000, monthlyContribution=2000, termMonths=12, annualInterestRate=10 — submit and verify result page renders summary fields and a 12-row projection table.

- [x] T005 Create `src/app/investment-forecast/investment-forecast.component.ts` — standalone component; `FormBuilder.group` with 6 controls (title: `[required]`, description: `[]`, initialAmount: `[required, min(0)]`, monthlyContribution: `[required, min(0)]`, termMonths: `[required, min(1)]`, annualInterestRate: `[required, min(0), max(100)]`); `userId` read from `ActivatedRoute` params on `ngOnInit`; `submitting = signal(false)`; `error = signal<string|null>(null)`; `onSubmit()` builds `InvestmentForecastRequest` with `userId` from route, calls `investmentService.create()`, navigates to `/user/:id/investments/:forecastId` on 201, sets error on failure
- [x] T006 Create `src/app/investment-forecast/investment-forecast.component.html` — header "New Investment Forecast" with "Back" link to `['/user', userId]` with `queryParams: {tab:'investments'}`; Reactive Form with all 6 fields; inline validation error `<p>` below each field — show `@if (form.get('field')?.touched && form.get('field')?.errors?.['required'])` for title; for numeric fields show `required`, `min` ("cannot be negative" or "must be > 0"), and `max` ("must be between 0 and 100") errors independently using separate `@if` blocks per error key; "Calculate Forecast" button disabled during `submitting()` with spinner icon; red error banner `@if (error())`; imports: `ReactiveFormsModule`, `RouterModule`
- [x] T007 [P] Create empty `src/app/investment-forecast/investment-forecast.component.css`
- [x] T008 Create `src/app/investment-forecast/investment-forecast.component.spec.ts` — TestBed scaffold with `ReactiveFormsModule`, `HttpClientTestingModule`, `RouterTestingModule`

**Checkpoint**: InvestmentForecastComponent compiles. Form validation works. Submit calls service.

---

## Phase 3: User Story 2 — View Saved Forecasts on Dashboard Tab (Priority: P1)

**Goal**: Dashboard shows two tabs. "Investment Forecast" tab loads and displays saved forecasts as cards. Switching tabs updates the URL query param without a page reload.

**Independent Test**: Navigate to `/user/1?tab=investments` — Investment Forecast tab must be active and forecasts loaded. Click "Tax Calculator" tab — URL updates to `?tab=tax` and tax list renders. No page reload occurs during either switch.

- [x] T009 Modify `src/app/dashboard/dashboard.component.ts` — add `InvestmentService` injection; add signals: `forecasts = signal<InvestmentForecast[]>([])`, `activeTab = signal<'tax'|'investments'>('tax')`, `forecastsError = signal<string|null>(null)`; subscribe to `ActivatedRoute.queryParams` in `ngOnInit` to update `activeTab` signal (default `'tax'` when param absent); extend existing `forkJoin` to include `investmentService.getAllByUser(userId)` as third observable and set `forecasts` signal in the next handler; add methods: `newForecast()` → `router.navigate(['/user', userId, 'investments', 'forecast'])`, `viewForecast(id)` → navigate to view page, `deleteForecast(id)` → confirm dialog + `investmentService.delete(id)` + filter from `forecasts` signal on success
- [x] T010 Modify `src/app/dashboard/dashboard.component.html` — add tab bar below header (two buttons: "Tax Calculator" and "Investment Forecast") each using `[routerLink]="['/user', userId]"` with `[queryParams]="{tab:'tax'}"` / `[queryParams]="{tab:'investments'}"` and `queryParamsHandling="merge"`; active tab styled with `indigo-600` underline/background; update header action button to show "New Calculation" when `activeTab()==='tax'` and "New Forecast" when `activeTab()==='investments'`; wrap existing calculations list in `@if (activeTab() === 'tax')`; add `@if (activeTab() === 'investments')` section that includes: (a) a red error banner `@if (forecastsError())` showing `forecastsError()` message, (b) forecast cards (title, truncated description, `createdAt | date:'dd MMM yyyy'`, `finalProjectedValue | currency:'ZAR'`, delete icon with `$event.stopPropagation()`), (c) empty state when `forecasts().length === 0`

**Checkpoint**: Both tabs switch without page reload. Forecast cards render. Empty states work. Delete from dashboard works.

---

## Phase 4: User Story 3 — View Forecast Result (Priority: P2)

**Goal**: Clicking a saved forecast card opens the result page showing all input values, the forecast summary section, and the full month-by-month projection table.

**Independent Test**: Click a forecast card from the dashboard → result page at `/user/1/investments/1` renders all 5 summary fields and all N rows in the projection table with correctly formatted ZAR monetary values.

- [x] T011 Create `src/app/view-investment/view-investment.component.ts` — standalone; `forecast = signal<InvestmentForecast|null>(null)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit` reads `:id` and `:forecastId` from route, calls `investmentService.getById(forecastId)`, sets signals; `edit()` → navigate to edit page; `back()` → navigate to `/user/:id` with `queryParams:{tab:'investments'}`; `deleteForecast()` → confirm + delete + navigate to `/user/:id?tab=investments`; imports: `CurrencyPipe`, `DatePipe`, `RouterModule`
- [x] T012 Create `src/app/view-investment/view-investment.component.html` — loading spinner `@if (loading())`; error banner `@if (error())`; `@if (forecast())`: inputs section (title, description, initialAmount, monthlyContribution, termMonths, annualInterestRate formatted), forecast summary section (5 fields all monetary with `CurrencyPipe 'ZAR'` and `roiPercentage` as percentage), monthly projection table `@for (row of forecast()!.monthlyProjections; track row.month)` with 5 columns (Month, Starting Balance, Monthly Contribution, Interest Earned, Ending Balance) monetary values formatted; action buttons: "Back", "Edit" (indigo), "Delete" (red)
- [x] T013 [P] Create empty `src/app/view-investment/view-investment.component.css`
- [x] T014 Create `src/app/view-investment/view-investment.component.spec.ts` — TestBed scaffold

**Checkpoint**: View page loads forecast data, renders summary and all projection table rows.

---

## Phase 5: User Story 4 — Edit Forecast (Priority: P2)

**Goal**: User can edit an existing forecast, recalculate, and see the updated result.

**Independent Test**: Navigate to `/user/1/investments/1/edit` — form pre-populated with existing values. Change `annualInterestRate` to `8`, submit → result page shows updated figures.

- [x] T015 Create `src/app/edit-investment/edit-investment.component.ts` — standalone; same `FormBuilder.group` as `InvestmentForecastComponent` (identical 6 controls + validators); `ngOnInit`: reads `:id` and `:forecastId` from route, calls `investmentService.getById(forecastId)`, patches form with response via `form.patchValue({...})`; `submitting = signal(false)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `onSubmit()` builds `InvestmentForecastRequest` with `userId` from route, calls `investmentService.update(forecastId, payload)`, navigates to view page on success; `cancel()` navigates to `/user/:id/investments/:forecastId`
- [x] T016 Create `src/app/edit-investment/edit-investment.component.html` — identical layout to `investment-forecast.component.html` including the same per-field inline validation error blocks (`required`, `min`, `max` per numeric field); header reads "Edit Investment Forecast"; submit button reads "Save Changes"; adds "Cancel" link below form navigating to view page; loading spinner while form is being pre-populated
- [x] T017 [P] Create empty `src/app/edit-investment/edit-investment.component.css`
- [x] T018 Create `src/app/edit-investment/edit-investment.component.spec.ts` — TestBed scaffold

**Checkpoint**: Edit form pre-populates correctly. Submit calls `update()`. Cancel returns to view page.

---

## Phase 6: Route Registration

**Purpose**: Register investment routes in two steps so the MVP (Phases 1–3) can compile and run independently before the P2 components exist.

- [x] T019a Add the MVP route to `src/app/app.routes.ts` — import `InvestmentForecastComponent`; add: `{ path: 'user/:id/investments/forecast', component: InvestmentForecastComponent }`. Run after T005 (Phase 2).
- [x] T019b Add the P2 routes to `src/app/app.routes.ts` — import `ViewInvestmentComponent`, `EditInvestmentComponent`; add: `{ path: 'user/:id/investments/:forecastId', component: ViewInvestmentComponent }`, `{ path: 'user/:id/investments/:forecastId/edit', component: EditInvestmentComponent }`. Run after T011 (Phase 4) and T015 (Phase 5).

**Checkpoint (after T019a)**: `npm start` compiles. New forecast form route is navigable. MVP is functional.
**Checkpoint (after T019b)**: All 3 investment routes are navigable. Full feature complete.

---

## Phase 7: Polish & Validation

**Purpose**: Full end-to-end validation per quickstart.md.

- [ ] T020 Run full quickstart.md happy path (10 steps): select user → switch to Investment Forecast tab → new forecast form → submit → result page (summary + table) → edit → updated result → delete → back to dashboard tab → switch to Tax Calculator tab. Verify no page reload on tab switch and deep-link to `?tab=investments` works.
- [ ] T021 [P] Verify all monetary values across dashboard cards, result page summary, and projection table are formatted as `R #,###.##` using `en-ZA` locale

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately
- **Phase 2 (US1)**: Requires Phase 1 complete (needs models + service)
- **Phase 3 (US2)**: Requires Phase 1 complete (needs `InvestmentForecast` type + service)
- **Phase 4 (US3)**: Requires Phase 1 complete
- **Phase 5 (US4)**: Requires Phase 1 complete
- **Phase 6 (Routes)**: T019a requires Phase 2 complete; T019b requires Phases 4 and 5 complete
- **Phase 7 (Polish)**: Requires Phase 6 complete (routes must be live)

### User Story Dependencies

- **US1 (P1)**: Can start immediately after Phase 1 — no dependency on other stories
- **US2 (P1)**: Can start immediately after Phase 1 — modifies dashboard, does not depend on US1 components
- **US3 (P2)**: Can start immediately after Phase 1 — independent of US1/US2
- **US4 (P2)**: Can start immediately after Phase 1 — independent of US1/US2/US3

> US1, US2, US3, US4 can all be developed in parallel once Phase 1 is complete. Route registration (Phase 6) is the integration point.

### Within Each User Story

- Component `.ts` before `.html` (template references signals/methods defined in class)
- `.css` and `.spec.ts` are always independent [P] tasks

---

## Parallel Execution Examples

### After Phase 1 — All stories can start in parallel:

```
Developer A → Phase 2 (US1): T005, T006, T007, T008
Developer B → Phase 3 (US2): T009, T010
Developer C → Phase 4 (US3): T011, T012, T013, T014
Developer D → Phase 5 (US4): T015, T016, T017, T018
```

### Within Phase 2 (US1):

```
Parallel: T007 (empty CSS)
Sequential: T005 → T006 → T008
```

### Within Phase 4 (US3):

```
Parallel: T013 (empty CSS)
Sequential: T011 → T012 → T014
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 — both P1)

1. Complete Phase 1: Models + Service
2. Complete Phase 2: InvestmentForecastComponent
3. Complete T019a: Register InvestmentForecast route only
4. Complete Phase 3: Dashboard tab changes
5. **STOP and VALIDATE**: New forecast form submits, tab navigation works, dashboard shows saved forecasts

### Full Delivery (add P2 stories)

6. Complete Phase 4: ViewInvestmentComponent
7. Complete Phase 5: EditInvestmentComponent
8. Complete T019b: Register View + Edit investment routes
9. Complete Phase 7: Polish & validation

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| Phase 1 — Foundational | T001–T004 | — | Blocker |
| Phase 2 — Calculate Forecast | T005–T008 | US1 | P1 🎯 |
| Phase 3 — Dashboard Tab | T009–T010 | US2 | P1 |
| Phase 4 — View Result | T011–T014 | US3 | P2 |
| Phase 5 — Edit Forecast | T015–T018 | US4 | P2 |
| Phase 6 — Routes (MVP) | T019a | — | Integration |
| Phase 6 — Routes (P2) | T019b | — | Integration |
| Phase 7 — Polish | T020–T021 | — | QA |
| **Total** | **22 tasks** | | |

---

## Notes

- `[P]` tasks = different files, no shared dependency — safe to run in parallel
- All component `.css` files are empty; create with a single write
- Spec files are TestBed scaffolds only — no behaviour tests unless requested
- `userId` is always `Number(route.snapshot.paramMap.get('id'))` — never from user input
- All monetary display uses `CurrencyPipe` with `'ZAR':'symbol':'1.2-2'` and `LOCALE_ID: 'en-ZA'`
- Commit after each phase or logical group before moving to the next

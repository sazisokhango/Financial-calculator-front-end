# Tasks: Property Bond Forecast

**Input**: Design documents from `specs/008-property-bond-forecast/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅ | quickstart.md ✅

**Tests**: Spec files are included (Jasmine/TestBed scaffolds) — no TDD-first approach was requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Include exact file paths in descriptions

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: New models and service that ALL user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Angular will not compile if service or component tasks reference types that don't exist. Complete this phase first.

- [x] T001 [P] Create `PropertyBond`, `BondForecastResult`, and `BondMonthlyProjection` interfaces in `src/app/models/property-bond.model.ts` — `BondMonthlyProjection` fields: month (number), startingBalance (number), monthlyPayment (number), interestCharged (number), principalPaid (number), endingBalance (number); `BondForecastResult` fields: totalLoanAmount (number), totalRepayments (number), totalInterestPaid (number), remainingBalance (number), estimatedPayoffMonth (number), fullyPaid (boolean); `PropertyBond` fields: id (number), userEmail (string), title (string), description (string), initialAmount (number), monthlyContribution (number), termMonths (number), interestRate (number), forecastResults (BondForecastResult), monthlyProjection (BondMonthlyProjection[])
- [x] T002 [P] Create `PropertyBondRequest` interface in `src/app/models/property-bond-request.model.ts` — fields: userEmail (string), title (string), description (string), initialAmount (number), monthlyContribution (number), termMonths (number), interestRate (number)
- [x] T003 Create `BondService` in `src/app/services/bond.service.ts` — `@Injectable({ providedIn: 'root' })`; inject `HttpClient`; five methods: `getAllByUser(userEmail: string)` → `GET ${environment.apiBaseUrl}/bonds?userEmail={email}` with `params: { userEmail }` returning `Observable<PropertyBond[]>`; `getById(id: number)` → `GET .../bonds/{id}` returning `Observable<PropertyBond>`; `create(payload: PropertyBondRequest)` → `POST .../bonds` returning `Observable<PropertyBond>`; `update(id: number, payload: PropertyBondRequest)` → `PUT .../bonds/{id}` returning `Observable<PropertyBond>`; `delete(id: number)` → `DELETE .../bonds/{id}` returning `Observable<void>`; all use `catchError(err => throwError(() => new Error(err.error?.message ?? 'fallback')))`
- [x] T004 [P] Create `src/app/services/bond.service.spec.ts` — basic TestBed scaffold with `HttpClientTestingModule`

**Checkpoint**: Models and service compile cleanly. All user stories can now proceed.

---

## Phase 2: User Story 1 — Calculate Bond Forecast (Priority: P1) 🎯 MVP

**Goal**: User can navigate to the new bond forecast form, fill in bond details, submit, and see the calculated result page with summary and monthly repayment table.

**Independent Test**: Navigate to `/user/1/bonds/forecast`, fill title="Family Home Bond", initialAmount=1200000, monthlyContribution=12000, termMonths=240, interestRate=11 — submit and verify result page renders all 6 summary fields and a 240-row repayment table.

- [x] T005 [US1] Create `src/app/bond-forecast/bond-forecast.component.ts` — standalone; inject `FormBuilder`, `BondService`, `UserService`, `ActivatedRoute`, `Router`; `FormBuilder.group` with 6 controls: title `['', [Validators.required]]`, description `['']`, initialAmount `[null, [Validators.required, Validators.min(1)]]`, monthlyContribution `[null, [Validators.required, Validators.min(1)]]`, termMonths `[null, [Validators.required, Validators.min(1)]]`, interestRate `[null, [Validators.required, Validators.min(0), Validators.max(100)]]`; `userId = Number(route.snapshot.paramMap.get('id'))`; `userEmail = signal<string>('')`, `submitting = signal(false)`, `error = signal<string|null>(null)`, `loading = signal(true)`; `ngOnInit()` calls `userService.getById(userId)` — on success: `userEmail.set(user.email)`, `loading.set(false)`; on error: `error.set(err.message)`, `loading.set(false)`; `onSubmit()`: guard `if (this.form.invalid) return`; set `submitting(true)`; build `PropertyBondRequest` with `userEmail()` from signal; call `bondService.create(payload)` — on success navigate to `/user/${userId}/bonds/${bond.id}`, on error set `error` signal and `submitting.set(false)`; imports: `ReactiveFormsModule`, `RouterModule`
- [x] T006 [US1] Create `src/app/bond-forecast/bond-forecast.component.html` — header "New Bond Forecast" with "Back" link `[routerLink]="['/user', userId]" [queryParams]="{tab:'bonds'}"`; loading spinner `@if (loading())`; `@if (!loading())`: Reactive Form with 6 fields (Title text input, Description textarea, Initial Amount number input, Monthly Contribution number input, Term (Months) number input, Interest Rate (%) number input); inline validation `<p class="text-red-500 text-xs mt-1">` below each field — Title: `@if (form.get('title')?.touched && form.get('title')?.errors?.['required'])` "Title is required"; Initial Amount: separate `@if` for `required` + separate `@if` for `min` "Must be greater than 0"; Monthly Contribution: same pattern; Term: same pattern; Interest Rate: `required` "Interest rate is required", `min` "Must be 0 or greater", `max` "Must be 100 or less"; "Calculate Bond Forecast" submit button `[disabled]="submitting()"` with `@if (submitting())` spinner and label "Calculating..." / "Calculate Bond Forecast"; red error banner `@if (error())`; imports: `ReactiveFormsModule`, `RouterModule`
- [x] T007 [P] [US1] Create empty `src/app/bond-forecast/bond-forecast.component.css`
- [x] T008 [P] [US1] Create `src/app/bond-forecast/bond-forecast.component.spec.ts` — TestBed scaffold with `ReactiveFormsModule`, `HttpClientTestingModule`, `RouterTestingModule`

**Checkpoint**: BondForecastComponent compiles. Form validation works. Submit calls BondService.create and navigates on success.

---

## Phase 3: User Story 2 — View Saved Bond Forecasts on Dashboard Tab (Priority: P1)

**Goal**: Dashboard shows three tabs. "Property Bond Forecast" tab loads and displays saved bond forecasts as cards. Switching tabs updates the URL query param without a page reload.

**Independent Test**: Navigate to `/user/1?tab=bonds` — Property Bond Forecast tab must be active and bond cards loaded. Click "Tax Calculator" tab — URL updates to `?tab=tax`. Click "Investment Forecast" tab — URL updates to `?tab=investments`. No page reload on any switch.

- [x] T009 [US2] Modify `src/app/dashboard/dashboard.component.ts` — add `BondService` injection; add `switchMap` import from `rxjs`; change `activeTab` signal type from `'tax' | 'investments'` to `'tax' | 'investments' | 'bonds'`; update `queryParams` subscription: `this.activeTab.set(params['tab'] === 'investments' ? 'investments' : params['tab'] === 'bonds' ? 'bonds' : 'tax')`; add `bonds = signal<PropertyBond[]>([])` and `bondsError = signal<string|null>(null)`; replace existing `forkJoin([user$, tax$, investments$])` with `this.userService.getById(this.userId).pipe(switchMap(user => { this.user.set(user); return forkJoin([this.taxService.getAllByUser(this.userId), this.investmentService.getAllByUser(this.userId), this.bondService.getAllByUser(user.email)]); })).subscribe({ next: ([calcs, forecasts, bonds]) => { this.calculations.set(calcs); this.forecasts.set(forecasts); this.bonds.set(bonds); this.loading.set(false); }, error: (err: Error) => { this.error.set(err.message); this.loading.set(false); } })`; add `newBondForecast()` → `this.router.navigate(['/user', this.userId, 'bonds', 'forecast'])`; add `deleteBond(id: number)` → `if (!confirm('Delete this bond forecast?')) return; this.bondService.delete(id).subscribe({ next: () => this.bonds.update(b => b.filter(x => x.id !== id)), error: (err: Error) => this.bondsError.set(err.message) })`; import `PropertyBond` from `'../models/property-bond.model'`
- [x] T010 [US2] Modify `src/app/dashboard/dashboard.component.html` — add third tab `<a [routerLink]="['/user', userId]" [queryParams]="{tab:'bonds'}" queryParamsHandling="merge" class="px-5 py-3 text-sm font-semibold border-b-2 transition-colors" [class.border-white]="activeTab()==='bonds'" [class.text-white]="activeTab()==='bonds'" [class.border-transparent]="activeTab()!=='bonds'" [class.text-indigo-300]="activeTab()!=='bonds'">Property Bond Forecast</a>`; extend header action button to add `@else if (activeTab() === 'bonds')` block with "New Bond Forecast" button calling `(click)="newBondForecast()"`; add `@if (activeTab() === 'bonds')` content section containing: (a) red error banner `@if (bondsError())` showing `bondsError()` message; (b) `@if (bonds().length === 0)` empty-state `<p>` "No bond forecasts yet. Click 'New Bond Forecast' to get started."; (c) `@for (bond of bonds(); track bond.id)` bond cards — card styled like existing forecast cards, clickable via `(click)="router.navigate(['/user', userId, 'bonds', bond.id])"`, showing title, truncated description, `bond.initialAmount | currency:'ZAR':'symbol':'1.2-2'`, and a red delete icon button `(click)="deleteBond(bond.id); $event.stopPropagation()"`

**Checkpoint**: All three tabs switch without page reload. Bond cards render. Empty state works. Delete from dashboard works.

---

## Phase 4: User Story 3 — View Bond Forecast Result (Priority: P2)

**Goal**: Clicking a saved bond forecast card opens the result page showing all input values, the forecast summary, and the full month-by-month repayment table.

**Independent Test**: Click a bond card from the dashboard → result page at `/user/1/bonds/1` renders all 6 summary fields and all rows in the repayment table with correctly formatted ZAR monetary values.

- [x] T011 [US3] Create `src/app/view-bond/view-bond.component.ts` — standalone; inject `BondService`, `ActivatedRoute`, `Router`; `bond = signal<PropertyBond|null>(null)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit`: `userId = Number(route.snapshot.paramMap.get('id'))`, `bondId = Number(route.snapshot.paramMap.get('bondId'))`; call `bondService.getById(bondId)` — on success: `bond.set(result)`, `loading.set(false)`; on error: `error.set(err.message)`, `loading.set(false)`; `edit()` → `router.navigate(['/user', userId, 'bonds', bondId, 'edit'])`; `back()` → `router.navigate(['/user', userId], { queryParams: { tab: 'bonds' } })`; `deleteBond()` → `if (!confirm('Delete this bond forecast?')) return; bondService.delete(bondId).subscribe({ next: () => router.navigate(['/user', userId], { queryParams: { tab: 'bonds' } }), error: (err: Error) => error.set(err.message) })`; imports: `CurrencyPipe`, `RouterModule`
- [x] T012 [US3] Create `src/app/view-bond/view-bond.component.html` — loading spinner `@if (loading())`; error banner `@if (error())`; `@if (bond())`: (1) inputs section — labelled rows for title, description, initialAmount `| currency:'ZAR':'symbol':'1.2-2'`, monthlyContribution `| currency:'ZAR':'symbol':'1.2-2'`, termMonths, interestRate; (2) forecast summary section — labelled rows for totalLoanAmount, totalRepayments, totalInterestPaid, remainingBalance (all `| currency:'ZAR':'symbol':'1.2-2'`), estimatedPayoffMonth (plain number), fullyPaid (`@if (bond()!.forecastResults.fullyPaid) { Yes } @else { No }`); (3) monthly repayment table: `<table>` with `<thead>` (Month, Starting Balance, Monthly Payment, Interest Charged, Principal Paid, Ending Balance) and `<tbody>` using `@for (row of bond()!.monthlyProjection; track row.month)` — all balance/payment columns use `| currency:'ZAR':'symbol':'1.2-2'`; action buttons: "Back" (calls `back()`), "Edit" (indigo, calls `edit()`), "Delete" (red, calls `deleteBond()`)
- [x] T013 [P] [US3] Create empty `src/app/view-bond/view-bond.component.css`
- [x] T014 [P] [US3] Create `src/app/view-bond/view-bond.component.spec.ts` — TestBed scaffold with `HttpClientTestingModule`, `RouterTestingModule`

**Checkpoint**: View page loads bond data, renders summary and all repayment table rows with ZAR formatting.

---

## Phase 5: User Story 4 — Edit Bond Forecast (Priority: P2)

**Goal**: User can edit an existing bond forecast, recalculate, and see the updated result.

**Independent Test**: Navigate to `/user/1/bonds/1/edit` — form pre-populated with existing values. Change `interestRate` to `10`, submit → result page shows updated figures.

- [x] T015 [US4] Create `src/app/edit-bond/edit-bond.component.ts` — standalone; inject `FormBuilder`, `BondService`, `UserService`, `ActivatedRoute`, `Router`; same `FormBuilder.group` as `BondForecastComponent` (identical 6 controls + validators); `userId = Number(route.snapshot.paramMap.get('id'))`, `bondId = Number(route.snapshot.paramMap.get('bondId'))`; `userEmail = signal<string>('')`, `submitting = signal(false)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit`: `forkJoin([bondService.getById(bondId), userService.getById(userId)])` — on success: `form.patchValue({ title: bond.title, description: bond.description, initialAmount: bond.initialAmount, monthlyContribution: bond.monthlyContribution, termMonths: bond.termMonths, interestRate: bond.interestRate })`, `userEmail.set(user.email)`, `loading.set(false)`; on error: `error.set(err.message)`, `loading.set(false)`; `onSubmit()`: guard `if (this.form.invalid) return`; `submitting.set(true)`; build `PropertyBondRequest` with `userEmail()` signal; call `bondService.update(bondId, payload)` — on success navigate to `/user/${userId}/bonds/${bondId}`, on error set `error` and `submitting.set(false)`; `cancel()` → `router.navigate(['/user', userId, 'bonds', bondId])`; imports: `ReactiveFormsModule`, `RouterModule`
- [x] T016 [US4] Create `src/app/edit-bond/edit-bond.component.html` — identical layout to `bond-forecast.component.html` including same per-field inline validation error blocks (separate `@if` per error key: `required`, `min`, `max`); header "Edit Bond Forecast"; loading spinner `@if (loading())`; form wrapped in `@if (!loading())`; submit button "Save Changes" (with "Saving..." during `submitting()`); "Cancel" link to `/user/:id/bonds/:bondId`; red error banner `@if (error())`; imports: `ReactiveFormsModule`, `RouterModule`
- [x] T017 [P] [US4] Create empty `src/app/edit-bond/edit-bond.component.css`
- [x] T018 [P] [US4] Create `src/app/edit-bond/edit-bond.component.spec.ts` — TestBed scaffold with `ReactiveFormsModule`, `HttpClientTestingModule`, `RouterTestingModule`

**Checkpoint**: Edit form pre-populates correctly. Submit calls `bondService.update()`. Cancel returns to view page.

---

## Phase 6: Route Registration

**Purpose**: Register all three bond routes so components are navigable. All three components must exist before this step.

- [x] T019 Add bond routes to `src/app/app.routes.ts` — import `BondForecastComponent` from `'./bond-forecast/bond-forecast.component'`, `ViewBondComponent` from `'./view-bond/view-bond.component'`, `EditBondComponent` from `'./edit-bond/edit-bond.component'`; add three routes after the existing investment routes: `{ path: 'user/:id/bonds/forecast', component: BondForecastComponent }`, `{ path: 'user/:id/bonds/:bondId', component: ViewBondComponent }`, `{ path: 'user/:id/bonds/:bondId/edit', component: EditBondComponent }` — ⚠️ static `bonds/forecast` MUST appear before dynamic `bonds/:bondId` to prevent param capture

**Checkpoint**: `npm start` compiles. All three bond routes are navigable. Full feature complete.

---

## Phase 7: Polish & Validation

**Purpose**: Full end-to-end validation per quickstart.md.

- [ ] T020 Run full quickstart.md happy path (requires backend running at localhost:8080) — 10 steps: select user → switch to Property Bond Forecast tab (`?tab=bonds`) → click "New Bond Forecast" → submit form (title="Family Home Bond", initialAmount=1200000, monthlyContribution=12000, termMonths=240, interestRate=11) → verify result page renders summary + 240-row repayment table → click "Edit" → change interestRate to 10 → submit → verify updated result → click "Delete" + confirm → verify navigated to `?tab=bonds` → switch to Investment Forecast tab → switch to Tax Calculator tab → verify no page reload on any tab switch → deep-link to `/user/:id?tab=bonds` and verify tab activates correctly
- [ ] T021 [P] Verify all monetary values across dashboard bond cards, result page summary (totalLoanAmount, totalRepayments, totalInterestPaid, remainingBalance), and repayment table (startingBalance, monthlyPayment, interestCharged, principalPaid, endingBalance) are formatted as `R #,###.##` using `en-ZA` locale

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately
- **Phase 2 (US1)**: Requires Phase 1 complete (needs models + service)
- **Phase 3 (US2)**: Requires Phase 1 complete (needs `PropertyBond` type + service)
- **Phase 4 (US3)**: Requires Phase 1 complete
- **Phase 5 (US4)**: Requires Phase 1 complete
- **Phase 6 (Routes)**: Requires Phases 2, 4, and 5 complete (all 3 components must exist)
- **Phase 7 (Polish)**: Requires Phase 6 complete (routes must be live)

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 — no dependency on other stories
- **US2 (P1)**: Can start after Phase 1 — modifies dashboard, does not depend on US1 components
- **US3 (P2)**: Can start after Phase 1 — independent of US1/US2
- **US4 (P2)**: Can start after Phase 1 — independent of US1/US2/US3

### Within Each User Story

- Component `.ts` before `.html` (template references signals/methods defined in class)
- `.css` and `.spec.ts` are always independent [P] tasks

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel (T001, T002, T004)
- Once Phase 1 completes, US1, US2, US3, US4 can all start in parallel
- Within each story, `.css` and `.spec.ts` tasks can run in parallel with each other

---

## Parallel Example: After Phase 1

```
Developer A → Phase 2 (US1): T005 → T006, T007, T008
Developer B → Phase 3 (US2): T009 → T010
Developer C → Phase 4 (US3): T011 → T012, T013, T014
Developer D → Phase 5 (US4): T015 → T016, T017, T018
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 — both P1)

1. Complete Phase 1: Models + Service (T001–T004)
2. Complete Phase 2: BondForecastComponent (T005–T008)
3. Complete Phase 3: Dashboard 3rd tab changes (T009–T010)
4. Complete T019: Register all 3 routes (stubs acceptable for view/edit if needed)
5. **STOP and VALIDATE**: New bond form submits, tab navigation works, dashboard shows saved bond forecasts

### Full Delivery (add P2 stories)

6. Complete Phase 4: ViewBondComponent (T011–T014)
7. Complete Phase 5: EditBondComponent (T015–T018)
8. Update T019 if stubs were used
9. Complete Phase 7: Polish & validation (T020–T021)

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| Phase 1 — Foundational | T001–T004 | — | Blocker |
| Phase 2 — Calculate Bond Forecast | T005–T008 | US1 | P1 🎯 |
| Phase 3 — Dashboard 3rd Tab | T009–T010 | US2 | P1 |
| Phase 4 — View Bond Result | T011–T014 | US3 | P2 |
| Phase 5 — Edit Bond Forecast | T015–T018 | US4 | P2 |
| Phase 6 — Route Registration | T019 | — | Integration |
| Phase 7 — Polish | T020–T021 | — | QA |
| **Total** | **21 tasks** | | |

---

## Notes

- `[P]` tasks = different files, no shared dependency — safe to run in parallel
- All component `.css` files are empty; create with a single write
- Spec files are TestBed scaffolds only — no behaviour tests requested
- `userEmail` is always sourced from `userService.getById(userId).email` — never from user input
- All monetary display uses `CurrencyPipe` with `'ZAR':'symbol':'1.2-2'` and `LOCALE_ID: 'en-ZA'`
- The key dashboard change (flat `forkJoin` → `userService.getById().pipe(switchMap(...))`) is in T009 — the single most impactful modification to existing code
- Route order in T019 matters: static `bonds/forecast` must be declared before dynamic `bonds/:bondId`
- Commit after each phase before moving to the next

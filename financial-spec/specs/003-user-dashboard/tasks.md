# Tasks: User Dashboard

**Input**: Design documents from `specs/003-user-dashboard/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create `src/app/models/tax-calculation.model.ts` — `TaxCalculation` interface with all API response fields (id, title, description, salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, age, totalGrossIncome, totalDeductions, netTaxableIncome, taxBeforeRebate, rebate, finalTaxLiability, createdAt, updatedAt)
- [x] T002 [P] Create `src/app/dashboard/dashboard.component.css` — empty file

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 Add `getById(id: number): Observable<User>` to `src/app/services/user.service.ts` — `GET ${environment.apiBaseUrl}/user/${id}`, pipe `catchError`
- [x] T004 Create `src/app/services/tax.service.ts` — `@Injectable({ providedIn: 'root' })`, inject `HttpClient`; implement `getAllByUser(userId: number): Observable<TaxCalculation[]>` → `GET ${environment.apiBaseUrl}/tax?userId=${userId}`; implement `delete(id: number): Observable<void>` → `DELETE ${environment.apiBaseUrl}/tax/${id}`; both pipe `catchError`
- [x] T005 Add `{ path: 'user/:id', component: DashboardComponent }` to `src/app/app.routes.ts`

**Checkpoint**: Services and route ready — component work can begin.

---

## Phase 3: User Story 1 — View Saved Calculations (P1) 🎯 MVP

**Goal**: User sees their calculation cards with title, description, and date.

**Independent Test**: Navigate to `/user/:id` → confirm cards load with correct data.

- [x] T006 [US1] Create `src/app/dashboard/dashboard.component.ts` — `standalone: true`, imports `DatePipe` + `RouterModule`; inject `ActivatedRoute`, `Router`, `UserService`, `TaxService`; signals: `user = signal<User|null>(null)`, `calculations = signal<TaxCalculation[]>([])`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit()` reads `+route.snapshot.paramMap.get('id')` as `userId`, calls `forkJoin([userService.getById(userId), taxService.getAllByUser(userId)])`, sets signals on success/error; methods: `viewCalc(calcId)` → `router.navigate(['/user', userId, 'calculations', calcId])`, `newCalc()` → `router.navigate(['/user', userId, 'calculate'])`
- [x] T007 [US1] Create `src/app/dashboard/dashboard.component.html` — `<header>` with user full name heading + "New Calculation" button; `@if(loading())` spinner; `@if(error())` error banner; `@if(!loading() && !error())` section containing: `@if(calculations().length === 0)` empty state; `@else` `<ul>` with `@for(calc of calculations(); track calc.id)` card: title, description (truncated with slice pipe), formatted `createdAt` via `DatePipe`, delete button with `(click)="deleteCalc(calc.id)"`

**Checkpoint**: US1 complete — calculations list visible.

---

## Phase 4: User Story 2 — Navigate to Calculation (P2)

**Goal**: Clicking a card navigates to `/user/:id/calculations/:calcId`.

- [x] T008 [US2] Wrap each card in `<button (click)="viewCalc(calc.id)">` in `dashboard.component.html` (already added in T007 — verify click calls `viewCalc` and delete button stops propagation with `$event.stopPropagation()`)

---

## Phase 5: User Story 3 — Delete with Confirmation (P3)

**Goal**: Delete icon shows `window.confirm`, then calls DELETE, removes card from list.

- [x] T009 [US3] Add `deleteCalc(id: number)` method to `dashboard.component.ts` — `if (!window.confirm('Are you sure you want to delete this calculation?')) return;`; call `taxService.delete(id).subscribe({ next: () => this.calculations.update(list => list.filter(c => c.id !== id)), error: err => this.error.set(err.message) })`

---

## Phase 6: User Story 4 — New Calculation Button (P4)

**Goal**: "New Calculation" always visible, navigates to `/user/:id/calculate`.

- [x] T010 [US4] Verify "New Calculation" button in header calls `newCalc()` and is outside any conditional block (already placed in T007 header — confirm only)

---

## Phase 7: Polish & SpecKit Specs

- [x] T011 [P] Create `src/app/services/tax.service.spec.ts` — spec: `getAllByUser()` calls correct URL, `delete()` calls correct URL, both surface error messages on failure
- [x] T012 [P] Create `src/app/dashboard/dashboard.component.spec.ts` — spec: renders user name, renders calculation cards, navigates on card click, removes card after delete, shows empty state, shows error banner
- [x] T013 Run `ng build` — confirm zero errors
- [x] T014 Run `ng serve` and manually verify dashboard at `http://localhost:4200/user/1`

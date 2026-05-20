# Tasks: Tax Calculation Form

**Input**: Design documents from `specs/004-tax-calculation/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Phase 1: Setup

- [x] T001 Create `src/app/models/tax-calculation-request.model.ts` — `TaxCalculationRequest` interface: `userEmail`, `title`, `description`, `salary`, `interestIncome`, `dividend`, `capitalGain`, `bonus`, `retirementAnnuity`, `taxAlreadyPaid`, `age` (all typed)
- [x] T002 [P] Create `src/app/calculate/calculate.component.css` — empty file

---

## Phase 2: Foundational

- [x] T003 Add `calculate(payload: TaxCalculationRequest): Observable<TaxCalculation>` to `src/app/services/tax.service.ts` — `POST ${environment.apiBaseUrl}/tax`, pipe `catchError`
- [x] T004 Add `{ path: 'user/:id/calculate', component: CalculateComponent }` to `src/app/app.routes.ts`

---

## Phase 3: User Story 1 — Submit Valid Calculation (P1) 🎯 MVP

**Goal**: Valid form submits to API, navigates to result on 201.

**Independent Test**: Fill title + age + salary → submit → navigate to `/user/:id/calculations/:newId`.

- [x] T005 [US1] Create `src/app/calculate/calculate.component.ts` — `standalone: true`, imports `ReactiveFormsModule` + `RouterModule`; inject `ActivatedRoute`, `Router`, `UserService`, `TaxService`, `FormBuilder`; `userId` from route param; `userEmail = ''`; `submitting = signal(false)`; `error = signal<string|null>(null)`; `form = fb.group({ title:['', required], description:[''], salary:[0, [required, min(0)]], interestIncome:[0, [required, min(0)]], dividend:[0, [required, min(0)]], capitalGain:[0, [required, min(0)]], bonus:[0, [required, min(0)]], retirementAnnuity:[0, [required, min(0)]], taxAlreadyPaid:[0, [required, min(0)]], age:['', [required, min(0)]] })`; `ngOnInit()` fetches user email, sets error if fails; `onSubmit()`: `markAllAsTouched()`, guard `form.invalid`, set `submitting(true)`, build payload with numeric coercion `Number(v)||0`, call `taxService.calculate()`, on success `router.navigate(['/user', userId, 'calculations', res.id])`, on error set `error`; `cancel()` → `router.navigate(['/user', userId])`
- [x] T006 [US1] Create `src/app/calculate/calculate.component.html` — page header "New Calculation" + Cancel button; `@if(error())` API error banner; `<form>` with two sections: **Details** (title, description, age) and **Income & Deductions** (salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid); each numeric input `type="number" min="0" step="0.01"`; inline `@if` errors for required + min violations; Submit button `[disabled]="submitting()"` with spinner

**Checkpoint**: US1 complete — full happy path works.

---

## Phase 4: User Story 2 — Inline Validation (P2)

**Goal**: Inline errors on all invalid fields, no API call made.

- [x] T007 [US2] Verify `onSubmit()` calls `markAllAsTouched()` before the `form.invalid` guard so all field errors surface simultaneously, and that no API call is made when form is invalid (already in T005 — confirm only)

---

## Phase 5: User Story 3 — API Error Banner (P3)

**Goal**: Server error displayed in banner, form values retained.

- [x] T008 [US3] Verify `error` signal is set from `err.message` on subscribe error and `submitting` is reset to `false` on error path (already in T005 — confirm only); verify no `form.reset()` is called on error

---

## Phase 6: User Story 4 — Cancel (P4)

**Goal**: Cancel navigates to `/user/:id`, no API call.

- [x] T009 [US4] Verify Cancel button in header calls `cancel()` and is outside the form so it never triggers submit (already in T006 — confirm only)

---

## Phase 7: Polish & SpecKit Spec

- [x] T010 Create `src/app/calculate/calculate.component.spec.ts` — spec: renders all 10 form fields + title + age, shows inline errors on invalid submit, makes no API call when form invalid, disables submit while submitting, shows error banner on API failure, cancel navigates to dashboard
- [x] T011 Run `ng build` — confirm zero errors
- [x] T012 Run `ng serve` and manually verify at `http://localhost:4200/user/1/calculate`

# Tasks: View Calculation

**Input**: Design documents from `specs/005-view-calculation/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Phase 1: Setup

- [x] T001 Register `en-ZA` locale in `src/app/app.config.ts` — import `registerLocaleData` + `localeEnZA` from `@angular/common/locales/en-ZA`, call `registerLocaleData(localeEnZA)`, add `{ provide: LOCALE_ID, useValue: 'en-ZA' }` to providers
- [x] T002 [P] Create `src/app/view-calculation/view-calculation.component.css` — empty file
- [x] T003 Add `{ path: 'user/:id/calculations/:calcId', component: ViewCalculationComponent }` to `src/app/app.routes.ts`

---

## Phase 2: Foundational

No new services needed — `TaxService.getById()` and `TaxService.delete()` already exist.

---

## Phase 3: User Story 1 — View Full Detail (P1) 🎯 MVP

**Goal**: Full calculation (inputs + breakdown) visible on page load.

**Independent Test**: Navigate to `/user/1/calculations/10` → confirm both sections render with correct values.

- [x] T004 [US1] Create `src/app/view-calculation/view-calculation.component.ts` — `standalone: true`, imports `CurrencyPipe` + `DatePipe` + `RouterModule`; inject `ActivatedRoute`, `Router`, `TaxService`; `userId` + `calcId` from route params; signals `calc = signal<TaxCalculation|null>(null)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit()` calls `taxService.getById(calcId)`, sets signals; methods `editCalc()` → navigate to edit URL, `deleteCalc()` → `window.confirm` → `taxService.delete()` → navigate to `/user/:id`, `goBack()` → navigate to `/user/:id`
- [x] T005 [US1] Create `src/app/view-calculation/view-calculation.component.html` — page header with calc title + "Edit" button (indigo) + "Back to Dashboard" link; `@if(loading())` spinner; `@if(error())` error banner; `@if(calc())` two-card layout: **Inputs** card (description, salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, age, createdAt) and **Tax Breakdown** card (totalGrossIncome, totalDeductions, netTaxableIncome, taxBeforeRebate, rebate, finalTaxLiability highlighted in indigo); "Delete Calculation" danger button at bottom

**Checkpoint**: US1 complete — full read view working.

---

## Phase 4: User Story 2 — Navigate to Edit (P2)

- [x] T006 [US2] Verify "Edit" button in header calls `editCalc()` → `router.navigate(['/user', userId, 'calculations', calcId, 'edit'])` (already in T004/T005 — confirm only)

---

## Phase 5: User Story 3 — Delete with Confirmation (P3)

- [x] T007 [US3] Verify `deleteCalc()` calls `window.confirm` before `taxService.delete()` and navigates to `/user/:id` on success (already in T004 — confirm only)

---

## Phase 6: User Story 4 — Back to Dashboard (P4)

- [x] T008 [US4] Verify "Back to Dashboard" link calls `goBack()` → `router.navigate(['/user', userId])` (already in T004/T005 — confirm only)

---

## Phase 7: Polish & SpecKit Spec

- [x] T009 Create `src/app/view-calculation/view-calculation.component.spec.ts` — spec: displays calc title, shows inputs section, shows breakdown section, edit button navigates correctly, delete calls confirm then deletes, back link navigates to dashboard, error banner on API failure
- [x] T010 Run `ng build` — confirm zero errors
- [x] T011 Run `ng serve` and manually verify at `http://localhost:4200/user/1/calculations/1`

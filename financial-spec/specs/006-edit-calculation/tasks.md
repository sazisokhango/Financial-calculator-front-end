# Tasks: Edit Calculation

**Input**: Design documents from `specs/006-edit-calculation/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Phase 1: Setup

- [x] T001 [P] Create `src/app/edit-calculation/edit-calculation.component.css` — empty file
- [x] T002 Add `{ path: 'user/:id/calculations/:calcId/edit', component: EditCalculationComponent }` to `src/app/app.routes.ts`

---

## Phase 2: Foundational

No new services or models needed — all exist from features 003–005.

---

## Phase 3: User Story 1 — Pre-populate Form (P1) 🎯 MVP

**Goal**: Edit page loads with all fields pre-filled from the saved calculation.

**Independent Test**: Navigate to edit page → confirm every field matches the saved calculation values.

- [x] T003 [US1] Create `src/app/edit-calculation/edit-calculation.component.ts` — `standalone: true`, imports `ReactiveFormsModule` + `RouterModule`; inject `ActivatedRoute`, `Router`, `FormBuilder`, `UserService`, `TaxService`; `userId` + `calcId` from route params; `userEmail = ''`; signals `loading = signal(true)`, `submitting = signal(false)`, `error = signal<string|null>(null)`; same `FormGroup` as `CalculateComponent` (title required, description optional, 7 numeric fields `[0, [required, min(0)]]`, age required min 0); `readonly numericFields` array same as `CalculateComponent`; `ngOnInit()` calls `forkJoin([userService.getById(userId), taxService.getById(calcId)])`, on success stores `userEmail` and calls `form.patchValue({...calc})`, sets `loading(false)`; `onSubmit()`: `markAllAsTouched()`, guard `form.invalid || !userEmail`, `submitting(true)`, build payload with numeric coercion, call `taxService.update(calcId, payload)`, on success `router.navigate(['/user', userId, 'calculations', calcId])`, on error set `error` + `submitting(false)`; `cancel()` → same navigate as success

---

## Phase 4: User Story 2 — Save Updated Calculation (P2)

**Goal**: Modified form submits via PUT, navigates to view page on 200.

- [x] T004 [US2] Create `src/app/edit-calculation/edit-calculation.component.html` — identical structure to `calculate.component.html`; change header title to "Edit Calculation"; change submit button label to "Save Changes"; cancel button calls `cancel()`; same two-section form (Details + Income & Deductions), same `@for(numericFields)`, same `@if` inline errors

**Checkpoint**: US1 + US2 complete — pre-population and save both work.

---

## Phase 5: User Story 3 — Validation (P3)

- [x] T005 [US3] Verify `onSubmit()` calls `markAllAsTouched()` before the `form.invalid` guard (already in T003 — confirm only)

---

## Phase 6: User Story 4 — API Error Banner (P4)

- [x] T006 [US4] Verify `error` signal set from `err.message`, `submitting` reset, no `form.reset()` on error path (already in T003 — confirm only)

---

## Phase 7: User Story 5 — Cancel (P5)

- [x] T007 [US5] Verify Cancel button calls `cancel()` → `router.navigate(['/user', userId, 'calculations', calcId])` (already in T003/T004 — confirm only)

---

## Phase 8: Polish & SpecKit Spec

- [x] T008 Create `src/app/edit-calculation/edit-calculation.component.spec.ts` — spec: pre-populates all fields from existing calc, submits PUT on valid save, shows inline errors on invalid submit, shows error banner on API failure, cancel navigates to view page, submit button disabled while submitting
- [x] T009 Run `ng build` — confirm zero errors
- [x] T010 Run `ng serve` and manually verify at `http://localhost:4200/user/1/calculations/1/edit`

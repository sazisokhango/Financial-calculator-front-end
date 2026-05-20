# Tasks: User Registration

**Input**: Design documents from `specs/002-user-registration/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Model and route that all stories depend on.

- [x] T001 [P] Create `src/app/models/register-request.model.ts` — export `RegisterRequest` interface: `firstName: string`, `lastName: string`, `email: string`
- [x] T002 [P] Create `src/app/register/` directory and `src/app/register/register.component.css` — empty file (Tailwind only)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: AuthService and route — must exist before any component story can be tested end-to-end.

- [x] T003 Create `src/app/services/auth.service.ts` — `@Injectable({ providedIn: 'root' })`, inject `HttpClient`, implement `register(payload: RegisterRequest): Observable<User>` calling `POST ${environment.apiBaseUrl}/auth/register`, pipe `catchError` re-throwing with `err.error?.message ?? 'Registration failed. Please try again.'`
- [x] T004 Add `{ path: 'register', component: RegisterComponent }` to `src/app/app.routes.ts`

**Checkpoint**: Service and route ready — component implementation can begin.

---

## Phase 3: User Story 1 — Successful Registration (P1) 🎯 MVP

**Goal**: User fills valid form, submits, gets navigated to `/` on 201.

**Independent Test**: Submit valid form → confirm navigation to `/`.

- [x] T005 [US1] Create `src/app/register/register.component.ts` — `standalone: true`, imports `ReactiveFormsModule` + `RouterModule`, inject `FormBuilder` + `AuthService` + `Router`, build `FormGroup` with `firstName` (`required`), `lastName` (`required`), `email` (`required`, `email`), declare `submitting = signal(false)`, `apiError = signal<string | null>(null)`, implement `onSubmit()`: guard on `form.invalid`, trim email value, set `submitting(true)`, call `authService.register()`, on success `router.navigate(['/'])`, on error set `apiError` and `submitting(false)`
- [x] T006 [US1] Create `src/app/register/register.component.html` — page header with app title, `<form [formGroup]="form" (ngSubmit)="onSubmit()">` with three labelled inputs (`formControlName`), `@if (apiError())` red error banner, `<button type="submit" [disabled]="submitting()">` with spinner `@if (submitting())` and label "Register", `<a routerLink="/">Already registered?</a>` link below the form

**Checkpoint**: User Story 1 complete — happy path works end-to-end.

---

## Phase 4: User Story 2 — Duplicate Email Error (P2)

**Goal**: API 400 error message shown in banner; form values retained.

**Independent Test**: Submit with duplicate email → error banner shows API message, form not cleared.

- [x] T007 [US2] Verify `onSubmit()` in `register.component.ts` sets `apiError` from error response and does NOT reset form fields on error (form values naturally persist since no `form.reset()` call on error path)

---

## Phase 5: User Story 3 — Inline Field Validation (P3)

**Goal**: Inline errors appear per field when user submits invalid data; no API call made.

**Independent Test**: Submit blank form → all three inline errors appear simultaneously, no network request.

- [x] T008 [US3] Add inline validation error blocks to `register.component.html` — beneath each input add `@if (form.get('firstName')?.invalid && form.get('firstName')?.touched)` → "First name is required"; same pattern for `lastName`; for email add two cases: required → "Email is required", email validator → "Enter a valid email address"; mark all fields as touched in `onSubmit()` before the `form.invalid` guard so errors show on submit attempt

---

## Phase 6: User Story 4 — Already Registered Link (P4)

**Goal**: "Already registered?" link always visible, navigates to `/`.

**Independent Test**: Confirm link present at all times, click navigates to `/`.

- [x] T009 [US4] Verify `routerLink="/"` link labelled "Already registered?" is present below the form in `register.component.html` and `RouterModule` is in the component's `imports` array (already added in T006 — confirm only)

---

## Phase 7: Polish & SpecKit Specs

- [x] T010 [P] Create `src/app/services/auth.service.spec.ts` — spec covering: `register()` posts to correct URL with payload, returns `User` on 201, surfaces error message on 400
- [x] T011 [P] Create `src/app/register/register.component.spec.ts` — spec covering: renders form fields, shows inline errors on invalid submit, disables button while submitting, navigates to `/` on success, shows error banner on API failure
- [x] T012 Run `ng build` and confirm zero errors
- [x] T013 Run `ng serve`, open `http://localhost:4200/register`, manually verify: inline validation, success navigation, error banner, Register button disabled during submit, "Already registered?" link

---

## Dependencies & Execution Order

- Phase 1 tasks (T001, T002) are parallel — start immediately
- T003 and T004 depend on T001 completing (need `RegisterRequest` type and component reference)
- T005 depends on T003 (needs `AuthService`)
- T006 depends on T005 (template references component class)
- T007 is a verification of T005 — no new file
- T008 modifies T006's template — depends on T006
- T009 is a verification of T006 — no new file
- T010, T011 are parallel and depend on T005–T006 existing

### Parallel Opportunities

```bash
# Phase 1 — run together:
T001  register-request.model.ts
T002  register.component.css

# Phase 7 — run together:
T010  auth.service.spec.ts
T011  register.component.spec.ts
```

---

## Implementation Strategy

### MVP (Phase 1–3 only)

1. T001–T002 (setup) → T003–T004 (foundational) → T005–T006 (US1)
2. **STOP & VALIDATE**: Happy path works
3. Continue T007–T009 for error handling and validation stories

### Incremental Delivery

1. Setup + Foundational → service and route ready
2. US1 → happy path ✅
3. US2 → error banner ✅
4. US3 → inline validation ✅
5. US4 → back link confirmed ✅
6. Polish → specs + build ✅

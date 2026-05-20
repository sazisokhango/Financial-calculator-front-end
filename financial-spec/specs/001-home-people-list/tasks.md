# Tasks: Home Page — People List

**Input**: Design documents from `specs/001-home-people-list/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Wiring that must exist before any component work begins.

- [ ] T001 Verify `provideHttpClient()` is present in `src/app/app.config.ts`; add if missing
- [ ] T002 [P] Create `src/app/models/user.model.ts` — export `User` interface with `id: number`, `firstName: string`, `lastName: string`, `email: string`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Service and route registration that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create `src/app/services/user.service.ts` — `@Injectable({ providedIn: 'root' })`, inject `HttpClient`, implement `getAll(): Observable<User[]>` calling `GET ${environment.apiBaseUrl}/user`, pipe `catchError` to re-throw with `(err.error?.message ?? 'Could not load users')`
- [ ] T004 Add `{ path: '', component: HomeComponent }` to `src/app/app.routes.ts`

**Checkpoint**: Service and route ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Registered User Identifies Themselves (P1) 🎯 MVP

**Goal**: User opens `/`, sees all registered names, clicks one, and navigates to `/user/:id`.

**Independent Test**: Start the app with the back-end running. Confirm the people list loads and clicking a name navigates to the correct `/user/:id` URL.

- [ ] T005 [US1] Create `src/app/home/home.component.ts` — `standalone: true`, imports `ReactiveFormsModule` + `RouterModule`, inject `UserService` + `Router`, declare signals `users = signal<User[]>([])`, `loading = signal(true)`, `error = signal<string | null>(null)`, implement `ngOnInit()` subscribing to `userService.getAll()` (set signals on success/error), implement `goToDashboard(id: number)` calling `this.router.navigate(['/user', id])`
- [ ] T006 [US1] Create `src/app/home/home.component.html` — page header with app title, `@if (loading())` spinner div, `@if (error())` red error banner showing `{{ error() }}`, `@if (!loading() && !error())` wrapper containing `@for (user of users(); track user.id)` block rendering a `<button (click)="goToDashboard(user.id)">{{ user.firstName }} {{ user.lastName }}</button>` per user
- [ ] T007 [P] [US1] Create `src/app/home/home.component.css` — empty file (Tailwind only)

**Checkpoint**: User Story 1 complete — people list loads, click navigates to dashboard.

---

## Phase 4: User Story 2 — Name Filter (P2)

**Goal**: User types in a search box and the list narrows instantly to matching names.

**Independent Test**: With the app running, type a partial name into the filter input. Confirm only matching users are shown. Clear the input — full list restores.

- [ ] T008 [US2] Add filter signals to `src/app/home/home.component.ts` — add `filterControl = new FormControl('')`, `filterValue = toSignal(this.filterControl.valueChanges, { initialValue: '' })`, replace `users()` in template references with `filteredUsers = computed(() => this.users().filter(u => (u.firstName + ' ' + u.lastName).toLowerCase().includes((this.filterValue() ?? '').toLowerCase())))`
- [ ] T009 [US2] Add search input to `src/app/home/home.component.html` — `<input [formControl]="filterControl" placeholder="Search by name…" />` placed between the header and the user list; update `@for` to iterate over `filteredUsers()` instead of `users()`

**Checkpoint**: User Story 2 complete — live client-side name filter works with no extra API call.

---

## Phase 5: User Story 3 — Register Navigation (P3)

**Goal**: A "Register" button is always visible and navigates to `/register`.

**Independent Test**: Confirm the Register button is visible on the home page at all times (loaded, loading, empty, and error states). Click it — lands on `/register`.

- [ ] T010 [US3] Add Register button to the header in `src/app/home/home.component.html` — `<a routerLink="/register">Register</a>` styled as an indigo-600 button, positioned in the page header alongside the app title; confirm `RouterModule` is in the component's `imports` array

**Checkpoint**: User Story 3 complete — new users can reach `/register` from the home page.

---

## Phase 6: User Story 4 — Empty State (P4)

**Goal**: When no users are registered the page shows a friendly message instead of a blank list.

**Independent Test**: Temporarily mock or stop the back-end so it returns `[]`. Confirm the empty state message renders. Confirm the Register button is still visible.

- [ ] T011 [US4] Add empty state block inside the `@if (!loading() && !error())` section of `src/app/home/home.component.html` — wrap the `@for` in `@if (filteredUsers().length > 0) { @for ... } @else { <p>No users registered yet.</p> }`

**Checkpoint**: User Story 4 complete — no blank screen on an empty system.

---

## Phase 7: Polish & SpecKit Specs

**Purpose**: Spec files and final build verification.

- [ ] T012 [P] Create `src/app/services/user.service.spec.ts` — SpecKit spec covering: `getAll()` returns `User[]` on 200, surfaces error message on failure
- [ ] T013 [P] Create `src/app/home/home.component.spec.ts` — SpecKit spec covering: renders user list, navigates on click, filters by name, shows empty state, shows error banner
- [ ] T014 Run `ng build` from `~/Desktop/Financial-calculator-front-end` and confirm zero TypeScript/template errors
- [ ] T015 Run `ng serve`, open `http://localhost:4200`, manually verify: list loads, filter works, name click navigates, Register button navigates to `/register`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — core MVP
- **Phase 4 (US2)**: Depends on Phase 3 — extends the component
- **Phase 5 (US3)**: Depends on Phase 3 — adds to the template
- **Phase 6 (US4)**: Depends on Phase 4 — refines the list rendering
- **Phase 7 (Polish)**: Depends on Phases 3–6

### Within Each Phase

- `[P]` tasks in the same phase can be worked on simultaneously
- T005 (component class) must complete before T008 (filter signals)
- T006 (template) must complete before T009 (filter input), T010 (register button), T011 (empty state)

### Parallel Opportunities

```bash
# Phase 1 — can run together:
T001  Verify app.config.ts
T002  Create user.model.ts

# Phase 3 — T007 can run alongside T005+T006:
T005  home.component.ts (class)
T006  home.component.html (template)
T007  home.component.css (empty)

# Phase 7 — spec files can run together:
T012  user.service.spec.ts
T013  home.component.spec.ts
```

---

## Implementation Strategy

### MVP (User Story 1 only — Phases 1–3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP & VALIDATE**: List loads, click navigates — core flow works
5. Continue with Phases 4–6 for remaining stories

### Incremental Delivery

1. Phase 1 + 2 → foundation ready
2. Phase 3 → people list MVP ✅
3. Phase 4 → filter added ✅
4. Phase 5 → register button added ✅
5. Phase 6 → empty state added ✅
6. Phase 7 → specs + build verified ✅

---

## Notes

- All tasks touch `src/` at the repository root of `Financial-calculator-front-end/`
- `nvm use 20` required before any `ng` command
- `[P]` = different files, safe to run concurrently
- Commit after each completed phase checkpoint
- Back-end must be running on `localhost:8080` for manual testing (T015)

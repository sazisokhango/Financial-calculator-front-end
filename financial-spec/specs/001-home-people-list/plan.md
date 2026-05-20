# Implementation Plan: Home Page — People List

**Branch**: `feature/001-home-people-list` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-home-people-list/spec.md`

---

## Summary

Build `HomeComponent` at route `/` that loads all registered users from `GET /api/user`, renders them as a clickable name list, and supports client-side filtering. A Register button navigates to `/register`. Component state is managed via Angular signals; HTTP is handled by a new `UserService`.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: Angular `HttpClient`, Angular `Router`, Angular Signals (`signal`, `computed`, `toSignal`), Angular Reactive Forms (`FormControl`)

**Storage**: None — read-only page, no writes

**Testing**: Angular TestBed + Jasmine (built-in); one SpecKit spec file per component and service

**Target Platform**: Browser (Chrome / Firefox / Edge — modern versions)

**Project Type**: SPA — Angular front-end consuming a Spring Boot REST API

**Performance Goals**: User list renders within 2 seconds; client-side filter responds within 200ms

**Constraints**: API base URL from `environment.apiBaseUrl` only; no component libraries beyond Tailwind

**Scale/Scope**: Single page, one service method, one component

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Standalone components | `HomeComponent` declared `standalone: true` | ✅ PASS |
| II. `@for` / `@if` control flow | No `*ngFor` / `*ngIf` in template | ✅ PASS |
| III. Reactive Forms | `FormControl` used for filter input | ✅ PASS |
| IV. API contract | `GET /api/user` via `environment.apiBaseUrl` | ✅ PASS |
| V. Identity flow | Home is entry point; no auth check required | ✅ PASS |

No violations. No complexity justification required.

---

## Project Structure

### Documentation (this feature)

```
financial-spec/specs/001-home-people-list/
├── spec.md                           ← Feature specification
├── plan.md                           ← This file
├── research.md                       ← Phase 0 decisions
├── data-model.md                     ← User interface + component state
├── quickstart.md                     ← Implementation guide
├── contracts/
│   └── user-service.contract.md     ← HTTP + component contracts
├── checklists/
│   └── requirements.md              ← Quality checklist (all passing)
└── tasks.md                         ← Created by /speckit-tasks (next step)
```

### Source Code (repository root)

```
src/
└── app/
    ├── models/
    │   └── user.model.ts                 ← NEW: User interface
    ├── services/
    │   ├── user.service.ts               ← NEW: getAll() → Observable<User[]>
    │   └── user.service.spec.ts          ← NEW: SpecKit spec
    └── home/
        ├── home.component.ts             ← NEW: HomeComponent (standalone)
        ├── home.component.html           ← NEW: template (@for / @if)
        ├── home.component.css            ← NEW: empty (Tailwind only)
        └── home.component.spec.ts        ← NEW: SpecKit spec

src/app/app.routes.ts                     ← MODIFY: add '' → HomeComponent
src/app/app.config.ts                     ← VERIFY: provideHttpClient() present
```

**Structure Decision**: Single Angular SPA. Feature files under `src/app/home/`. Shared model under `src/app/models/`. Shared service under `src/app/services/` (reusable by dashboard and other features).

---

## Implementation Phases

### Phase 1 — Model & Service

1. Create `src/app/models/user.model.ts`
   - `User` interface: `id: number`, `firstName: string`, `lastName: string`, `email: string`

2. Create `src/app/services/user.service.ts`
   - `@Injectable({ providedIn: 'root' })`
   - Inject `HttpClient`
   - `getAll(): Observable<User[]>` — `GET ${environment.apiBaseUrl}/user`
   - `catchError` — re-throw error with `error.error.message` for component to display

3. Create `src/app/services/user.service.spec.ts`

### Phase 2 — Component

4. Create `src/app/home/home.component.ts`
   - `standalone: true`, imports: `ReactiveFormsModule`, `RouterLink`
   - Inject `UserService`, `Router`
   - `users = signal<User[]>([])`
   - `loading = signal(true)`
   - `error = signal<string | null>(null)`
   - `filterControl = new FormControl('')`
   - `filterValue = toSignal(filterControl.valueChanges, { initialValue: '' })`
   - `filteredUsers = computed(() => users().filter(u => fullName(u).includes(filterValue()!.toLowerCase())))`
   - `ngOnInit()` — subscribe `userService.getAll()`, set signals on success/error
   - `goToDashboard(id: number)` — `this.router.navigate(['/user', id])`

5. Create `src/app/home/home.component.html`
   - Page header: app title + "Register" `routerLink="/register"` button
   - Search input `[formControl]="filterControl"` with placeholder "Search by name…"
   - `@if (loading()) { <spinner> }`
   - `@if (error()) { <error-banner>{{ error() }}</error-banner> }`
   - `@if (!loading() && !error()) {`
   - ‣ `@if (filteredUsers().length === 0) { <empty-state> }`
   - ‣ `@else { @for (user of filteredUsers(); track user.id) { <button (click)="goToDashboard(user.id)"> } }`
   - `}`

6. Create `src/app/home/home.component.spec.ts`

### Phase 3 — Routing & Wiring

7. Update `src/app/app.routes.ts` — add `{ path: '', component: HomeComponent }`
8. Verify `src/app/app.config.ts` has `provideHttpClient()`

# Implementation Plan: User Registration

**Branch**: `feature/002-registration` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-user-registration/spec.md`

---

## Summary

Build `RegisterComponent` at route `/register` — a three-field Reactive Form (firstName, lastName, email) that posts to `POST /api/auth/register`, shows inline validation errors, displays API error banners, disables the submit button during submission, and navigates to `/` on success.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Angular 21

**Primary Dependencies**: Angular Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`), Angular `HttpClient`, Angular `Router`, Angular Signals (`signal`)

**Storage**: None — no local persistence; success navigates to home

**Testing**: Angular TestBed + Jasmine; one SpecKit spec per component and service

**Target Platform**: Browser — modern Chrome/Firefox/Edge

**Project Type**: SPA — Angular front-end consuming Spring Boot REST API

**Performance Goals**: Form submission round-trip within 2 seconds under normal conditions

**Constraints**: `apiBaseUrl` from `environment.apiBaseUrl` only; Tailwind only for styling

**Scale/Scope**: Single page, one service method, one component

---

## Constitution Check

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Standalone components | `RegisterComponent` declared `standalone: true` | ✅ PASS |
| II. `@for` / `@if` control flow | Validation errors and API error use `@if` only | ✅ PASS |
| III. Reactive Forms | `FormGroup` + `FormBuilder` + `Validators` | ✅ PASS |
| IV. API contract | `POST /api/auth/register` via `environment.apiBaseUrl` | ✅ PASS |
| V. Identity flow | No token stored; success → navigate to `/` | ✅ PASS |

No violations. No complexity justification required.

---

## Project Structure

### Documentation (this feature)

```
financial-spec/specs/002-user-registration/
├── spec.md
├── plan.md                          ← This file
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-service.contract.md
├── checklists/
│   └── requirements.md
└── tasks.md                         ← Created by /speckit-tasks
```

### Source Code

```
src/
└── app/
    ├── models/
    │   └── register-request.model.ts        ← NEW
    ├── services/
    │   ├── auth.service.ts                  ← NEW
    │   └── auth.service.spec.ts             ← NEW
    └── register/
        ├── register.component.ts            ← NEW
        ├── register.component.html          ← NEW
        ├── register.component.css           ← NEW (empty)
        └── register.component.spec.ts       ← NEW

src/app/app.routes.ts                        ← MODIFY: add 'register' route
```

**Structure Decision**: `RegisterComponent` in `src/app/register/`. `AuthService` in `src/app/services/` (reusable). `RegisterRequest` interface in `src/app/models/`.

---

## Implementation Phases

### Phase 1 — Model & Service

1. Create `src/app/models/register-request.model.ts` — `RegisterRequest` interface
2. Create `src/app/services/auth.service.ts` — `register(payload): Observable<User>`, `catchError`

### Phase 2 — Component

3. Create `src/app/register/register.component.ts` — standalone, `FormBuilder` group, `submitting` + `apiError` signals, `onSubmit()` with guard, trim, submit, navigate
4. Create `src/app/register/register.component.html` — form with three inputs, inline `@if` errors per field, API error banner, submit button with spinner, "Already registered?" link
5. Create `src/app/register/register.component.css` — empty

### Phase 3 — Routing

6. Add `{ path: 'register', component: RegisterComponent }` to `src/app/app.routes.ts`

### Phase 4 — Spec Files

7. Create `src/app/services/auth.service.spec.ts`
8. Create `src/app/register/register.component.spec.ts`

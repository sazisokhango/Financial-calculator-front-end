# Quickstart: User Registration

**Feature**: 002-user-registration
**Date**: 2026-05-20

---

## What Gets Built

`RegisterComponent` at route `/register` — a Reactive Form with three fields, inline validation, API submission, error handling, and navigation on success.

---

## Files to Create

```
src/
└── app/
    ├── models/
    │   └── register-request.model.ts     ← RegisterRequest interface
    ├── services/
    │   ├── auth.service.ts               ← register(): Observable<User>
    │   └── auth.service.spec.ts          ← SpecKit spec
    └── register/
        ├── register.component.ts         ← RegisterComponent (standalone)
        ├── register.component.html       ← Reactive Form template
        ├── register.component.css        ← Empty (Tailwind only)
        └── register.component.spec.ts   ← SpecKit spec
```

---

## Files to Modify

```
src/app/app.routes.ts    ← Add { path: 'register', component: RegisterComponent }
```

---

## Key Implementation Notes

1. **AuthService** — inject `HttpClient`, `POST ${environment.apiBaseUrl}/auth/register`, `catchError` re-throws `err.error?.message ?? 'Registration failed'`.

2. **RegisterComponent**
   - `FormBuilder.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], email: ['', [Validators.required, Validators.email]] })`
   - `submitting = signal(false)`, `apiError = signal<string | null>(null)`
   - `onSubmit()` — guard on `form.invalid`, trim email, set `submitting(true)`, call `authService.register()`, on success navigate to `/`, on error set `apiError`

3. **Template structure**
   ```
   <header>  ← "SA Tax Calculator" title
   <form [formGroup]="form" (ngSubmit)="onSubmit()">
     firstName input + @if error
     lastName input  + @if error
     email input     + @if error
     @if (apiError()) { error banner }
     <button [disabled]="submitting()"> Register / spinner </button>
   </form>
   <a routerLink="/">Already registered?</a>
   ```

4. **Constitution compliance**
   - `standalone: true` ✓
   - `@if` only — no `*ngIf` ✓
   - `ReactiveFormsModule` / `FormGroup` ✓
   - `apiBaseUrl` from environment ✓

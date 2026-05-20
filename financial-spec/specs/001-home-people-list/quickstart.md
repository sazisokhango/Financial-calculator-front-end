# Quickstart: Home Page — People List

**Feature**: 001-home-people-list
**Date**: 2026-05-20

---

## What Gets Built

A single Angular standalone component (`HomeComponent`) at route `/` that:
- Fetches all registered users from the back-end on load
- Renders them as a clickable list of names
- Filters the list client-side as the user types
- Navigates to `/user/:id` on name click or `/register` on the Register button

---

## Files to Create

```
src/
├── app/
│   ├── models/
│   │   └── user.model.ts               ← User interface
│   ├── services/
│   │   └── user.service.ts             ← getAll(): Observable<User[]>
│   └── home/
│       ├── home.component.ts           ← HomeComponent (standalone)
│       ├── home.component.html         ← Template with @for / @if
│       └── home.component.css          ← Empty (Tailwind only)
```

---

## Files to Modify

```
src/app/app.routes.ts      ← Add { path: '', component: HomeComponent }
src/app/app.config.ts      ← Ensure provideHttpClient() is present
```

---

## Key Implementation Notes

1. **UserService** — inject `HttpClient`, call `GET ${environment.apiBaseUrl}/user`, map to `User[]`, pipe `catchError` to re-throw with `error.error.message`.

2. **HomeComponent**
   - Inject `UserService`, `Router`
   - `users = signal<User[]>([])`
   - `loading = signal(true)`
   - `error = signal<string | null>(null)`
   - `filterControl = new FormControl('')`
   - `filterValue = toSignal(this.filterControl.valueChanges, { initialValue: '' })`
   - `filteredUsers = computed(() => { ... })` — filter `users()` by `filterValue()`
   - `ngOnInit()` — call `userService.getAll().subscribe(...)`, set signals

3. **Template structure**
   ```
   <header>  ← app title + Register button (routerLink="/register")
   <input>   ← [formControl]="filterControl" search box
   @if (loading()) { spinner }
   @if (error()) { error banner }
   @if (!loading() && !error()) {
     @if (filteredUsers().length === 0) { empty state }
     @else {
       @for (user of filteredUsers(); track user.id) {
         <button (click)="goToDashboard(user.id)">{{ user.firstName }} {{ user.lastName }}</button>
       }
     }
   }
   ```

4. **Constitution compliance checkpoints**
   - `standalone: true` on `HomeComponent` ✓
   - `@for` / `@if` only — no `*ngFor` / `*ngIf` ✓
   - `FormControl` from ReactiveFormsModule ✓
   - `apiBaseUrl` from environment only ✓
   - No JWT / session stored ✓

---

## Running Locally

```bash
# Terminal 1 — back-end must be running
cd ~/Desktop/Financial-calculator-back-end
./mvnw spring-boot:run

# Terminal 2 — front-end
cd ~/Desktop/Financial-calculator-front-end
nvm use 20
ng serve
# Open http://localhost:4200
```

# Financial Calculator Front-End Constitution

## Core Principles

### I. Component Architecture (NON-NEGOTIABLE)

Every UI component MUST be an Angular standalone component.
`NgModule`-based components are forbidden.

- Components are declared with `standalone: true` in the `@Component` decorator.
- All imports (directives, pipes, child components) are listed in the component's own `imports` array.
- No `AppModule` or feature modules may be created.

### II. Template Control Flow (NON-NEGOTIABLE)

Angular's built-in control flow syntax MUST be used in all templates:

```html
@for (item of items; track item.id) { ... }
@if (condition) { ... } @else { ... }
```

`*ngFor`, `*ngIf`, and `*ngSwitch` structural directives are FORBIDDEN.
Any template using the old directive syntax MUST be rewritten before merging.

### III. Reactive Forms Only (NON-NEGOTIABLE)

All forms MUST be built with Angular Reactive Forms (`FormGroup`, `FormControl`, `FormBuilder`).
Template-driven forms (`ngModel`, `FormsModule`) are FORBIDDEN across the entire application.

- Every form field MUST have explicit validators defined in the component class.
- Validation errors MUST be read from `form.get('field')?.errors` — not from template references.
- Numeric fields that are optional default to `0` — never `null` or empty string — before submission.

### IV. API Contract Compliance

The front-end MUST consume the Spring Boot API exactly as defined in `PRD.md`.

Non-negotiable API rules:
- `POST /api/auth/register`              → `201 Created` on success, `400` on validation failure or duplicate email
- `GET  /api/user`                       → `200 OK` — full list of registered users
- `GET  /api/user/{id}`                  → `200 OK` — single user profile
- `POST /api/tax`                        → `201 Created` — save and calculate tax
- `GET  /api/tax?userId={id}`            → `200 OK` — all calculations for a user
- `GET  /api/tax/{id}`                   → `200 OK` — single calculation
- `PUT  /api/tax/{id}`                   → `200 OK` — update and recalculate
- `DELETE /api/tax/{id}`                 → `204 No Content`
- `POST /api/investments/forecast`       → `201 Created` — save and calculate investment forecast
- `GET  /api/investments?userId={id}`    → `200 OK` — all forecasts for a user
- `GET  /api/investments/{id}`           → `200 OK` — single forecast with monthly projections
- `PUT  /api/investments/{id}`           → `200 OK` — update and recalculate forecast
- `DELETE /api/investments/{id}`         → `204 No Content`

The `apiBaseUrl` MUST be read exclusively from `environment.apiBaseUrl`.
No base URL, IP address, or port number may appear as a string literal in any component or service.

All API error responses follow the shape `{ status, error, message }`.
The front-end MUST display the `message` field to the user on error.

### V. User Identification Flow (NON-NEGOTIABLE)

There is no password-based login. The identity flow is:

```
/ (Home — people list) → user clicks name → /user/:id (Dashboard)
                       → name not in list → /register → on success → /
```

- The `userId` from the URL parameter (`:id`) is the sole identity carrier across all routes.
- The `userEmail` for tax submissions is resolved by calling `GET /api/user/{id}` — never entered
  by the user manually or stored in `localStorage`.
- No JWT, session token, or authentication header is used in this release.

### VI. Tab Navigation Standard (NON-NEGOTIABLE)

The `DashboardComponent` MUST implement tab switching using Angular Router query parameters.

- Active tab is determined by the `tab` query parameter: `?tab=tax` (default) or `?tab=investments`
- Tab links MUST use `[routerLink]` with `[queryParams]` — never imperative `router.navigate` for tab UI
- `queryParamsHandling: 'merge'` MUST be used to preserve the `:id` route param when switching tabs
- A page reload MUST NOT occur when switching tabs; only the query param changes
- Deep-linking to a tab MUST work (e.g. navigating directly to `/user/1?tab=investments` shows the correct tab)
- Each tab's content section is conditionally rendered using `@if` based on the active tab

---

## Technology Stack

- **Framework**: Angular 21 — standalone components
- **Styling**: Tailwind CSS v4 — utility classes only; accent colour `indigo-600`; no custom CSS files
- **Forms**: Angular Reactive Forms — `FormBuilder`, `FormGroup`, `FormControl`, `Validators`
- **HTTP**: Angular `HttpClient` via `provideHttpClient()` in `app.config.ts`
- **Routing**: Angular Router via `provideRouter()` in `app.config.ts`
- **Locale**: `en-ZA` — monetary values formatted as `R #,###.##`, dates as `dd MMM yyyy`
- **Node**: v20 (via nvm)
- **Package manager**: npm

No CSS framework other than Tailwind may be introduced.
No component library (Angular Material, PrimeNG, etc.) may be added without a constitution amendment.

---

## UI & Development Standards

- **Monetary display**: Angular `CurrencyPipe` with locale `en-ZA` and currency code `ZAR`
- **Date display**: Angular `DatePipe` with format `'dd MMM yyyy'`
- **Loading state**: spinner shown inside the triggering button; never block the entire page
- **Error display**: red banner or inline error below the relevant field using the API `message` value
- **Delete actions**: MUST show a confirmation dialog before calling any `DELETE` endpoint
- **Empty states**: every list view MUST render a friendly message when the list is empty
- **Naming**: components use `kebab-case` file names matching the route they serve
  (e.g., `home.component.ts`, `register.component.ts`, `dashboard.component.ts`)
- **Services**: one service per API resource — `auth.service.ts`, `user.service.ts`, `tax.service.ts`, `investment.service.ts`
- **SpecKit specs**: one spec file per component and service; spec name mirrors the source file
  (e.g., `home.component.spec.ts`)

---

## Route Map

| Path                                              | Component                    |
|---------------------------------------------------|------------------------------|
| `/`                                               | `HomeComponent`              |
| `/register`                                       | `RegisterComponent`          |
| `/user/:id`                                       | `DashboardComponent`         |
| `/user/:id/calculate`                             | `CalculateComponent`         |
| `/user/:id/calculations/:calcId`                  | `ViewCalculationComponent`   |
| `/user/:id/calculations/:calcId/edit`             | `EditCalculationComponent`   |
| `/user/:id/investments/forecast`                  | `InvestmentForecastComponent`|
| `/user/:id/investments/:forecastId`               | `ViewInvestmentComponent`    |
| `/user/:id/investments/:forecastId/edit`          | `EditInvestmentComponent`    |

---

## Governance

This constitution supersedes all other development practices for this front-end project.
Amendments require:

1. A documented reason for the change.
2. An updated version number following semantic versioning:
   - **MAJOR**: removal or redefinition of a principle.
   - **MINOR**: new principle or section added.
   - **PATCH**: clarifications or wording fixes.
3. `LAST_AMENDED_DATE` updated to the date of the amendment.

All implementation plans, task lists, and code reviews MUST verify compliance with
these principles before proceeding.
Refer to `PRD.md` for originating product requirements.

**Version**: 1.1.0 | **Ratified**: 2026-05-20 | **Last Amended**: 2026-05-21

**Amendment 1.1.0** (2026-05-21): Added Section VI — Tab Navigation Standard for `DashboardComponent`; added Investment Forecast API endpoints to Section IV; added `investment.service.ts` to services list; added 3 new investment routes to Route Map.

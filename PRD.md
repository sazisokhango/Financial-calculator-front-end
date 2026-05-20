# Product Requirements Document
## SA Tax Calculator — Angular Front-End

**Version**: 1.0.0
**Date**: 2026-05-20
**Status**: Approved

---

## 1. Overview

An Angular 21 single-page application that lets South African employees register, identify themselves from a shared user list, perform SARS-compliant tax calculations, and manage their saved calculation history.

There is no password-based login. Users register once with their name and email, then re-identify themselves by selecting their name from the home screen on each visit.

---

## 2. Goals

- Present a clean people-selection entry point that scales to a workplace team
- Guide unregistered users through a frictionless one-time registration
- Provide a full tax calculation form aligned with SARS 2024/2025 tables
- Allow users to save, view, edit, and delete their own calculations
- Consume the Spring Boot API at `http://localhost:8080/api` (never hard-coded — environment files only)

---

## 3. Tech Stack

| Concern        | Decision                                         |
|----------------|--------------------------------------------------|
| Framework      | Angular 21 — standalone components only          |
| Styling        | Tailwind CSS v4 — utility classes, accent indigo-600 |
| Forms          | Angular Reactive Forms only — no Template Forms  |
| HTTP           | Angular `HttpClient` via `provideHttpClient()`   |
| Routing        | Angular Router — `provideRouter()`               |
| Templates      | `@for` / `@if` control flow — no `*ngFor`/`*ngIf` |
| Testing        | SpecKit SDD — one spec file per component/service |
| API Base URL   | `environment.apiBaseUrl` (never inline)          |

---

## 4. Application Flow

```
/ (Home — people list)
  │
  ├─ Name found → click → /user/:id  (Dashboard)
  │                          │
  │                          ├─ View saved calculations
  │                          ├─ Click calculation → /user/:id/calculations/:calcId (View)
  │                          │                          └─ Edit → /user/:id/calculations/:calcId/edit
  │                          └─ New Calculation → /user/:id/calculate
  │
  └─ Name not found → /register → on success → / (Home)
```

---

## 5. Routes

| Path                                          | Component               | Guard      |
|-----------------------------------------------|-------------------------|------------|
| `/`                                           | HomeComponent           | None       |
| `/register`                                   | RegisterComponent       | None       |
| `/user/:id`                                   | DashboardComponent      | None       |
| `/user/:id/calculate`                         | CalculateComponent      | None       |
| `/user/:id/calculations/:calcId`              | ViewCalculationComponent| None       |
| `/user/:id/calculations/:calcId/edit`         | EditCalculationComponent| None       |

> No route guards are required for this release — user identity is carried by the URL `userId` parameter.

---

## 6. Features

---

### Feature 1 — Home Page (People List)

**Route**: `/`

**Purpose**: Display all registered users so a person can identify themselves.

**Behaviour**:
- On load, call `GET /api/user` and render the full list
- Each list item shows the user's full name (`firstName lastName`)
- Clicking a name navigates to `/user/:id`
- A **"Register"** button in the header navigates to `/register` for users whose name does not appear

**API**:
```
GET /api/user
Response 200: [{ "id": 1, "firstName": "Saziso", "lastName": "Khango", "email": "..." }, ...]
```

**UI Notes**:
- Show a loading indicator while the list is being fetched
- Show a friendly empty state if no users are registered yet
- Search/filter input to find a name quickly (client-side filter, no extra API call)

---

### Feature 2 — Registration

**Route**: `/register`

**Purpose**: Allow a first-time user to create their account.

**Form Fields**:
| Field     | Type  | Required | Validation                    |
|-----------|-------|----------|-------------------------------|
| firstName | text  | Yes      | Not empty                     |
| lastName  | text  | Yes      | Not empty                     |
| email     | email | Yes      | Valid email format            |

**Behaviour**:
- Submit calls `POST /api/auth/register`
- `201 Created` → navigate to `/` (Home)
- `400 Bad Request` → display error message returned by the API
- Show inline validation errors before submit

**API**:
```
POST /api/auth/register
Body: { "firstName": "Saziso", "lastName": "Khango", "email": "saziso@example.com" }

Response 201: { "id": 1, "firstName": "Saziso", "lastName": "Khango", "email": "saziso@example.com" }
Response 400: { "status": 400, "error": "Bad Request", "message": "Email already registered" }
```

**UI Notes**:
- "Already registered?" link navigates back to `/`
- Disable submit button while request is in flight
- Show spinner on submit button during loading

---

### Feature 3 — User Dashboard

**Route**: `/user/:id`

**Purpose**: Show the user's saved calculations and provide navigation to create a new one.

**Behaviour**:
- On load, call `GET /api/tax?userId={id}` to fetch saved calculations
- Display each calculation as a card showing: title, description, date created
- Clicking a card navigates to `/user/:id/calculations/:calcId`
- **"New Calculation"** button navigates to `/user/:id/calculate`
- Show empty state if the user has no saved calculations

**API**:
```
GET /api/tax?userId={id}
Response 200: [ TaxCalculationResponse, ... ]
```

**UI Notes**:
- Page header shows the user's full name (fetch from `GET /api/user/{id}` on load)
- Loading state while data is being fetched
- Cards show: title, description (truncated), formatted date, and a delete icon
- Delete icon shows a confirmation dialog before calling `DELETE /api/tax/{calcId}`

---

### Feature 4 — Tax Calculation Form (New)

**Route**: `/user/:id/calculate`

**Purpose**: Allow the user to enter income and deduction data and submit for calculation.

**Form Fields**:
| Field             | Type   | Required | Default | Validation |
|-------------------|--------|----------|---------|------------|
| title             | text   | Yes      | —       | Not empty  |
| description       | text   | No       | —       | —          |
| salary            | number | No       | 0       | >= 0       |
| interestIncome    | number | No       | 0       | >= 0       |
| dividend          | number | No       | 0       | >= 0       |
| capitalGain       | number | No       | 0       | >= 0       |
| bonus             | number | No       | 0       | >= 0       |
| retirementAnnuity | number | No       | 0       | >= 0       |
| taxAlreadyPaid    | number | No       | 0       | >= 0       |
| age               | number | Yes      | —       | >= 0       |

**Behaviour**:
- `userEmail` is sourced from the logged-in user's profile (fetched via `GET /api/user/{id}`) — never entered manually
- Empty numeric fields default to `0` before submission
- Submit calls `POST /api/tax`
- On success (`201 Created`) navigate to `/user/:id/calculations/:calcId` (view result)
- On error show the API error message

**API**:
```
POST /api/tax
Body: {
  "userEmail": "saziso@example.com",
  "title": "Annual Tax Calculation",
  "description": "...",
  "salary": 500000.00,
  "interestIncome": 15000.00,
  "dividend": 8000.00,
  "capitalGain": 20000.00,
  "bonus": 25000.00,
  "retirementAnnuity": 30000.00,
  "taxAlreadyPaid": 70000.00,
  "age": 35
}

Response 201: TaxCalculationResponse (see Section 7)
```

---

### Feature 5 — View Calculation

**Route**: `/user/:id/calculations/:calcId`

**Purpose**: Display the full tax breakdown for a saved calculation.

**Behaviour**:
- On load call `GET /api/tax/{calcId}`
- Display all inputs and the calculated results in clearly labelled sections
- **"Edit"** button navigates to `/user/:id/calculations/:calcId/edit`
- **"Delete"** button shows confirmation dialog then calls `DELETE /api/tax/{calcId}` → navigate to `/user/:id`
- **"Back"** link navigates to `/user/:id`

**Displayed Sections**:

*Inputs*
- Title, Description, Salary, Interest Income, Dividend, Capital Gain, Bonus, Retirement Annuity, Tax Already Paid, Age

*Tax Breakdown*
| Label                | Field               |
|----------------------|---------------------|
| Total Gross Income   | totalGrossIncome    |
| Total Deductions     | totalDeductions     |
| Net Taxable Income   | netTaxableIncome    |
| Tax Before Rebate    | taxBeforeRebate     |
| Rebate               | rebate              |
| Final Tax Liability  | finalTaxLiability   |

**API**:
```
GET /api/tax/{calcId}
Response 200: TaxCalculationResponse
Response 404: { "status": 404, "error": "Not Found", "message": "Calculation not found" }
```

---

### Feature 6 — Edit Calculation

**Route**: `/user/:id/calculations/:calcId/edit`

**Purpose**: Allow the user to modify an existing calculation and recalculate.

**Behaviour**:
- On load call `GET /api/tax/{calcId}` and pre-populate the form
- Same form fields and validation as Feature 4
- Submit calls `PUT /api/tax/{calcId}`
- On success (`200 OK`) navigate to `/user/:id/calculations/:calcId` (view updated result)
- On error show the API error message

**API**:
```
PUT /api/tax/{calcId}
Body: Same as POST /api/tax
Response 200: TaxCalculationResponse
```

---

## 7. TaxCalculationResponse Shape

```json
{
  "id": 1,
  "title": "Annual Tax Calculation",
  "description": "Tax calculation for the 2025 financial year",
  "salary": 500000.00,
  "interestIncome": 15000.00,
  "dividend": 8000.00,
  "capitalGain": 20000.00,
  "bonus": 25000.00,
  "retirementAnnuity": 30000.00,
  "taxAlreadyPaid": 70000.00,
  "age": 35,
  "totalGrossIncome": 568000.00,
  "totalDeductions": 30000.00,
  "netTaxableIncome": 538000.00,
  "taxBeforeRebate": 120000.00,
  "rebate": 17000.00,
  "finalTaxLiability": 103000.00,
  "createdAt": "2025-03-01T10:15:30",
  "updatedAt": "2025-03-01T10:20:45"
}
```

---

## 8. Shared UI Conventions

- **Accent colour**: indigo-600
- **Monetary values**: formatted as `R #,###.##` using Angular `CurrencyPipe` with locale `en-ZA`
- **Dates**: formatted as `dd MMM yyyy` (e.g. `01 Mar 2025`)
- **Loading state**: spinner shown inside the button or as a full-section overlay
- **Error state**: red banner below form or card with the API error message
- **Confirmation dialog**: used before any delete action
- **Control flow**: `@for` and `@if` only — never `*ngFor` or `*ngIf`
- **Forms**: Reactive Forms only — no Template-driven forms

---

## 9. API Error Response Shape

All API errors follow this shape:
```json
{ "status": 400, "error": "Bad Request", "message": "Descriptive message" }
```

The front-end must extract and display the `message` field to the user.

---

## 10. Feature Roadmap

| # | Feature                    | Branch                          | Priority |
|---|----------------------------|---------------------------------|----------|
| 1 | Home — People List         | `feature/001-home-people-list`  | P1       |
| 2 | Registration               | `feature/002-registration`      | P1       |
| 3 | User Dashboard             | `feature/003-user-dashboard`    | P2       |
| 4 | Tax Calculation Form       | `feature/004-tax-calculation`   | P2       |
| 5 | View Calculation           | `feature/005-view-calculation`  | P3       |
| 6 | Edit Calculation           | `feature/006-edit-calculation`  | P3       |

Each feature is developed on its own branch following the SDD workflow:
`specify plan` → `specify tasks` → `specify implement` → PR to `main`

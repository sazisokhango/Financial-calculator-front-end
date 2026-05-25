# Feature Specification: Property Bond Forecast

**Feature Branch**: `feature/008-property-bond-forecast`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Property Bond Forecast — add a new Property Bond Forecast tab to the existing financial calculator application, allowing users to enter bond details, calculate repayment projections, view a forecast summary, and view a month-by-month repayment breakdown. Navigation changes: add a third 'Property Bond Forecast' tab to the Dashboard alongside the existing Tax Calculator and Investment Forecast tabs, switchable without page reload."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Bond Forecast (Priority: P1)

A registered user on their dashboard switches to the Property Bond Forecast tab and clicks "New Bond Forecast". They fill in a title, optional description, initial loan amount, monthly contribution, term in months, and annual interest rate, then click "Calculate Bond Forecast". The system calculates and saves the bond forecast, then navigates to the result page showing a summary (total loan amount, total repayments, total interest paid, remaining balance, estimated payoff month, and whether the bond is fully paid) and a full month-by-month repayment table.

**Why this priority**: Core value of the feature — without it nothing else is meaningful.

**Independent Test**: Navigate to `/user/:id/bonds/forecast`, fill title="Family Home", initialAmount=1200000, monthlyContribution=12000, termMonths=240, interestRate=11 — submit and verify the result page renders the summary and a 240-row repayment table.

**Acceptance Scenarios**:

1. **Given** a user is on the Dashboard Property Bond Forecast tab, **When** they click "New Bond Forecast", **Then** they are taken to the new bond forecast form.
2. **Given** the form is filled with valid inputs, **When** the user clicks "Calculate Bond Forecast", **Then** a loading state appears on the button, the API is called, and on success the user is navigated to the bond result page.
3. **Given** the bond result page loads, **When** the page renders, **Then** it shows the forecast summary (total loan amount, total repayments, total interest paid, remaining balance, estimated payoff month, fully paid status) and a month-by-month repayment table (month, starting balance, monthly payment, interest charged, principal paid, ending balance).
4. **Given** the API returns an error, **When** the submission fails, **Then** an error message is displayed and the user remains on the form.

---

### User Story 2 - View Saved Bond Forecasts on Dashboard Tab (Priority: P1)

A returning user opens the Dashboard and clicks the "Property Bond Forecast" tab. The tab loads their previously saved bond forecasts as cards. Each card shows the title, a truncated description, and the date created. Switching back to the "Tax Calculator" or "Investment Forecast" tab restores the respective list — no page reload occurs.

**Why this priority**: Tab navigation is the main structural change to the existing dashboard; it gates access to all bond functionality.

**Independent Test**: Navigate directly to `/user/:id?tab=bonds`, verify the Property Bond Forecast tab is active and bond cards render. Click "Tax Calculator" tab — URL updates to `?tab=tax` and tax calculations appear. Click "Investment Forecast" tab — URL updates to `?tab=investments`. No page reload occurs during any switch.

**Acceptance Scenarios**:

1. **Given** a user is on `/user/:id`, **When** they click the "Property Bond Forecast" tab, **Then** the URL updates to `?tab=bonds` and the bond forecast card list is displayed without a page reload.
2. **Given** the Property Bond Forecast tab is active, **When** the user clicks the "Tax Calculator" tab, **Then** the URL updates to `?tab=tax` and the tax calculation list is displayed without a page reload.
3. **Given** the user navigates directly to `/user/:id?tab=bonds`, **When** the page loads, **Then** the Property Bond Forecast tab is active and bond forecasts are loaded.
4. **Given** the user has no saved bond forecasts, **When** the Property Bond Forecast tab is active, **Then** a friendly empty-state message is shown.

---

### User Story 3 - View Bond Forecast Result (Priority: P2)

A user clicks on a saved bond forecast card from the dashboard. The bond result page loads and displays all input values, the full forecast summary, and the month-by-month repayment table. The user can navigate back to the dashboard, edit the bond, or delete it.

**Why this priority**: Viewing a saved result is the read path — required for the feature to be complete but does not block initial forecast creation.

**Independent Test**: Click a bond forecast card → result page at `/user/:id/bonds/:bondId` renders all summary fields and all repayment table rows with correctly formatted monetary values in South African Rand.

**Acceptance Scenarios**:

1. **Given** a user clicks a bond forecast card, **When** the view page loads, **Then** all input fields (title, description, initial amount, monthly contribution, term, interest rate) and all summary fields are displayed with correct formatting.
2. **Given** the view page is loaded, **When** the user inspects the monthly repayment table, **Then** all rows from month 1 to the end of the term are present, each showing starting balance, monthly payment, interest charged, principal paid, and ending balance.
3. **Given** the view page is loaded, **When** the user clicks "Back", **Then** they are navigated to `/user/:id?tab=bonds`.
4. **Given** the view page is loaded, **When** the user clicks "Delete" and confirms, **Then** the bond forecast is deleted and the user is navigated to `/user/:id?tab=bonds`.

---

### User Story 4 - Edit Bond Forecast (Priority: P2)

A user views a saved bond forecast and clicks "Edit". The form is pre-populated with the existing values. The user modifies one or more fields and submits. The system recalculates, saves the updated forecast, and navigates back to the updated result page.

**Why this priority**: Editing enables iterative planning — users can adjust loan terms and compare outcomes.

**Independent Test**: Load an existing bond forecast's edit page, change the interest rate, submit, and confirm the result page reflects the updated calculation.

**Acceptance Scenarios**:

1. **Given** a user clicks "Edit" on a bond result page, **When** the edit form loads, **Then** all fields are pre-populated with the existing bond forecast values.
2. **Given** the user changes one or more fields and clicks "Save Changes", **When** the API call succeeds, **Then** the user is navigated to the updated bond result page.
3. **Given** the edit form has validation errors, **When** the user tries to submit, **Then** the form does not submit and inline error messages appear below the affected fields.

---

### Edge Cases

- What happens when initialAmount is 0 or monthlyContribution is 0?
- How does the system handle a term of 1 month?
- What happens if the API is unreachable during bond forecast submission?
- What happens when a bond forecast ID in the URL does not exist?
- What happens if the user navigates directly to `/user/:id?tab=bonds` with no bond forecasts saved?
- What happens if interest rate is entered as 0 (valid — no interest, pure principal repayment)?
- What happens if the monthly contribution is less than the monthly interest — the bond will never be paid off?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Dashboard MUST display three tabs — "Tax Calculator", "Investment Forecast", and "Property Bond Forecast" — that switch the active content panel without triggering a page reload.
- **FR-002**: The active tab MUST be determined by the `tab` query parameter (`?tab=tax`, `?tab=investments`, or `?tab=bonds`); the default when no parameter is present MUST be `?tab=tax`.
- **FR-003**: Deep-linking to the Property Bond Forecast tab (e.g. `/user/:id?tab=bonds`) MUST activate the correct tab and load its content.
- **FR-004**: The Property Bond Forecast tab MUST fetch and display the user's saved bond forecasts as cards showing title, truncated description, and formatted creation date.
- **FR-005**: Each bond forecast card MUST have a delete icon that shows a confirmation dialog before deleting the forecast.
- **FR-006**: An empty-state message MUST be shown when the user has no saved bond forecasts.
- **FR-007**: The new bond forecast form MUST include the following fields: title (text, required), description (textarea, optional), initial amount (currency input, required), monthly contribution (currency input, required), term in months (number, required), interest rate % (number, required).
- **FR-008**: The form MUST validate inputs and display inline error messages below the affected field:
  - Title: cannot be empty
  - Initial Amount: must be greater than 0
  - Monthly Contribution: must be greater than 0
  - Term: must be greater than 0
  - Interest Rate: must be between 0 and 100 (inclusive)
- **FR-009**: The form MUST NOT submit while any validation errors are present.
- **FR-010**: On submission, the "Calculate Bond Forecast" button MUST show a loading state while the API request is in flight and MUST be disabled to prevent duplicate submissions.
- **FR-011**: On successful bond forecast creation (201), the user MUST be navigated to the bond forecast result page.
- **FR-012**: The bond forecast result page MUST display: all input values, the forecast summary (total loan amount, total repayments, total interest paid, remaining balance, estimated payoff month, fully paid status), and a month-by-month repayment table.
- **FR-013**: The monthly repayment table MUST show, for each month: month number, starting balance, monthly payment, interest charged, principal paid, and ending balance.
- **FR-014**: All monetary values MUST be formatted as `R #,###.##` using the `en-ZA` locale.
- **FR-015**: The bond forecast result page MUST provide "Edit", "Delete", and "Back" actions.
- **FR-016**: The edit bond forecast form MUST pre-populate with the existing bond forecast values and follow the same validation rules as the new forecast form.
- **FR-017**: On successful edit (200), the user MUST be navigated to the updated bond forecast result page.
- **FR-018**: Any API error MUST result in an error message displaying the API `message` field to the user.
- **FR-019**: The `userEmail` used for creating and listing bond forecasts MUST be sourced from the loaded `User` object — never entered manually by the user.

### Key Entities

- **PropertyBond**: Represents a saved bond repayment projection. Key attributes: id, userEmail, title, description, initialAmount, monthlyContribution, termMonths, interestRate, forecastResults (BondForecastResult), monthlyProjection (BondMonthlyProjection[]).
- **BondForecastResult**: Summary of the bond calculation. Attributes: totalLoanAmount, totalRepayments, totalInterestPaid, remainingBalance, estimatedPayoffMonth, fullyPaid (boolean).
- **BondMonthlyProjection**: A single row in the month-by-month repayment breakdown. Attributes: month, startingBalance, monthlyPayment, interestCharged, principalPaid, endingBalance.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between all three dashboard tabs and see the correct content in under 1 second, with no page reload occurring.
- **SC-002**: Users can submit a new bond forecast and see the full result page (summary + monthly repayment table) within 3 seconds under normal network conditions.
- **SC-003**: 100% of validation errors are surfaced inline below the affected field before submission is attempted.
- **SC-004**: All monetary values on the result page and repayment table are displayed in South African Rand format (`R #,###.##`).
- **SC-005**: Deep-linking directly to the Property Bond Forecast tab (`?tab=bonds`) correctly activates the tab and loads bond data without requiring tab interaction.
- **SC-006**: Users can complete the full create → view → edit → delete lifecycle for a bond forecast without leaving the application or encountering unhandled errors.

---

## Assumptions

- All users are already registered; this feature does not introduce a new registration flow.
- The backend performs the bond repayment calculation — the front-end only submits inputs and renders the response.
- The monthly repayment projection array in the API response contains one entry per month for the full term; the front-end renders all rows without pagination.
- The `userEmail` in the bond request body is sourced from the `User` object returned by `userService.getById(userId)`, which is already loaded on the dashboard.
- The `fullyPaid` field in the forecast summary is a boolean returned by the backend — the front-end displays it as "Yes" / "No".
- Deleting a bond forecast from the dashboard card and from the result page both navigate back to `/user/:id?tab=bonds`.
- The description field is optional and may be blank; the UI handles gracefully when it is absent.
- There is no upper limit imposed by the front-end on the number of months in a term — the backend enforces any business limits.
- The `createdAt` field is not part of the backend response DTO; the dashboard card date will be omitted or derived if available in a future version.

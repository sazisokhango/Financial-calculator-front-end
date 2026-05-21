# Feature Specification: Investment Forecast

**Feature Branch**: `feature/007-investment-forecast`

**Created**: 2026-05-21

**Status**: Draft

**Input**: User description: "Investment Forecast — add a new investment forecast table to the existing financial calculator app, allowing users to enter investment details, calculate investment growth projections, view forecast summary results, and view monthly projection data. Navigation changes: Tax Calculator tab and Investment Forecast tab on the Dashboard, switchable without page reload."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Investment Forecast (Priority: P1)

A registered user on their dashboard switches to the Investment Forecast tab and clicks "New Forecast". They fill in an investment title, initial amount, monthly contribution, term in months, and annual interest rate, then click "Calculate Forecast". The system calculates and saves the forecast, then navigates to the result page showing a summary (final projected value, total contributions, total interest earned, ROI percentage, average monthly growth) and a full month-by-month projection table.

**Why this priority**: This is the core value of the feature — without it, nothing else is meaningful.

**Independent Test**: Can be fully tested by navigating to the new forecast form, filling in valid inputs, submitting, and verifying the result page renders the summary and monthly table correctly.

**Acceptance Scenarios**:

1. **Given** a user is on the Dashboard Investment Forecast tab, **When** they click "New Forecast", **Then** they are taken to the new forecast form.
2. **Given** the form is filled with valid inputs, **When** the user clicks "Calculate Forecast", **Then** a loading state appears on the button, the API is called, and on success the user is navigated to the forecast result page.
3. **Given** the forecast result page loads, **When** the page renders, **Then** it shows the forecast summary section (final projected value, total contributions, total interest earned, ROI %, average monthly growth) and a month-by-month table (month, starting balance, monthly contribution, interest earned, ending balance).
4. **Given** the API returns an error, **When** the submission fails, **Then** an error message is displayed and the user remains on the form.

---

### User Story 2 - View Saved Forecasts on Dashboard Tab (Priority: P1)

A returning user opens the Dashboard and clicks the "Investment Forecast" tab. The tab loads their previously saved forecasts as cards. Each card shows the title, a truncated description, and the date created. Switching back to the "Tax Calculator" tab restores the tax calculation list — no page reload occurs.

**Why this priority**: Tab navigation is the main structural change to the existing dashboard; it gates access to all investment functionality.

**Independent Test**: Can be tested by having at least one saved forecast, navigating to `/user/:id?tab=investments`, verifying the forecast cards render, then clicking the "Tax Calculator" tab and confirming the URL updates to `?tab=tax` and tax calculations appear — all without a page reload.

**Acceptance Scenarios**:

1. **Given** a user is on `/user/:id`, **When** they click the "Investment Forecast" tab, **Then** the URL updates to `?tab=investments` and the investment forecast card list is displayed without a page reload.
2. **Given** the Investment Forecast tab is active, **When** the user clicks the "Tax Calculator" tab, **Then** the URL updates to `?tab=tax` and the tax calculation list is displayed without a page reload.
3. **Given** the user navigates directly to `/user/:id?tab=investments`, **When** the page loads, **Then** the Investment Forecast tab is active and forecasts are loaded.
4. **Given** the user has no saved forecasts, **When** the Investment Forecast tab is active, **Then** a friendly empty-state message is shown.

---

### User Story 3 - View Forecast Result (Priority: P2)

A user clicks on a saved forecast card from the dashboard. The forecast result page loads and displays all input values, the full forecast summary, and the month-by-month projection table. The user can navigate back to the dashboard, edit the forecast, or delete it.

**Why this priority**: Viewing a saved result is the read path — required for the feature to be complete but does not block initial forecast creation.

**Independent Test**: Can be tested by clicking an existing forecast card and verifying all summary fields and projection table rows render with correctly formatted monetary values.

**Acceptance Scenarios**:

1. **Given** a user clicks a forecast card, **When** the view page loads, **Then** all input fields (title, description, initial amount, monthly contribution, term, interest rate) and all summary fields are displayed with correct formatting.
2. **Given** the view page is loaded, **When** the user inspects the monthly projection table, **Then** all rows from month 1 to the end of the term are present, each showing starting balance, monthly contribution, interest earned, and ending balance.
3. **Given** the view page is loaded, **When** the user clicks "Back", **Then** they are navigated to `/user/:id?tab=investments`.
4. **Given** the view page is loaded, **When** the user clicks "Delete" and confirms, **Then** the forecast is deleted and the user is navigated to `/user/:id?tab=investments`.

---

### User Story 4 - Edit Forecast (Priority: P2)

A user views a saved forecast and clicks "Edit". The form is pre-populated with the existing values. The user modifies one or more fields and submits. The system recalculates, saves the updated forecast, and navigates back to the updated result page.

**Why this priority**: Editing enables iterative planning — users can adjust assumptions and compare outcomes.

**Independent Test**: Can be tested by loading an existing forecast's edit page, changing the interest rate, submitting, and confirming the result page reflects the updated calculation.

**Acceptance Scenarios**:

1. **Given** a user clicks "Edit" on a forecast result page, **When** the edit form loads, **Then** all fields are pre-populated with the existing forecast values.
2. **Given** the user changes one or more fields and clicks "Calculate Forecast", **When** the API call succeeds, **Then** the user is navigated to the updated forecast result page.
3. **Given** the edit form has validation errors, **When** the user tries to submit, **Then** the form does not submit and inline error messages appear below the affected fields.

---

### Edge Cases

- What happens when all numeric inputs are set to 0 (e.g., initialAmount = 0, monthlyContribution = 0)?
- How does the system handle a term of 1 month?
- What happens if the API is unreachable during forecast submission?
- What happens when a forecast ID in the URL does not exist?
- What happens if the user directly deep-links to `/user/:id?tab=investments` with no forecasts saved?
- What happens if interest rate is entered as 0 (valid but edge case — no interest growth)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Dashboard MUST display two tabs — "Tax Calculator" and "Investment Forecast" — that switch the active content panel without triggering a page reload.
- **FR-002**: The active tab MUST be determined by the `tab` query parameter (`?tab=tax` or `?tab=investments`); the default when no parameter is present MUST be `?tab=tax`.
- **FR-003**: Deep-linking to a tab (e.g., navigating directly to `/user/:id?tab=investments`) MUST activate the correct tab and load its content.
- **FR-004**: The Investment Forecast tab MUST fetch and display the user's saved forecasts as cards showing title, truncated description, and formatted creation date.
- **FR-005**: Each forecast card MUST have a delete icon that shows a confirmation dialog before deleting the forecast.
- **FR-006**: An empty-state message MUST be shown when the user has no saved forecasts.
- **FR-007**: The new forecast form MUST include the following fields: title (text, required), description (textarea, optional), initial amount (currency input, required), monthly contribution (currency input, required), term in months (number, required), annual interest rate (number, required).
- **FR-008**: The form MUST validate inputs and display inline error messages below the affected field:
  - Title: cannot be empty
  - Initial Amount: cannot be negative
  - Monthly Contribution: cannot be negative
  - Term: must be greater than 0
  - Annual Interest Rate: must be between 0 and 100 (inclusive)
- **FR-009**: The form MUST NOT submit while any validation errors are present.
- **FR-010**: On submission, the "Calculate Forecast" button MUST show a loading state while the API request is in flight and MUST be disabled to prevent duplicate submissions.
- **FR-011**: On successful forecast creation (201), the user MUST be navigated to the forecast result page.
- **FR-012**: The forecast result page MUST display: all input values, the forecast summary (final projected value, total contributions, total interest earned, ROI percentage, average monthly growth), and a month-by-month projection table.
- **FR-013**: The monthly projection table MUST show, for each month: month number, starting balance, monthly contribution, interest earned, and ending balance.
- **FR-014**: All monetary values MUST be formatted as `R #,###.##` using the `en-ZA` locale.
- **FR-015**: The forecast result page MUST provide "Edit", "Delete", and "Back" actions.
- **FR-016**: The edit forecast form MUST pre-populate with the existing forecast values and follow the same validation rules as the new forecast form.
- **FR-017**: On successful edit (200), the user MUST be navigated to the updated forecast result page.
- **FR-018**: Any API error MUST result in an error message displaying the API `message` field to the user.
- **FR-019**: The `userId` used for creating and listing forecasts MUST be sourced from the URL `:id` parameter — never entered manually by the user.

### Key Entities

- **InvestmentForecast**: Represents a saved investment projection. Key attributes: id, userId, title, description, initialAmount, monthlyContribution, termMonths, annualInterestRate, finalProjectedValue, totalContributions, totalInterestEarned, roiPercentage, averageMonthlyGrowth, createdAt, updatedAt.
- **MonthlyProjection**: A single row in the month-by-month breakdown. Attributes: month (number), startingBalance, monthlyContribution, interestEarned, endingBalance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between the Tax Calculator and Investment Forecast tabs and see the correct content in under 1 second, with no page reload occurring.
- **SC-002**: Users can submit a new forecast and see the full result page (summary + monthly table) within 3 seconds under normal network conditions.
- **SC-003**: 100% of validation errors are surfaced inline below the affected field before submission is attempted.
- **SC-004**: All monetary values on the result page and projection table are displayed in South African Rand format (`R #,###.##`).
- **SC-005**: Deep-linking directly to the Investment Forecast tab (`?tab=investments`) correctly activates the tab and loads forecast data without requiring tab interaction.
- **SC-006**: Users can complete the full create → view → edit → delete lifecycle for an investment forecast without leaving the application or encountering unhandled errors.

## Assumptions

- All users are already registered; this feature does not introduce a new registration flow.
- The backend performs the compound interest calculation — the front-end only submits inputs and renders the response.
- Interest is compounded monthly (implied by the monthly projection table structure).
- The monthly projection array in the API response contains one entry per month for the full term; the front-end renders all rows without pagination.
- ROI percentage and average monthly growth are calculated and returned by the backend, not computed in the front-end.
- The `userId` in the forecast request body is the numeric ID from the URL parameter `:id`.
- There is no upper limit imposed by the front-end on the number of months in a term — the backend enforces any business limits.
- The description field is optional and may be blank; the UI handles gracefully when it is absent.
- Deleting a forecast from the dashboard card and from the result page both navigate back to `/user/:id?tab=investments`.

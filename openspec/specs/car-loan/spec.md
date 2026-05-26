### Requirement: Loan Calculator tab on Dashboard
The Dashboard tab bar SHALL include a fourth tab labelled "Loan Calculator" that activates when the URL query param is `?tab=loans`. Switching to this tab MUST NOT trigger a page reload.

#### Scenario: User switches to Loan Calculator tab
- **WHEN** the user clicks the "Loan Calculator" tab on the Dashboard
- **THEN** the URL updates to `?tab=loans`, the loan list panel becomes visible, and no page reload occurs

#### Scenario: Deep-linking to the Loan Calculator tab
- **WHEN** the user navigates directly to `/user/:id?tab=loans`
- **THEN** the Loan Calculator tab is active and the user's loans are loaded

#### Scenario: Empty state on Loan Calculator tab
- **WHEN** the user has no saved loans and the Loan Calculator tab is active
- **THEN** a friendly empty-state message is displayed

---

### Requirement: Loan input form
The loan form SHALL include the following fields: title (text, required), description (textarea, optional), purchasePrice (currency, required), initialDeposit (currency, required), onceOffFee (currency, required), adminFee (currency, required), balloonPayment (currency, required), termMonths (number, required), interestRate (number, required).

#### Scenario: Form renders all fields
- **WHEN** the user navigates to the new loan form
- **THEN** all nine fields are visible and interactive

---

### Requirement: Loan form validation
The form SHALL validate all inputs before submission and display inline error messages below the affected field.

| Field | Rule |
|---|---|
| title | Cannot be empty |
| purchasePrice | Must be greater than 0 |
| initialDeposit | Must be ≥ 0 and must not exceed purchasePrice |
| onceOffFee | Must be ≥ 0 |
| adminFee | Must be ≥ 0 |
| balloonPayment | Must be ≥ 0 |
| termMonths | Must be > 0 |
| interestRate | Must be between 0 and 100 (inclusive) |

#### Scenario: Title validation error
- **WHEN** the user submits the form with an empty title
- **THEN** an inline error "Title is required" appears below the title field and the form does not submit

#### Scenario: Initial deposit exceeds purchase price
- **WHEN** initialDeposit is greater than purchasePrice and the user attempts to submit
- **THEN** an inline error appears below initialDeposit and the form does not submit

#### Scenario: Interest rate out of range
- **WHEN** interestRate is entered as a value outside 0–100 and the user attempts to submit
- **THEN** an inline error appears below the interestRate field and the form does not submit

#### Scenario: Valid form submits
- **WHEN** all fields pass validation and the user clicks "Calculate Loan"
- **THEN** the form submits, a loading state is shown on the button, and the API is called

---

### Requirement: Calculate Loan button loading state
While the API request is in flight the "Calculate Loan" button SHALL be disabled and display a loading spinner to prevent duplicate submissions.

#### Scenario: Loading state during submission
- **WHEN** the user clicks "Calculate Loan" and the request is in flight
- **THEN** the button is disabled and shows a spinner

---

### Requirement: Forecast results summary
After a successful API response the frontend SHALL display a forecast results summary card containing: financedAmount, monthlyRepayment, totalRepayments, totalInterestPaid, totalFeesPaid, balloonPayment, remainingBalance, estimatedPayoffMonth, fullyPaid. All monetary values MUST be formatted as `R #,###.##` using the `en-ZA` locale.

#### Scenario: Results display after successful calculation
- **WHEN** the API returns a 201 response with a `CarLoanResponse`
- **THEN** the user is navigated to the result page and all nine summary fields are displayed with correct ZAR formatting

#### Scenario: Results section hidden before calculation
- **WHEN** the loan form has not been submitted
- **THEN** the forecast results section and monthly projection table are not visible

---

### Requirement: Monthly repayment projection table
The result page SHALL display a monthly projection table with one row per month for the full term. Each row MUST show: month, startingBalance, monthlyRepayment, interestCharged, adminFee, principalPaid, endingBalance.

#### Scenario: Full table renders
- **WHEN** the result page loads for a loan with termMonths = N
- **THEN** exactly N rows are present in the projection table

#### Scenario: Monetary columns formatted correctly
- **WHEN** the projection table is visible
- **THEN** all monetary columns display values in `R #,###.##` format

---

### Requirement: Error state on API failure
If the API request fails the frontend SHALL display a user-friendly error message and preserve the user's form inputs.

#### Scenario: API error displays message
- **WHEN** the API returns an error response
- **THEN** a red error banner displays the API `message` field (or a fallback message) and the form remains populated with the user's inputs

---

### Requirement: View saved loan result
The view page SHALL display all input values, the forecast summary, and the monthly projection table for a saved loan. Actions available: Edit, Delete, Back.

#### Scenario: View page loads saved loan
- **WHEN** the user navigates to `/user/:id/loans/:loanId`
- **THEN** all inputs, the forecast summary card, and the full monthly table are rendered

#### Scenario: Delete from view page
- **WHEN** the user clicks "Delete" and confirms
- **THEN** the loan is deleted and the user is navigated to `/user/:id?tab=loans`

#### Scenario: Back navigation from view page
- **WHEN** the user clicks "Back"
- **THEN** the user is navigated to `/user/:id?tab=loans`

---

### Requirement: Edit saved loan
The edit form SHALL pre-populate all fields from the existing loan and follow the same validation rules as the create form. On successful update the user is navigated to the updated result page.

#### Scenario: Edit form pre-populated
- **WHEN** the user navigates to `/user/:id/loans/:loanId/edit`
- **THEN** all nine fields are pre-populated with the existing loan values

#### Scenario: Edit submits and navigates
- **WHEN** the user changes a field and clicks "Save Changes"
- **THEN** the API is called with PUT, and on success the user is navigated to the updated result page

---

### Requirement: Dashboard loan card list
The Loan Calculator tab on the Dashboard SHALL display the user's loans as cards. Each card MUST show: title, truncated description, and monthly repayment. A delete icon on each card MUST show a confirmation before deleting.

#### Scenario: Loan cards display correctly
- **WHEN** the user has saved loans and the Loan Calculator tab is active
- **THEN** each loan is shown as a card with title, description, and monthly repayment formatted in ZAR

#### Scenario: Delete from dashboard card
- **WHEN** the user clicks the delete icon on a loan card and confirms
- **THEN** the loan is removed from the list without a page reload

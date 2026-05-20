# Feature Specification: Tax Calculation Form

**Feature Branch**: `feature/004-tax-calculation`

**Created**: 2026-05-20

**Status**: Draft

**Input**: A user navigates to `/user/:id/calculate` and fills in income and deduction fields. On submission, the system calculates their South African tax liability, saves the result, and navigates them to the full result view. All numeric fields default to zero if left blank.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Submit a Valid Tax Calculation (Priority: P1)

A user fills in the required fields (title, age) and any relevant income fields, then submits the form. The system sends the data to the back-end, which calculates and saves the result, and navigates the user to the result view.

**Why this priority**: This is the core value of the entire application. Without it, no calculation can ever be created.

**Independent Test**: Fill in title, age, and a salary value. Submit. Confirm navigation to `/user/:id/calculations/:calcId` on `201 Created`.

**Acceptance Scenarios**:

1. **Given** the user has filled in title and age (minimum required fields),
   **When** they submit the form,
   **Then** the data is posted to `POST /api/tax` and on `201 Created` the user is navigated to `/user/:id/calculations/:calcId`.

2. **Given** numeric fields that are left empty,
   **When** the form is submitted,
   **Then** those fields default to `0` in the request payload.

3. **Given** the form is being submitted,
   **When** the request is in flight,
   **Then** the submit button is disabled and shows a loading spinner.

---

### User Story 2 — Validation Prevents Invalid Submission (Priority: P2)

A user submits the form with missing required fields or invalid values (negative numbers, missing title, missing age). Inline errors appear immediately without an API call.

**Why this priority**: Prevents bad data reaching the back-end and gives the user actionable feedback.

**Independent Test**: Submit with blank title, blank age, and a negative salary. Confirm inline errors appear and no API call is made.

**Acceptance Scenarios**:

1. **Given** the user leaves title blank and submits,
   **Then** an inline error "Title is required" is shown.

2. **Given** the user leaves age blank and submits,
   **Then** an inline error "Age is required" is shown.

3. **Given** the user enters a negative value in any numeric field and submits,
   **Then** an inline error "Must be 0 or greater" is shown for that field.

4. **Given** multiple fields are invalid simultaneously,
   **When** the user submits,
   **Then** all inline errors show at once and no API call is made.

---

### User Story 3 — API Error is Displayed (Priority: P3)

The back-end returns an error (e.g. 400 Bad Request). The error message is shown in a banner and the form remains filled in so the user can correct and resubmit.

**Why this priority**: Errors from the server must be surfaced clearly; losing the user's entered data on error is a poor experience.

**Independent Test**: Mock a 400 response. Confirm the error banner shows the API `message` and form fields retain their values.

**Acceptance Scenarios**:

1. **Given** the API returns a `400` error,
   **When** the response is received,
   **Then** an error banner shows the API `message` value.

2. **Given** the error banner is shown,
   **When** the user sees the form,
   **Then** all previously entered field values are preserved.

---

### User Story 4 — Cancel Returns to Dashboard (Priority: P4)

A user decides not to create a calculation and clicks "Cancel". They are returned to their dashboard without any API call being made.

**Why this priority**: Provides a safe exit from the form without data loss or confusion.

**Independent Test**: Click "Cancel" → confirm navigation to `/user/:id` and no POST is made.

**Acceptance Scenarios**:

1. **Given** the calculation form is open,
   **When** the user clicks "Cancel",
   **Then** the user is navigated to `/user/:id` and no API call is made.

---

### Edge Cases

- What if `GET /api/user/:id` fails when resolving userEmail? → Show error banner; do not submit.
- What if the user enters a very large salary (e.g. 999999999)? → No upper bound in v1; the back-end handles it.
- What if the user submits the form twice rapidly? → Submit button disabled during request prevents double submission.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The form MUST contain fields for title, description, salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, and age.
- **FR-002**: Title and age MUST be required; all other fields MUST default to `0` if left blank.
- **FR-003**: All numeric fields MUST validate that the value is >= 0.
- **FR-004**: The `userEmail` MUST be resolved from `GET /api/user/:id` and included in the payload; it MUST NOT be entered manually.
- **FR-005**: On valid submission, the form MUST call `POST /api/tax`.
- **FR-006**: On `201 Created`, the user MUST be navigated to `/user/:id/calculations/:newCalcId`.
- **FR-007**: On any API error, the error `message` MUST be shown in a banner; form values MUST be preserved.
- **FR-008**: The submit button MUST be disabled and show a spinner while the request is in flight.
- **FR-009**: A "Cancel" button MUST navigate to `/user/:id` without making an API call.
- **FR-010**: Inline validation errors MUST appear on submit attempt for all failing fields simultaneously.

### Key Entities

- **TaxCalculationRequest**: The POST payload. Fields: `userEmail`, `title`, `description`, `salary`, `interestIncome`, `dividend`, `capitalGain`, `bonus`, `retirementAnnuity`, `taxAlreadyPaid`, `age`.
- **TaxCalculationResponse**: The saved calculation returned on success (existing model from feature 003).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid form submissions navigate to the result view on `201 Created`.
- **SC-002**: 100% of submissions with blank title or age show inline errors and make no API call.
- **SC-003**: 100% of submissions with negative numeric values show inline errors and make no API call.
- **SC-004**: Empty numeric fields are sent as `0` — never `null` or empty string — 100% of the time.
- **SC-005**: The submit button is disabled during every in-flight request.
- **SC-006**: API error messages are shown 100% of the time when the back-end returns an error.

---

## Assumptions

- `userEmail` is fetched via `GET /api/user/:id` on component init — the user never types it.
- `description` is optional; if blank it is sent as an empty string.
- Numeric fields use `0` as default when the user leaves them blank — never `null`.
- The `TaxCalculationResponse` returned in the `201` body provides the new calculation `id` for navigation.
- No file uploads or attachments are required.

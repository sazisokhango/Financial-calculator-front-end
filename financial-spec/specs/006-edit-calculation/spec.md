# Feature Specification: Edit Calculation

**Feature Branch**: `feature/006-edit-calculation`

**Created**: 2026-05-20

**Status**: Draft

**Input**: A user navigates to `/user/:id/calculations/:calcId/edit` to update an existing tax calculation. The form is pre-populated with the saved values. On save the back-end recalculates and returns updated results; the user is navigated to the updated result view.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Pre-populate Form with Existing Values (Priority: P1)

A user clicks "Edit" on the view page. The edit form opens with every field already filled in with the values from the saved calculation, so they only need to change what has actually changed.

**Why this priority**: Without pre-population the user would have to re-enter all fields from scratch, which is the primary pain point the edit feature solves.

**Independent Test**: Navigate to `/user/:id/calculations/:calcId/edit`. Confirm every field is pre-filled with the correct value from the existing calculation.

**Acceptance Scenarios**:

1. **Given** the edit page loads for a saved calculation,
   **When** the form renders,
   **Then** title, description, salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, and age are all pre-filled with the saved values.

2. **Given** the page is loading the calculation,
   **When** the API call is in flight,
   **Then** a loading indicator is shown and the form is not yet rendered.

---

### User Story 2 — Save Updated Calculation (Priority: P2)

A user changes one or more field values and saves. The system sends the updated data to the back-end, which recalculates the tax and returns the updated result. The user is navigated to the updated result view.

**Why this priority**: This is the core action of the edit feature — without it the edit form is pointless.

**Independent Test**: Change the salary field and click "Save Changes". Confirm `PUT /api/tax/:calcId` is called with the updated payload and navigation goes to `/user/:id/calculations/:calcId` on `200 OK`.

**Acceptance Scenarios**:

1. **Given** the user has modified one or more fields,
   **When** they click "Save Changes",
   **Then** `PUT /api/tax/:calcId` is called with the full updated payload (including `userEmail`).

2. **Given** the API returns `200 OK`,
   **When** the response is received,
   **Then** the user is navigated to `/user/:id/calculations/:calcId` (the updated result view).

3. **Given** the form is being submitted,
   **When** the request is in flight,
   **Then** the submit button is disabled and shows a loading spinner.

---

### User Story 3 — Validation Prevents Invalid Save (Priority: P3)

A user clears a required field or enters a negative number before saving. Inline validation errors appear and no API call is made.

**Why this priority**: Same validation contract as the new calculation form — consistency is important.

**Independent Test**: Clear the title field and click "Save Changes". Confirm inline error shows and no PUT is made.

**Acceptance Scenarios**:

1. **Given** the user clears the title field and clicks "Save Changes",
   **Then** an inline error "Title is required" is shown and no API call is made.

2. **Given** the user enters a negative salary and clicks "Save Changes",
   **Then** an inline error "Must be 0 or greater" is shown and no API call is made.

---

### User Story 4 — API Error is Displayed (Priority: P4)

The back-end returns an error on the PUT request. The error message is shown in a banner and the form retains all current values.

**Acceptance Scenarios**:

1. **Given** the API returns an error,
   **When** the response is received,
   **Then** the error `message` is shown in a banner and form values are preserved.

---

### User Story 5 — Cancel Returns to View Page (Priority: P5)

A user decides not to save their changes. A "Cancel" button returns them to the calculation view page without making any API call.

**Independent Test**: Click "Cancel" → confirm navigation to `/user/:id/calculations/:calcId` and no PUT is made.

**Acceptance Scenarios**:

1. **Given** the edit form is open,
   **When** the user clicks "Cancel",
   **Then** the user is navigated to `/user/:id/calculations/:calcId` and no API call is made.

---

### Edge Cases

- What if `GET /api/tax/:calcId` fails on load? → Show error banner; do not render the form.
- What if `userEmail` is not available? → Block submit (same guard as feature 004).
- What if the user submits the form twice rapidly? → Submit button disabled during request prevents double submission.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On load the page MUST fetch the existing calculation via `GET /api/tax/:calcId` and pre-populate all form fields.
- **FR-002**: The form MUST contain the same fields as the new calculation form (title, description, salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, age).
- **FR-003**: Title and age MUST be required; all numeric fields MUST validate >= 0.
- **FR-004**: The `userEmail` MUST be resolved from `GET /api/user/:id` — never entered manually.
- **FR-005**: On valid submission, `PUT /api/tax/:calcId` MUST be called with the full updated payload.
- **FR-006**: On `200 OK`, the user MUST be navigated to `/user/:id/calculations/:calcId`.
- **FR-007**: On any API error, the `message` MUST be shown in a banner; form values MUST be preserved.
- **FR-008**: The submit button MUST be disabled and show a spinner while the request is in flight.
- **FR-009**: A "Cancel" button MUST navigate to `/user/:id/calculations/:calcId` without making any API call.
- **FR-010**: Inline validation errors MUST appear simultaneously on a failed submit attempt.

### Key Entities

Reuses `TaxCalculationRequest` and `TaxCalculation` from features 003–005. No new models needed.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of edit page loads pre-fill all form fields with the saved values.
- **SC-002**: 100% of valid submissions call `PUT /api/tax/:calcId` and navigate to the view page on `200 OK`.
- **SC-003**: 100% of invalid submissions show inline errors and make no API call.
- **SC-004**: API errors display the `message` in a banner 100% of the time.
- **SC-005**: The submit button is disabled during every in-flight request.

---

## Assumptions

- The edit form is visually identical to the new calculation form — same layout, same field order.
- `userEmail` is resolved via `GET /api/user/:id` (same as feature 004).
- No partial save — the full payload is always sent on PUT.
- `description` may be empty string; all numeric fields default to `0` if cleared.

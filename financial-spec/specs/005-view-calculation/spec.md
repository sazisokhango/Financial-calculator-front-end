# Feature Specification: View Calculation

**Feature Branch**: `feature/005-view-calculation`

**Created**: 2026-05-20

**Status**: Draft

**Input**: A user navigates to `/user/:id/calculations/:calcId` to see the full detail of a saved tax calculation. The page displays the original inputs, the calculated tax breakdown, and provides actions to edit, delete, or return to the dashboard.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Full Calculation Detail (Priority: P1)

A user clicks a saved calculation card on their dashboard and lands on a detail page showing every input they submitted and the full SARS tax breakdown the system computed.

**Why this priority**: This is the primary read view. Without it the dashboard cards have nowhere to navigate to, and users cannot review their results.

**Independent Test**: Navigate to `/user/:id/calculations/:calcId`. Confirm all input fields and all tax breakdown figures are displayed.

**Acceptance Scenarios**:

1. **Given** the view page loads for a valid calculation,
   **When** the data is fetched,
   **Then** the page displays the calculation title as the heading.

2. **Given** the page has loaded,
   **When** the user reads the inputs section,
   **Then** salary, interest income, dividend, capital gain, bonus, retirement annuity, tax already paid, and age are all shown with their values.

3. **Given** the page has loaded,
   **When** the user reads the tax breakdown section,
   **Then** total gross income, total deductions, net taxable income, tax before rebate, rebate, and final tax liability are all shown formatted as currency (R #,###.##).

4. **Given** the page is loading data,
   **When** the API call is in flight,
   **Then** a loading indicator is visible.

---

### User Story 2 — Navigate to Edit (Priority: P2)

A user wants to update a saved calculation. An "Edit" button on the view page navigates them to the edit form.

**Why this priority**: The edit feature (feature 006) is entered via this page — without the Edit button it is unreachable from the UI.

**Independent Test**: Click "Edit" → confirm navigation to `/user/:id/calculations/:calcId/edit`.

**Acceptance Scenarios**:

1. **Given** the calculation detail page is shown,
   **When** the user clicks "Edit",
   **Then** the user is navigated to `/user/:id/calculations/:calcId/edit`.

---

### User Story 3 — Delete with Confirmation (Priority: P3)

A user deletes a saved calculation directly from the detail view. A confirmation dialog appears before the deletion is executed, after which the user is returned to their dashboard.

**Why this priority**: Deletion from the detail view is more deliberate than from the list — but the confirmation guard is still required.

**Independent Test**: Click "Delete" → confirm dialog → confirm deletion → navigate to `/user/:id`.

**Acceptance Scenarios**:

1. **Given** the calculation detail page is shown,
   **When** the user clicks "Delete",
   **Then** a confirmation dialog asks "Are you sure you want to delete this calculation?".

2. **Given** the user confirms the dialog,
   **When** `DELETE /api/tax/:calcId` succeeds,
   **Then** the user is navigated to `/user/:id`.

3. **Given** the user cancels the dialog,
   **When** no action is taken,
   **Then** the user stays on the detail page and no API call is made.

---

### User Story 4 — Return to Dashboard (Priority: P4)

A user finishes reviewing a calculation and navigates back to their dashboard via a "Back" link.

**Why this priority**: Essential navigation — users should always be able to return to the dashboard without using the browser back button.

**Independent Test**: Click "Back" → confirm navigation to `/user/:id`.

**Acceptance Scenarios**:

1. **Given** the calculation detail page is shown,
   **When** the user clicks "Back to Dashboard",
   **Then** the user is navigated to `/user/:id`.

---

### Edge Cases

- What if `GET /api/tax/:calcId` returns 404? → Show error banner "Calculation not found"; do not crash.
- What if `DELETE /api/tax/:calcId` fails? → Show error banner; stay on the detail page.
- What if the user navigates directly to a `calcId` that belongs to a different user? → Back-end enforces data ownership; the front-end shows whatever the API returns (or a 404 error).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On load the page MUST fetch the calculation via `GET /api/tax/:calcId` and display all fields.
- **FR-002**: The page MUST display the calculation title as the heading.
- **FR-003**: An **Inputs** section MUST show: salary, interestIncome, dividend, capitalGain, bonus, retirementAnnuity, taxAlreadyPaid, age, description.
- **FR-004**: A **Tax Breakdown** section MUST show: totalGrossIncome, totalDeductions, netTaxableIncome, taxBeforeRebate, rebate, finalTaxLiability — all formatted as ZAR currency.
- **FR-005**: An "Edit" button MUST navigate to `/user/:id/calculations/:calcId/edit`.
- **FR-006**: A "Delete" button MUST show a confirmation dialog before calling `DELETE /api/tax/:calcId`, then navigate to `/user/:id` on success.
- **FR-007**: A "Back to Dashboard" link MUST navigate to `/user/:id`.
- **FR-008**: A loading indicator MUST be shown while data is fetching.
- **FR-009**: API errors MUST be shown in an error banner; the page MUST NOT crash.

### Key Entities

- **TaxCalculation**: Existing model from feature 003. All fields are read-only on this page.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All input and breakdown fields are visible within 2 seconds of page load.
- **SC-002**: Currency values are formatted as `R #,###.##` (en-ZA locale) 100% of the time.
- **SC-003**: 100% of "Edit" clicks navigate to the correct edit URL.
- **SC-004**: 100% of delete attempts show a confirmation dialog before any API call.
- **SC-005**: After confirmed deletion, the user is navigated to the dashboard 100% of the time.
- **SC-006**: API errors display the `message` field in a banner 100% of the time.

---

## Assumptions

- The `userId` and `calcId` both come from URL parameters — no session or token is used.
- `window.confirm()` is used for the delete confirmation dialog (consistent with feature 003).
- Monetary input fields (salary, etc.) are displayed formatted as currency even though they were entered as plain numbers.
- `createdAt` is displayed as `dd MMM yyyy`.
- The page is read-only — no inline editing.

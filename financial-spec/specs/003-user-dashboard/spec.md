# Feature Specification: User Dashboard

**Feature Branch**: `feature/003-user-dashboard`

**Created**: 2026-05-20

**Status**: Draft

**Input**: After selecting their name on the home page, a user lands on their personal dashboard at `/user/:id`. The dashboard displays their saved tax calculations as cards, lets them navigate to a specific calculation, delete a calculation (with confirmation), and start a new calculation.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — View Saved Calculations (Priority: P1)

A user lands on their dashboard and sees all their previously saved tax calculations displayed as cards. Each card shows the title, a short description, and the date it was created.

**Why this priority**: This is the core purpose of the dashboard. Without it the user has nowhere to go after selecting their name and cannot access any of their work.

**Independent Test**: Navigate to `/user/:id` for a user who has saved calculations. Confirm each calculation appears as a card with title, description, and date.

**Acceptance Scenarios**:

1. **Given** the dashboard loads for a user,
   **When** that user has saved calculations,
   **Then** each calculation is displayed as a card showing title, description (truncated if long), and formatted creation date.

2. **Given** the dashboard is loading data,
   **When** the API call is in flight,
   **Then** a loading indicator is visible.

3. **Given** the data has loaded,
   **When** the page renders,
   **Then** the user's full name is shown as the page heading (fetched from `GET /api/user/:id`).

---

### User Story 2 — Navigate to a Calculation (Priority: P2)

A user clicks on a calculation card and is taken to the full view of that calculation.

**Why this priority**: Cards are the entry point to viewing, editing, or reviewing a specific calculation — without navigation the list is read-only.

**Independent Test**: Click a calculation card → confirm navigation to `/user/:id/calculations/:calcId`.

**Acceptance Scenarios**:

1. **Given** the dashboard shows calculation cards,
   **When** the user clicks a card,
   **Then** the user is navigated to `/user/:id/calculations/:calcId`.

---

### User Story 3 — Delete a Calculation (Priority: P3)

A user deletes a saved calculation. Before the deletion is executed, a confirmation dialog appears so the user cannot accidentally remove their work.

**Why this priority**: Deletion is irreversible; the confirmation guard protects user data.

**Independent Test**: Click the delete icon on a card → confirm dialog appears → confirm deletion → card is removed from the list.

**Acceptance Scenarios**:

1. **Given** each calculation card has a delete icon,
   **When** the user clicks the delete icon,
   **Then** a confirmation dialog asks "Are you sure you want to delete this calculation?".

2. **Given** the confirmation dialog is open,
   **When** the user confirms,
   **Then** `DELETE /api/tax/:calcId` is called and the card is removed from the list.

3. **Given** the confirmation dialog is open,
   **When** the user cancels,
   **Then** no API call is made and the card remains.

---

### User Story 4 — Start a New Calculation (Priority: P4)

A user wants to create a new tax calculation. A clearly visible "New Calculation" button navigates them to the calculation form.

**Why this priority**: The dashboard is both a history view and a launchpad for new work.

**Independent Test**: Click "New Calculation" → confirm navigation to `/user/:id/calculate`.

**Acceptance Scenarios**:

1. **Given** the dashboard is displayed,
   **When** the user clicks "New Calculation",
   **Then** the user is navigated to `/user/:id/calculate`.

---

### User Story 5 — No Saved Calculations Yet (Priority: P5)

A newly registered user has no saved calculations. The dashboard shows a friendly empty state with a prompt to create their first calculation.

**Why this priority**: Every new user sees this state first — a blank page would be confusing.

**Independent Test**: Navigate to `/user/:id` for a user with no calculations. Confirm the empty state message and "New Calculation" button are both visible.

**Acceptance Scenarios**:

1. **Given** the user has no saved calculations,
   **When** the dashboard loads,
   **Then** an empty state message is displayed (e.g., "No calculations yet").

2. **Given** the empty state is displayed,
   **When** the user views the page,
   **Then** the "New Calculation" button is still visible and functional.

---

### Edge Cases

- What if `GET /api/user/:id` fails (user not found)? → Show an error banner; do not crash the page.
- What if `GET /api/tax?userId=:id` fails? → Show an error banner on the calculations section.
- What if `DELETE /api/tax/:calcId` fails? → Show an error banner; keep the card in the list.
- What if the user manually navigates to `/user/999` (non-existent user)? → The API returns 404; an error state is shown.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On load the dashboard MUST fetch the user's profile via `GET /api/user/:id` and display their full name as the page heading.
- **FR-002**: On load the dashboard MUST fetch the user's saved calculations via `GET /api/tax?userId=:id`.
- **FR-003**: Each calculation MUST be displayed as a card showing title, description (truncated), and formatted date.
- **FR-004**: Clicking a calculation card MUST navigate to `/user/:id/calculations/:calcId`.
- **FR-005**: Each card MUST have a delete icon that shows a confirmation dialog before calling `DELETE /api/tax/:calcId`.
- **FR-006**: After successful deletion the card MUST be removed from the list without a full page reload.
- **FR-007**: A "New Calculation" button MUST be visible at all times and navigate to `/user/:id/calculate`.
- **FR-008**: A loading indicator MUST be shown while API calls are in flight.
- **FR-009**: An empty state message MUST be shown when the user has no saved calculations.
- **FR-010**: API errors MUST be shown in an error banner; the page MUST NOT crash.

### Key Entities

- **TaxCalculationResponse**: A saved calculation. Key display fields: `id`, `title`, `description`, `createdAt`, `finalTaxLiability`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The user's saved calculations are visible within 2 seconds of the dashboard loading.
- **SC-002**: 100% of card clicks navigate to the correct `/user/:id/calculations/:calcId` URL.
- **SC-003**: 100% of delete attempts show a confirmation dialog before any API call is made.
- **SC-004**: After confirmed deletion, the card is removed from the UI without a page reload.
- **SC-005**: The empty state is shown 100% of the time when the API returns an empty array.
- **SC-006**: The "New Calculation" button is visible and functional at all times.

---

## Assumptions

- The `userId` comes from the URL parameter `:id` — no session or token is used.
- The confirmation dialog uses the browser's native `window.confirm()` for simplicity in v1.
- Description text is truncated to approximately 80 characters in the card view.
- `createdAt` is formatted as `dd MMM yyyy` for display.
- Only the user's own calculations are returned by `GET /api/tax?userId=:id` — no cross-user filtering needed.

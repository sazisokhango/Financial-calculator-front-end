# Feature Specification: Home Page — People List

**Feature Branch**: `feature/001-home-people-list`

**Created**: 2026-05-20

**Status**: Draft

**Input**: Display all registered users on the home page so that a person can identify themselves and navigate to their personal dashboard; includes client-side name filtering, loading state, empty state, and a Register link for users whose name does not appear.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Registered User Identifies Themselves (Priority: P1)

A registered employee opens the application and sees a list of all registered users.
They find their own name, click it, and are taken to their personal dashboard where
they can view and manage their tax calculations.

**Why this priority**: This is the primary entry point to the entire application.
Without the ability to select a name and navigate to a personal dashboard, no other
feature is reachable. Delivering this alone gives a fully working identity-selection flow.

**Independent Test**: Load the home page with at least one registered user in the system.
Click that user's name. Confirm navigation to `/user/:id` with the correct user ID.

**Acceptance Scenarios**:

1. **Given** the application loads at `/`,
   **When** registered users exist in the system,
   **Then** each user's full name (`firstName lastName`) is displayed as a clickable item.

2. **Given** a user's name is visible in the list,
   **When** the user clicks their name,
   **Then** the application navigates to `/user/:id` using that user's ID.

3. **Given** the home page is loading user data,
   **When** the request is in flight,
   **Then** a loading indicator is visible and the list is not yet rendered.

4. **Given** the user data has loaded successfully,
   **When** the page renders,
   **Then** the loading indicator disappears and the full list is shown.

---

### User Story 2 — User Filters the List by Name (Priority: P2)

In a workplace with many employees, a user wants to quickly find their name without
scrolling through the entire list. They type part of their name into a search field
and the list is instantly filtered to show only matching entries.

**Why this priority**: Enhances usability for teams larger than a handful of people.
Does not block the core flow but significantly improves the experience at scale.
No additional API calls are needed — filtering is performed on the already-loaded list.

**Independent Test**: Load the home page with multiple registered users. Type a partial
name into the filter input. Confirm only matching users remain visible; confirm the filter
clears when the input is emptied.

**Acceptance Scenarios**:

1. **Given** the user list is loaded,
   **When** the user types a partial first or last name into the search input,
   **Then** only users whose full name contains the typed text (case-insensitive) are shown.

2. **Given** the search input contains text,
   **When** the user clears the input,
   **Then** the full unfiltered list is restored.

3. **Given** the user types a string that matches no user,
   **When** the filter is applied,
   **Then** an empty state message is shown within the filtered results area.

---

### User Story 3 — Unregistered User Navigates to Registration (Priority: P3)

A new employee whose name does not appear in the list needs to register before they
can use the calculator. The home page provides a clearly visible "Register" action so
they can create their account without needing help.

**Why this priority**: Supports the onboarding flow for first-time users. The home page
is the only entry point, so the registration link must be discoverable here.

**Independent Test**: Load the home page. Locate the Register button/link. Click it.
Confirm navigation to `/register`.

**Acceptance Scenarios**:

1. **Given** the home page is displayed,
   **When** a user does not see their name in the list,
   **Then** a "Register" button or link is visible that navigates to `/register`.

2. **Given** the user clicks "Register",
   **When** navigation occurs,
   **Then** the user lands on the `/register` page.

---

### User Story 4 — No Users Registered Yet (Priority: P4)

When no users are registered in the system, the home page shows a friendly empty state
rather than a blank or broken layout.

**Why this priority**: Edge case that only occurs on a fresh system but must not produce
a confusing blank screen.

**Independent Test**: Load the home page when the API returns an empty array.
Confirm the empty state message is rendered.

**Acceptance Scenarios**:

1. **Given** no users exist in the system,
   **When** the home page loads,
   **Then** an empty state message is displayed (e.g., "No users registered yet").

2. **Given** the empty state is displayed,
   **When** the user is on the page,
   **Then** the "Register" button is still visible and functional.

---

### Edge Cases

- What happens if the API call to fetch users fails (network error or 500)? → An error message is shown; the list area displays a retry prompt or friendly error text.
- What happens if the user list is very long (100+ names)? → The client-side filter handles this; no pagination required in v1.
- What happens if two users have identical full names? → Both entries are shown; they are distinguished by their unique ID in the navigation target.
- What happens if the user manually types `/user/999` for a non-existent ID? → Handled by the dashboard feature; home page is not responsible.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST fetch and display all registered users on page load.
- **FR-002**: Each user entry MUST display the user's full name (first name + last name).
- **FR-003**: Clicking a user's name MUST navigate to that user's personal dashboard at `/user/:id`.
- **FR-004**: The page MUST show a loading indicator while user data is being fetched.
- **FR-005**: The page MUST show a friendly empty state message when no users are registered.
- **FR-006**: The page MUST provide a text input that filters the displayed list by name (case-insensitive, client-side).
- **FR-007**: Clearing the filter input MUST restore the full user list.
- **FR-008**: A "Register" button or link MUST be visible on the page and navigate to `/register`.
- **FR-009**: If the API call fails, the page MUST display an error message to the user.

### Key Entities

- **User**: A registered person with a unique identity. Key attributes: unique ID, first name, last name. The home page does not display email or any other sensitive field.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All registered users are visible on the home page within 2 seconds of the page loading under normal network conditions.
- **SC-002**: 100% of user name clicks navigate to the correct user-specific dashboard URL.
- **SC-003**: The name filter reduces the visible list to only matching entries within 200ms of the user typing (no API call required).
- **SC-004**: The empty state message is displayed 100% of the time when the API returns an empty user list.
- **SC-005**: The "Register" link is reachable from the home page in a single click at all times.
- **SC-006**: An error state is shown 100% of the time when the API call fails, with no blank or broken layout.

---

## Assumptions

- The user list is fetched from the existing `GET /api/user` endpoint which returns all registered users.
- No pagination is required for v1 — all users are loaded in a single request.
- The home page does not require any authentication or session to display.
- Users are trusted to select only their own name; no access control is enforced at the home page level.
- The "Register" link is always visible regardless of whether users exist or not.
- Email addresses are NOT displayed on the home page — only full names.

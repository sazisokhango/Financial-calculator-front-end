# Feature Specification: User Registration

**Feature Branch**: `feature/002-registration`

**Created**: 2026-05-20

**Status**: Draft

**Input**: First-time users register with their first name, last name, and email. On success they are returned to the home page to select their name. On failure a clear error message is shown. An "Already registered?" link lets existing users skip back to the home page.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — New User Registers Successfully (Priority: P1)

A first-time employee fills in their first name, last name, and a valid email address and submits the registration form. The system creates their account and returns them to the home page where their name now appears in the list.

**Why this priority**: Registration is the only way to create an account. Without it, first-time users cannot use the application at all.

**Independent Test**: Submit a valid registration form with unique email. Confirm the page navigates to `/` on success.

**Acceptance Scenarios**:

1. **Given** the registration page is open,
   **When** the user submits valid firstName, lastName, and email,
   **Then** the form is submitted to `POST /api/auth/register` and on `201 Created` the user is navigated to `/`.

2. **Given** a successful registration,
   **When** navigation to `/` occurs,
   **Then** the new user's name appears in the home page people list.

3. **Given** the form is being submitted,
   **When** the request is in flight,
   **Then** the submit button is disabled and shows a loading indicator.

---

### User Story 2 — Registration Rejected for Duplicate Email (Priority: P2)

A user who is already registered tries to register again with the same email. The system rejects the attempt with a clear error message and keeps the form populated so they can correct it.

**Why this priority**: Prevents duplicate accounts and guides the user to the correct path (selecting their existing name on the home page).

**Independent Test**: Submit the form with an email already registered. Confirm a `400 Bad Request` error message is shown and the form is not cleared.

**Acceptance Scenarios**:

1. **Given** an email that is already registered,
   **When** the user submits the registration form with that email,
   **Then** the API returns `400 Bad Request` and an error banner is shown with the API `message` value.

2. **Given** the error banner is shown,
   **When** the user reads the message,
   **Then** the form fields retain their values so the user can correct the email.

---

### User Story 3 — Registration Rejected for Invalid Fields (Priority: P3)

A user submits the form with one or more empty or invalid fields. Inline validation errors appear immediately, and the form is not submitted until all errors are resolved.

**Why this priority**: Prevents bad data reaching the API and gives the user actionable feedback before the round-trip.

**Independent Test**: Submit the form with each invalid scenario (blank firstName, blank lastName, invalid email). Confirm inline errors appear and no API call is made.

**Acceptance Scenarios**:

1. **Given** the user leaves firstName blank and submits,
   **Then** an inline error "First name is required" is shown beneath the field.

2. **Given** the user leaves lastName blank and submits,
   **Then** an inline error "Last name is required" is shown beneath the field.

3. **Given** the user enters an invalid email format and submits,
   **Then** an inline error "Enter a valid email address" is shown beneath the field.

4. **Given** all fields are invalid,
   **When** the user submits,
   **Then** all inline errors are shown simultaneously and no API call is made.

---

### User Story 4 — Existing User Returns to Home (Priority: P4)

An employee who is already registered lands on the registration page by mistake. An "Already registered?" link is always visible, letting them navigate straight back to the home page without filling in the form.

**Why this priority**: Quality-of-life shortcut that prevents confusion for returning users.

**Independent Test**: Confirm the "Already registered?" link is visible on the registration page and navigates to `/`.

**Acceptance Scenarios**:

1. **Given** the registration page is open,
   **When** a user sees the "Already registered?" link,
   **Then** clicking it navigates to `/` (home page).

---

### Edge Cases

- What if the user submits the form twice rapidly? → Submit button is disabled while the request is in flight, preventing double submission.
- What if the API returns a non-400 error (e.g. 500)? → The generic API `message` (or a fallback "Registration failed. Please try again.") is shown in the error banner.
- What if the email contains leading/trailing whitespace? → The form control should trim whitespace before submission.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST render a form with firstName, lastName, and email fields.
- **FR-002**: All three fields MUST be marked as required; the form MUST NOT submit if any field is blank.
- **FR-003**: The email field MUST validate for correct email format before submission.
- **FR-004**: On submit the form MUST call `POST /api/auth/register` with the field values.
- **FR-005**: On `201 Created` the user MUST be navigated to `/`.
- **FR-006**: On any API error the error `message` from the response MUST be shown in an error banner; form fields MUST retain their values.
- **FR-007**: The submit button MUST be disabled and show a spinner while the request is in flight.
- **FR-008**: Inline field-level validation errors MUST appear when the user submits with invalid fields.
- **FR-009**: An "Already registered?" link MUST be visible at all times and navigate to `/`.

### Key Entities

- **RegisterRequest**: The payload sent to the API. Fields: `firstName` (string), `lastName` (string), `email` (string, valid format).
- **UserResponse**: The API success response. Fields: `id` (number), `firstName`, `lastName`, `email`. Used only to confirm success — not stored locally.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A valid registration form submission navigates to `/` 100% of the time on `201 Created`.
- **SC-002**: 100% of submissions with a blank required field show an inline error and make no API call.
- **SC-003**: 100% of submissions with an invalid email format show an inline error and make no API call.
- **SC-004**: 100% of API error responses display the `message` field to the user in an error banner.
- **SC-005**: The submit button is disabled during every in-flight request, preventing double submission.
- **SC-006**: The "Already registered?" link is visible and functional at all times on the registration page.

---

## Assumptions

- No email verification (OTP or confirmation link) is required — registration is immediate.
- No password is collected — identity is email-only, consistent with the no-auth model.
- The form does not auto-navigate away on load; the user must have explicitly navigated to `/register`.
- `userEmail` trimming (leading/trailing whitespace) is handled client-side before submission.
- The `UserResponse` returned on success is not stored anywhere — navigation to `/` is sufficient.

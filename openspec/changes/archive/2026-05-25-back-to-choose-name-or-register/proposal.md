## Why

Once a user selects their name on the home screen and navigates into the app, there is no way to go back and switch to a different user or register a new one — they are effectively locked in. This breaks multi-user workflows on a shared device and leaves new users with no escape route if they land on the wrong profile.

## What Changes

- Add a "back to home" navigation link to the header of the Dashboard page so users can return to the user selection screen.
- The link on the home screen header ("SA Tax Calculator" branding) should be navigable (or a dedicated "Change user" / "← Back" control is added) to take users back to `/` where they can pick a different name or click "Register".
- No page reload or session clearing is required — the home screen already lists all users and has the Register button.

## Capabilities

### New Capabilities

- `navigate-back-home`: Ability to navigate from within the app (dashboard and sub-pages) back to the home screen (`/`) to choose a different user or register.

### Modified Capabilities

<!-- None — existing home screen and register flow are unchanged. -->

## Impact

- **Files changed**: `dashboard.component.html` (add back-link in header), potentially shared header across sub-pages (calculate, view-calculation, edit-calculation, investment-forecast, view-investment, edit-investment, bond-forecast, view-bond, edit-bond).
- **Routes**: No new routes needed — navigates to existing `/` route.
- **APIs**: None.
- **Dependencies**: None.

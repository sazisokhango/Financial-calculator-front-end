### Requirement: Dashboard header provides a back-to-home link
The Dashboard header SHALL include a navigable element (link or button) that takes the user back to `/` (the home screen) without a page reload, so they can select a different user or register.

#### Scenario: User clicks back-to-home from dashboard
- **WHEN** the user is on the Dashboard page (`/user/:id`) and clicks the back-to-home control
- **THEN** the router navigates to `/` and the home screen renders with the user list and Register button

#### Scenario: Back-to-home control is always visible on dashboard
- **WHEN** the Dashboard page is loaded regardless of the active tab (Tax Calculator, Investment Forecast, or Property Bond)
- **THEN** the back-to-home control is visible in the header

### Requirement: Sub-pages provide a path back to home
All sub-pages (calculate, view-calculation, edit-calculation, investment-forecast, view-investment, edit-investment, bond-forecast, view-bond, edit-bond) SHALL allow the user to reach the home screen within at most two navigation steps (e.g., back to dashboard → back to home, or directly via header).

#### Scenario: User navigates back from a sub-page to home
- **WHEN** the user is on any sub-page and uses the available back navigation
- **THEN** they can reach `/` to choose a different user or click Register without being trapped

### Requirement: Home screen is reachable without browser back button
The application SHALL not require the user to use the browser back button to reach the home screen — an in-app control MUST exist.

#### Scenario: In-app navigation to home exists
- **WHEN** the user is on the Dashboard
- **THEN** an in-app link or button to the home screen is present and functional without relying on the browser history

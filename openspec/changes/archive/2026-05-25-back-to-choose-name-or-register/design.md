## Context

The app has a home screen (`/`) showing all registered users and a Register button. Once a user selects their name and lands on the Dashboard (`/user/:id`), there is no in-app way to return to the home screen. Sub-pages (calculate, view-investment, etc.) each have their own "Back" links that point to the dashboard, so sub-pages are already one step away from the dashboard — they just need the dashboard to have the home link.

The header of each page is rendered inline in each component's template (there is no shared app-level header component). The app root (`app.html`) is just `<router-outlet />`.

## Goals / Non-Goals

**Goals:**
- Add a visible, clickable control in the Dashboard header that navigates to `/`.
- Ensure sub-pages can reach home within two taps (sub-page → dashboard → home).
- Use Angular `RouterModule` `routerLink` — no new services or state needed.

**Non-Goals:**
- Creating a shared header component (out of scope — would require refactoring all pages).
- Adding a back-to-home link on every sub-page header (sub-pages already link back to dashboard; two steps is acceptable per spec).
- Any auth or session management — the home screen is publicly accessible.

## Decisions

**Decision: Add the back link only to the Dashboard header (not all sub-pages)**

The Dashboard is the hub — all sub-pages already have a "Back" link pointing to the dashboard. Adding the home link on the dashboard header gives users a clear two-step path from anywhere in the app. Adding it to every sub-page header would require touching 9+ templates for minimal UX gain.

*Alternative considered*: Add a global back-to-home link to every page header. Rejected — too much template churn with no shared header component, and the two-step path (sub-page → dashboard → home) is standard UX.

**Decision: Style the back-to-home link as the app title/branding ("SA Tax Calculator")**

The home screen is the "SA Tax Calculator" landing page. Making the app title a clickable `routerLink="/"` in the Dashboard header is a familiar pattern (logo → home) and avoids adding a separate UI element. The user's name (`h1`) remains prominent below it.

*Alternative considered*: A dedicated "← Change user" button. Could work but adds visual clutter to an already busy header.

## Risks / Trade-offs

- **Risk**: Users may not discover the title is clickable → Mitigation: add `cursor-pointer` and `hover:text-indigo-100` styling to signal interactivity.
- **Trade-off**: Sub-pages require two steps to reach home (sub-page → dashboard → home). This is acceptable given the existing navigation structure and scope constraints.

## Open Questions

- Should the app title on sub-pages (calculate, view-investment, etc.) also link to `/` for a one-step path? Leaving as a follow-up — not in scope for this change.

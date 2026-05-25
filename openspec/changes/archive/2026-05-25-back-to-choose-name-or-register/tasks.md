## 1. Dashboard Header — Back to Home Link

- [x] 1.1 In `src/app/dashboard/dashboard.component.html`, wrap the "SA Tax Calculator" label (`<p class="text-indigo-200 ...">`) in an `<a>` tag with `routerLink="/"`, adding `cursor-pointer` and `hover:text-indigo-100 transition-colors` classes so it is visually interactive
- [x] 1.2 Verify that `RouterModule` is already imported in `DashboardComponent` (it is — no change needed to the `.ts` file)
- [x] 1.3 Manually test: click the "SA Tax Calculator" link on the dashboard → confirm navigation to `/` and the home screen renders with the user list and Register button
- [x] 1.4 Manually test: switch between the three dashboard tabs (Tax Calculator, Investment Forecast, Property Bond) and confirm the back link is visible on all tabs

## 2. Verification

- [x] 2.1 Navigate to a sub-page (e.g., `/user/1/calculate`) → click "Back" → confirm you reach the Dashboard → click "SA Tax Calculator" → confirm you reach `/`
- [x] 2.2 Confirm no browser back button is required to reach the home screen from the dashboard

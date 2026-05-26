## Context

The app uses Angular standalone components with signals, `ReactiveFormsModule`, `HttpClient`, and Tailwind CSS. Features 007 (Investment Forecast) and 008 (Property Bond Forecast) established a consistent pattern: model interfaces → service → form component → view component → edit component → dashboard tab integration → route registration. This feature follows that exact pattern.

**Backend gap**: `CarLoanRequest` DTO is missing `userId`. The frontend will include it in the payload. The backend team must add `private Long userId;` to `CarLoanRequest` before create/edit flows work end-to-end.

**Dashboard**: `GET /api/loans?userId=` filters by the numeric userId from the URL `:id` param — same as the investment service pattern.

## Goals / Non-Goals

**Goals:**
- Full CRUD: create loan forecast → view result → edit → delete
- Fourth Dashboard tab (`?tab=loans`) with loan card list and empty state
- Inline form validation including cross-field rule (initialDeposit ≤ purchasePrice)
- ZAR-formatted monetary values throughout using `CurrencyPipe` with `'ZAR':'symbol':'1.2-2'` and `LOCALE_ID: 'en-ZA'`

**Non-Goals:**
- Pagination of the monthly projection table — render all rows
- PDF/export of the repayment schedule
- Comparison between multiple loan scenarios

## Decisions

**Decision: Follow the 007/008 component structure exactly**
`LoanCalculatorComponent` (form at `user/:id/loans/new`), `ViewLoanComponent` (result at `user/:id/loans/:loanId`), `EditLoanComponent` (edit at `user/:id/loans/:loanId/edit`). Consistent naming and routing avoids confusion as the codebase grows.

**Decision: Cross-field validation as a form-level validator**
The `initialDeposit ≤ purchasePrice` rule spans two controls. Implement as a `ValidatorFn` on the `FormGroup` (not on individual controls) so the error appears below the `initialDeposit` field via `form.errors?.['depositExceedsPrice']`. This avoids duplicating logic in the template.

**Decision: Dashboard shows all user loans (no client-side filtering needed)**
`GET /api/loans?userId=` already scopes results to the current user. The frontend passes `userId` from the URL param — no additional filtering required.

**Decision: `forecastResults` nested object — read directly, no flattening**
`CarLoanResponse.forecastResults` is a nested `CarLoanForecastResultDto`. The view component accesses it as `loan()!.forecastResults.financedAmount` etc. No need to flatten into the parent object.

**Decision: Dashboard card shows title, description, and monthlyRepayment**
`CarLoanResponse` has no `createdAt` field (unlike investments). Cards will show title, truncated description, and `forecastResults.monthlyRepayment` as the key metric.

## Risks / Trade-offs

- **Risk**: Backend `userId` gap blocks create/edit until the DTO is fixed → Mitigation: frontend sends `userId` in payload now; backend fix is a one-liner. Flag clearly in the tasks.
- **Risk**: Cross-field validator may conflict with individual field `touched` state → Mitigation: trigger the group error display only when `initialDeposit` is `touched`.
- **Trade-off**: No `createdAt` on dashboard cards makes sorting by date impossible — acceptable for now; can be added when the backend adds the field.

## Open Questions

- Should `balloonPayment` validation include an upper bound check against the financed amount (`purchasePrice - initialDeposit`)? The spec says ≥ 0; the requirement doc mentions "cannot exceed financed amount" but the backend DTO only enforces `≥ 0`. Leaving as ≥ 0 for now to match backend constraints.

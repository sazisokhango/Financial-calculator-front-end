## Why

The financial calculator currently supports three financial products: Tax Calculator, Investment Forecast, and Property Bond Forecast. Users who need to plan vehicle finance have no way to model loan repayments, monthly costs, or total interest within the app. Adding a Car Loan Calculator tab closes this gap and rounds out the core personal finance tools.

## What Changes

- Add a **Loan Calculator** tab to the Dashboard tab bar (fourth tab alongside Tax Calculator, Investment Forecast, Property Bond Forecast).
- Add a **loan input form** with nine fields: title, description, purchase price, initial deposit, once-off fee, admin fee, balloon payment, term (months), and interest rate.
- Add a **forecast results summary card** displaying: financed amount, monthly repayment, total repayments, total interest paid, total fees paid, balloon payment, remaining balance, estimated payoff month, and fully paid status.
- Add a **monthly repayment projection table** with columns: month, starting balance, monthly repayment, interest charged, admin fee, principal paid, ending balance.
- Integrate with the backend `CarLoanController` at `/api/loans` (POST, GET `?userId=`, GET `/{id}`, PUT `/{id}`, DELETE `/{id}`).
- Add three new routes: `user/:id/loans/new`, `user/:id/loans/:loanId`, `user/:id/loans/:loanId/edit`.

> **Backend gap noted**: `CarLoanRequest` DTO is currently missing a `userId` field. The frontend will include `userId` (sourced from the URL `:id` param) in the POST/PUT payload. The backend team must add this field to `CarLoanRequest` before the create/edit flow can be end-to-end tested.

## Capabilities

### New Capabilities

- `car-loan`: Full CRUD loan calculator — create a loan forecast, view the result (summary + monthly table), edit inputs, delete, and list all loans for the current user on the Dashboard Loan Calculator tab.

### Modified Capabilities

- `dashboard-tabs`: The Dashboard tab bar gains a fourth tab ("Loan Calculator", `?tab=loans`) alongside the existing three. The `activeTab` signal type expands from `'tax' | 'investments' | 'bonds'` to include `'loans'`.

## Impact

- **New files**: `CarLoan` and `CarLoanRequest` models, `CarLoanService`, `LoanCalculatorComponent` (form), `ViewLoanComponent` (result), `EditLoanComponent` (edit form).
- **Modified files**: `dashboard.component.ts` (loan service injection, `loans` signal, `activeTab` type, delete handler), `dashboard.component.html` (fourth tab + loan card list), `app.routes.ts` (three new routes).
- **APIs**: `POST /api/loans`, `GET /api/loans?userId=`, `GET /api/loans/{id}`, `PUT /api/loans/{id}`, `DELETE /api/loans/{id}`.
- **Dependencies**: None new — uses existing `HttpClient`, `ReactiveFormsModule`, `CurrencyPipe`, `RouterModule`.

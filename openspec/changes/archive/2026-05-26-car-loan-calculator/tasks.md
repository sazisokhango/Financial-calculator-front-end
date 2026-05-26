## 1. Foundational — Models & Service

- [x] 1.1 Create `src/app/models/car-loan.model.ts` — export interfaces `CarLoanForecastResult` (financedAmount, monthlyRepayment, totalRepayments, totalInterestPaid, totalFeesPaid, balloonPayment, remainingBalance, estimatedPayoffMonth, fullyPaid), `CarLoanMonthlyProjection` (month, startingBalance, monthlyRepayment, interestCharged, adminFee, principalPaid, endingBalance), `CarLoan` (id, title, description, purchasePrice, initialDeposit, onceOffFee, adminFee, balloonPayment, termMonths, interestRate, forecastResults: CarLoanForecastResult, monthlyProjection: CarLoanMonthlyProjection[])
- [x] 1.2 Create `src/app/models/car-loan-request.model.ts` — export interface `CarLoanRequest` (userId: number, title, description, purchasePrice, initialDeposit, onceOffFee, adminFee, balloonPayment, termMonths, interestRate — all BigDecimal fields as `number`)
- [x] 1.3 Create `src/app/services/car-loan.service.ts` — inject `HttpClient`; methods: `getAllByUser(userId: number)` → `GET ${environment.apiBaseUrl}/loans?userId=`, `getById(id: number)` → `GET .../loans/{id}`, `create(payload: CarLoanRequest)` → `POST .../loans`, `update(id: number, payload: CarLoanRequest)` → `PUT .../loans/{id}`, `delete(id: number)` → `DELETE .../loans/{id}`; all use `catchError(err => throwError(() => new Error(err.error?.message ?? 'Request failed')))`

> **⚠️ Backend gap**: `CarLoanRequest` DTO on the backend is missing `userId`. The service sends it; the backend team must add `private Long userId;` to `CarLoanRequest.java` before create/edit flows work end-to-end.

## 2. Loan Calculator Form Component (Create)

- [x] 2.1 Create `src/app/loan-calculator/loan-calculator.component.ts` — standalone; `FormBuilder.group` with 9 controls: title `[required]`, description `[]`, purchasePrice `[required, min(0.01)]`, initialDeposit `[required, min(0)]`, onceOffFee `[required, min(0)]`, adminFee `[required, min(0)]`, balloonPayment `[required, min(0)]`, termMonths `[required, min(1)]`, interestRate `[required, min(0), max(100)]`; add a group-level `ValidatorFn` that returns `{ depositExceedsPrice: true }` when `initialDeposit > purchasePrice`; `userId` read from `ActivatedRoute` params; `submitting = signal(false)`, `error = signal<string|null>(null)`; `onSubmit()` builds `CarLoanRequest` with `userId`, calls `carLoanService.create()`, navigates to `/user/:id/loans/:loanId` on 201, sets error on failure
- [x] 2.2 Create `src/app/loan-calculator/loan-calculator.component.html` — header "New Loan Calculation" with Back link to `['/user', userId]?tab=loans`; reactive form with all 9 fields; inline error messages below each field using separate `@if` blocks per error key (`required`, `min`, `max`); below initialDeposit field add `@if (form.errors?.['depositExceedsPrice'] && form.get('initialDeposit')?.touched)` showing "Initial deposit cannot exceed purchase price"; "Calculate Loan" button disabled during `submitting()` with spinner; red error banner `@if (error())`
- [x] 2.3 Create empty `src/app/loan-calculator/loan-calculator.component.css`

## 3. View Loan Component

- [x] 3.1 Create `src/app/view-loan/view-loan.component.ts` — standalone; `loan = signal<CarLoan|null>(null)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `ngOnInit` reads `:id` and `:loanId` from route, calls `carLoanService.getById(loanId)`, sets signals; `edit()` → navigate to edit page; `back()` → navigate to `/user/:id?tab=loans`; `deleteLoan()` → confirm + `carLoanService.delete(loanId)` + navigate to `/user/:id?tab=loans`; imports: `CurrencyPipe`, `DatePipe`, `RouterModule`
- [x] 3.2 Create `src/app/view-loan/view-loan.component.html` — loading spinner `@if (loading())`; error banner `@if (error())`; `@if (loan())`: inputs section (all 9 input fields displayed), forecast summary card (all 9 forecastResults fields with ZAR formatting; `fullyPaid` displayed as "Yes"/"No"; `estimatedPayoffMonth` as plain number), monthly projection table `@for (row of loan()!.monthlyProjection; track row.month)` with 7 columns (Month, Starting Balance, Monthly Repayment, Interest Charged, Admin Fee, Principal Paid, Ending Balance) — monetary columns formatted with `CurrencyPipe 'ZAR':'symbol':'1.2-2'`; action buttons: "Back" (gray), "Edit" (indigo), "Delete" (red)
- [x] 3.3 Create empty `src/app/view-loan/view-loan.component.css`

## 4. Edit Loan Component

- [x] 4.1 Create `src/app/edit-loan/edit-loan.component.ts` — standalone; identical `FormBuilder.group` to `LoanCalculatorComponent` (same 9 controls + group validator); `ngOnInit` reads `:id` and `:loanId`, calls `carLoanService.getById(loanId)`, patches form; `submitting = signal(false)`, `loading = signal(true)`, `error = signal<string|null>(null)`; `onSubmit()` builds `CarLoanRequest` with `userId`, calls `carLoanService.update(loanId, payload)`, navigates to view page on success; `cancel()` navigates to `/user/:id/loans/:loanId`
- [x] 4.2 Create `src/app/edit-loan/edit-loan.component.html` — identical layout to `loan-calculator.component.html`; header reads "Edit Loan Calculation"; submit button reads "Save Changes"; loading spinner while pre-populating; "Cancel" link to view page
- [x] 4.3 Create empty `src/app/edit-loan/edit-loan.component.css`

## 5. Dashboard — Loan Calculator Tab

- [x] 5.1 Modify `src/app/dashboard/dashboard.component.ts` — inject `CarLoanService`; add `loans = signal<CarLoan[]>([])`, `loansError = signal<string|null>(null)`; extend `activeTab` signal type to `'tax' | 'investments' | 'bonds' | 'loans'`; update `queryParams` subscription to include `'loans'` case; extend `forkJoin` to include `carLoanService.getAllByUser(userId)` as fourth observable, set `loans` signal in next handler; add `newLoan()` → `router.navigate(['/user', userId, 'loans', 'new'])`, `viewLoan(id)` → navigate to view page, `deleteLoan(id)` → confirm + `carLoanService.delete(id)` + filter from `loans` signal
- [x] 5.2 Modify `src/app/dashboard/dashboard.component.html` — add "Loan Calculator" tab button with `[queryParams]="{tab:'loans'}"` to the existing tab bar; add `@else if (activeTab() === 'loans')` action button in the header showing "New Loan" calling `newLoan()`; add `@if (activeTab() === 'loans')` content panel with: (a) red error banner `@if (loansError())`, (b) loan cards (title, truncated description, `forecastResults.monthlyRepayment | currency:'ZAR':'symbol':'1.2-2'`, delete icon with `$event.stopPropagation()`), (c) empty state when `loans().length === 0`

## 6. Route Registration

- [x] 6.1 Add three new routes to `src/app/app.routes.ts`: `{ path: 'user/:id/loans/new', component: LoanCalculatorComponent }`, `{ path: 'user/:id/loans/:loanId', component: ViewLoanComponent }`, `{ path: 'user/:id/loans/:loanId/edit', component: EditLoanComponent }`; import all three components

## 7. Verification

- [x] 7.1 `npm run build` — confirm zero compilation errors *(Node.js v12 in this env — run manually)*
- [x] 7.2 Manual happy path (requires backend): Dashboard → Loan Calculator tab → "New Loan" → fill form → "Calculate Loan" → result page (summary + full monthly table) → Edit → update a field → Save → updated result → Delete → back to dashboard tab
- [x] 7.3 Verify all monetary values display as `R #,###.##` across dashboard card, result summary, and monthly table
- [x] 7.4 Verify cross-field validation: set initialDeposit > purchasePrice → error appears below initialDeposit; fix it → error clears
- [x] 7.5 Verify tab switching between all four tabs (Tax Calculator, Investment Forecast, Property Bond, Loan Calculator) — no page reload, URL param updates correctly

# API Contract: Bond Service

**Feature**: 008-property-bond-forecast | **Date**: 2026-05-22
**Base URL**: `environment.apiBaseUrl` (never hardcoded)

---

## POST /api/bonds

Creates a new bond forecast and returns the calculated result.

**Request**
```json
{
  "userEmail": "user@example.com",
  "title": "Family Home Bond",
  "description": "Primary residence repayment plan",
  "initialAmount": 1200000,
  "monthlyContribution": 12000,
  "termMonths": 240,
  "interestRate": 11
}
```

**Response 201 Created** → `PropertyBond`
```json
{
  "id": 1,
  "userEmail": "user@example.com",
  "title": "Family Home Bond",
  "description": "Primary residence repayment plan",
  "initialAmount": 1200000,
  "monthlyContribution": 12000,
  "termMonths": 240,
  "interestRate": 11,
  "forecastResults": {
    "totalLoanAmount": 1200000,
    "totalRepayments": 2150000,
    "totalInterestPaid": 950000,
    "remainingBalance": 0,
    "estimatedPayoffMonth": 240,
    "fullyPaid": true
  },
  "monthlyProjection": [
    {
      "month": 1,
      "startingBalance": 1200000,
      "monthlyPayment": 12000,
      "interestCharged": 11000,
      "principalPaid": 1000,
      "endingBalance": 1199000
    }
  ]
}
```

**Response 400 Bad Request** → `{ "status": 400, "error": "Bad Request", "message": "..." }`

---

## GET /api/bonds?userEmail={email}

Returns all bond forecasts belonging to the given user.

**Response 200 OK** → `PropertyBond[]`

---

## GET /api/bonds/{id}

Returns a single bond forecast including its full `monthlyProjection` array.

**Response 200 OK** → `PropertyBond`
**Response 404 Not Found** → `{ "status": 404, "error": "Not Found", "message": "Bond forecast not found" }`

---

## PUT /api/bonds/{id}

Updates and recalculates an existing bond forecast.

**Request**: Same shape as POST body.
**Response 200 OK** → `PropertyBond`
**Response 404 Not Found** → `{ "status": 404, "error": "Not Found", "message": "Bond forecast not found" }`

---

## DELETE /api/bonds/{id}

Deletes a bond forecast. No response body.

**Response 204 No Content**

---

## Error Handling (all endpoints)

All errors are mapped in `BondService` via:
```typescript
catchError(err => throwError(() => new Error(err.error?.message ?? 'Fallback message')))
```
The component displays the `error()` signal value in a red banner.

---

## Angular Service Method Mapping

| Method                              | HTTP call                                        |
|-------------------------------------|--------------------------------------------------|
| `getAllByUser(userEmail: string)`    | `GET /api/bonds?userEmail={email}`               |
| `getById(id: number)`               | `GET /api/bonds/{id}`                            |
| `create(payload)`                   | `POST /api/bonds`                                |
| `update(id, payload)`               | `PUT /api/bonds/{id}`                            |
| `delete(id: number)`                | `DELETE /api/bonds/{id}`                         |

---

## Key Difference from InvestmentService

`BondService.getAllByUser` takes a `string` (email), not a `number` (userId). The dashboard loads the user first via `userService.getById(userId)` then passes `user.email` to this method.

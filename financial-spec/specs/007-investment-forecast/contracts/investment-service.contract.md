# API Contract: Investment Service

**Feature**: 007-investment-forecast | **Date**: 2026-05-21
**Base URL**: `environment.apiBaseUrl` (never hardcoded)

---

## POST /api/investments/forecast

Creates a new investment forecast and returns the calculated result.

**Request**
```json
{
  "userId": 1,
  "title": "Retirement Growth Plan",
  "description": "Long-term investment",
  "initialAmount": 10000,
  "monthlyContribution": 2000,
  "termMonths": 60,
  "annualInterestRate": 10
}
```

**Response 201 Created** → `InvestmentForecast`
**Response 400 Bad Request** → `{ "status": 400, "error": "Bad Request", "message": "..." }`

---

## GET /api/investments?userId={id}

Returns all forecasts belonging to the given user.

**Response 200 OK** → `InvestmentForecast[]`

---

## GET /api/investments/{id}

Returns a single forecast including its full `monthlyProjections` array.

**Response 200 OK** → `InvestmentForecast`
**Response 404 Not Found** → `{ "status": 404, "error": "Not Found", "message": "Forecast not found" }`

---

## PUT /api/investments/{id}

Updates and recalculates an existing forecast.

**Request**: Same shape as POST body.
**Response 200 OK** → `InvestmentForecast`
**Response 404 Not Found** → `{ "status": 404, "error": "Not Found", "message": "Forecast not found" }`

---

## DELETE /api/investments/{id}

Deletes a forecast. No response body.

**Response 204 No Content**

---

## Error Handling (all endpoints)

All errors are mapped in `InvestmentService` via:
```typescript
catchError(err => throwError(() => new Error(err.error?.message ?? 'Fallback message')))
```
The component displays `error()` signal value in a red banner.

---

## Angular Service Method Mapping

| Method                          | HTTP call                                              |
|---------------------------------|--------------------------------------------------------|
| `getAllByUser(userId: number)`   | `GET /api/investments?userId={userId}`                 |
| `getById(id: number)`           | `GET /api/investments/{id}`                            |
| `create(payload)`               | `POST /api/investments/forecast`                       |
| `update(id, payload)`           | `PUT /api/investments/{id}`                            |
| `delete(id: number)`            | `DELETE /api/investments/{id}`                         |

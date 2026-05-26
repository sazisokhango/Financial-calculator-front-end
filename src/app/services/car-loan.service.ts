import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CarLoan } from '../models/car-loan.model';
import { CarLoanRequest } from '../models/car-loan-request.model';

@Injectable({ providedIn: 'root' })
export class CarLoanService {
  private http = inject(HttpClient);

  getAllByUser(userId: number): Observable<CarLoan[]> {
    return this.http.get<CarLoan[]>(`${environment.apiBaseUrl}/loans`, {
      params: { userId: userId.toString() }
    }).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not load loan calculations'))
      )
    );
  }

  getById(id: number): Observable<CarLoan> {
    return this.http.get<CarLoan>(`${environment.apiBaseUrl}/loans/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Loan calculation not found'))
      )
    );
  }

  create(payload: CarLoanRequest): Observable<CarLoan> {
    return this.http.post<CarLoan>(`${environment.apiBaseUrl}/loans`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not create loan calculation'))
      )
    );
  }

  update(id: number, payload: CarLoanRequest): Observable<CarLoan> {
    return this.http.put<CarLoan>(`${environment.apiBaseUrl}/loans/${id}`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not update loan calculation'))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/loans/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not delete loan calculation'))
      )
    );
  }
}

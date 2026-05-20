import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TaxCalculation } from '../models/tax-calculation.model';

@Injectable({ providedIn: 'root' })
export class TaxService {
  private http = inject(HttpClient);

  getAllByUser(userId: number): Observable<TaxCalculation[]> {
    return this.http.get<TaxCalculation[]>(`${environment.apiBaseUrl}/tax`, {
      params: { userId: userId.toString() }
    }).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not load calculations'))
      )
    );
  }

  getById(id: number): Observable<TaxCalculation> {
    return this.http.get<TaxCalculation>(`${environment.apiBaseUrl}/tax/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Calculation not found'))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/tax/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not delete calculation'))
      )
    );
  }
}

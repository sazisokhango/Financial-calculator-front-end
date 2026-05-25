import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PropertyBond } from '../models/property-bond.model';
import { PropertyBondRequest } from '../models/property-bond-request.model';

@Injectable({ providedIn: 'root' })
export class BondService {
  private http = inject(HttpClient);

  getAllByUser(userEmail: string): Observable<PropertyBond[]> {
    return this.http.get<PropertyBond[]>(`${environment.apiBaseUrl}/bonds`, {
      params: { userEmail }
    }).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not load bond forecasts'))
      )
    );
  }

  getById(id: number): Observable<PropertyBond> {
    return this.http.get<PropertyBond>(`${environment.apiBaseUrl}/bonds/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Bond forecast not found'))
      )
    );
  }

  create(payload: PropertyBondRequest): Observable<PropertyBond> {
    return this.http.post<PropertyBond>(`${environment.apiBaseUrl}/bonds`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not create bond forecast'))
      )
    );
  }

  update(id: number, payload: PropertyBondRequest): Observable<PropertyBond> {
    return this.http.put<PropertyBond>(`${environment.apiBaseUrl}/bonds/${id}`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not update bond forecast'))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/bonds/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not delete bond forecast'))
      )
    );
  }
}

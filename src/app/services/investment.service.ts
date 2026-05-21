import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { InvestmentForecast } from '../models/investment-forecast.model';
import { InvestmentForecastRequest } from '../models/investment-forecast-request.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private http = inject(HttpClient);

  getAllByUser(userId: number): Observable<InvestmentForecast[]> {
    return this.http.get<InvestmentForecast[]>(`${environment.apiBaseUrl}/investments`, {
      params: { userId: userId.toString() }
    }).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not load forecasts'))
      )
    );
  }

  getById(id: number): Observable<InvestmentForecast> {
    return this.http.get<InvestmentForecast>(`${environment.apiBaseUrl}/investments/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Forecast not found'))
      )
    );
  }

  create(payload: InvestmentForecastRequest): Observable<InvestmentForecast> {
    return this.http.post<InvestmentForecast>(`${environment.apiBaseUrl}/investments/forecast`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not create forecast'))
      )
    );
  }

  update(id: number, payload: InvestmentForecastRequest): Observable<InvestmentForecast> {
    return this.http.put<InvestmentForecast>(`${environment.apiBaseUrl}/investments/${id}`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not update forecast'))
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/investments/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not delete forecast'))
      )
    );
  }
}

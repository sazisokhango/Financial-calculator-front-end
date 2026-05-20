import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../models/register-request.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(payload: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/register`, payload).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Registration failed. Please try again.'))
      )
    );
  }
}

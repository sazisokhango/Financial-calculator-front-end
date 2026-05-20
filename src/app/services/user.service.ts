import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiBaseUrl}/user`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'Could not load users'))
      )
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/user/${id}`).pipe(
      catchError(err =>
        throwError(() => new Error(err.error?.message ?? 'User not found'))
      )
    );
  }
}

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('register() posts to the correct URL with the payload', () => {
    const payload = { firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' };
    const mockUser = { id: 1, ...payload };

    service.register(payload).subscribe(user => expect(user).toEqual(mockUser));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUser, { status: 201, statusText: 'Created' });
  });

  it('register() surfaces the API error message on 400', () => {
    service.register({ firstName: 'A', lastName: 'B', email: 'exists@example.com' }).subscribe({
      error: (err: Error) => expect(err.message).toBe('Email already registered')
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    req.flush({ message: 'Email already registered' }, { status: 400, statusText: 'Bad Request' });
  });
});

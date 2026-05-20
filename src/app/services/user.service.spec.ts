import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll() returns the user array from the API', () => {
    const mockUsers = [
      { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' }
    ];

    service.getAll().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getAll() surfaces the API error message on failure', () => {
    service.getAll().subscribe({
      error: err => expect(err.message).toBe('Could not load users')
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/user`);
    req.flush({ message: 'Could not load users' }, { status: 500, statusText: 'Server Error' });
  });
});

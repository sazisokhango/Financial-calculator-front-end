import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaxService } from './tax.service';
import { environment } from '../../environments/environment';

describe('TaxService', () => {
  let service: TaxService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaxService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAllByUser() calls the correct URL with userId param', () => {
    service.getAllByUser(1).subscribe();
    const req = httpMock.expectOne(r => r.url === `${environment.apiBaseUrl}/tax` && r.params.get('userId') === '1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getAllByUser() surfaces error message on failure', () => {
    service.getAllByUser(1).subscribe({
      error: (err: Error) => expect(err.message).toBe('Could not load calculations')
    });
    const req = httpMock.expectOne(r => r.url === `${environment.apiBaseUrl}/tax`);
    req.flush({ message: 'Could not load calculations' }, { status: 500, statusText: 'Error' });
  });

  it('delete() calls DELETE on the correct URL', () => {
    service.delete(42).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/tax/42`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});

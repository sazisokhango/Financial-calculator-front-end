import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BondService } from './bond.service';

describe('BondService', () => {
  let service: BondService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewInvestmentComponent } from './view-investment.component';

describe('ViewInvestmentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvestmentComponent, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewInvestmentComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

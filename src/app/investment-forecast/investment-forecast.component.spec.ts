import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InvestmentForecastComponent } from './investment-forecast.component';

describe('InvestmentForecastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentForecastComponent, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InvestmentForecastComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

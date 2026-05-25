import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BondForecastComponent } from './bond-forecast.component';

describe('BondForecastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BondForecastComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BondForecastComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

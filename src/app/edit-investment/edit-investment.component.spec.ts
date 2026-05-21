import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditInvestmentComponent } from './edit-investment.component';

describe('EditInvestmentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInvestmentComponent, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EditInvestmentComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

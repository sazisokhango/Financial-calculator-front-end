import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CalculateComponent } from './calculate.component';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';

const mockUser = { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' };
const mockCalc = { id: 99, title: 'Test', description: '', salary: 0, interestIncome: 0,
  dividend: 0, capitalGain: 0, bonus: 0, retirementAnnuity: 0, taxAlreadyPaid: 0, age: 35,
  totalGrossIncome: 0, totalDeductions: 0, netTaxableIncome: 0, taxBeforeRebate: 0,
  rebate: 0, finalTaxLiability: 0, createdAt: '2025-01-01T00:00:00', updatedAt: '2025-01-01T00:00:00' };

describe('CalculateComponent', () => {
  let fixture: ComponentFixture<CalculateComponent>;
  let component: CalculateComponent;
  let userSpy: jasmine.SpyObj<UserService>;
  let taxSpy: jasmine.SpyObj<TaxService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['getById']);
    taxSpy  = jasmine.createSpyObj('TaxService',  ['calculate']);
    userSpy.getById.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [CalculateComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: TaxService,  useValue: taxSpy  },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders title, description, age and all 7 numeric fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThanOrEqual(10);
  });

  it('shows inline errors when submitting with blank title and age', () => {
    component.onSubmit();
    fixture.detectChanges();
    const errors = fixture.nativeElement.querySelectorAll('p.text-red-500');
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('makes no API call when form is invalid', () => {
    component.onSubmit();
    expect(taxSpy.calculate).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', () => {
    component.submitting.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBeTrue();
  });

  it('shows error banner on API failure', async () => {
    taxSpy.calculate.and.returnValue(throwError(() => new Error('Calculation failed')));
    component.form.patchValue({ title: 'Test', age: 30 });
    component['userEmail'] = 'saziso@example.com';
    component.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Calculation failed');
  });

  it('navigates to dashboard on cancel', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.cancel();
    expect(routerSpy).toHaveBeenCalledWith(['/user', component.userId]);
  });
});

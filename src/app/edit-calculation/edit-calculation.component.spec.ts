import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EditCalculationComponent } from './edit-calculation.component';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';

const mockUser = { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' };
const mockCalc = {
  id: 10, title: 'Annual 2025', description: 'My calc',
  salary: 500000, interestIncome: 15000, dividend: 8000, capitalGain: 20000,
  bonus: 25000, retirementAnnuity: 30000, taxAlreadyPaid: 70000, age: 35,
  totalGrossIncome: 568000, totalDeductions: 30000, netTaxableIncome: 538000,
  taxBeforeRebate: 120000, rebate: 17000, finalTaxLiability: 33000,
  createdAt: '2025-03-01T10:00:00', updatedAt: '2025-03-01T10:00:00'
};

describe('EditCalculationComponent', () => {
  let fixture: ComponentFixture<EditCalculationComponent>;
  let component: EditCalculationComponent;
  let userSpy: jasmine.SpyObj<UserService>;
  let taxSpy: jasmine.SpyObj<TaxService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['getById']);
    taxSpy  = jasmine.createSpyObj('TaxService',  ['getById', 'update']);
    userSpy.getById.and.returnValue(of(mockUser));
    taxSpy.getById.and.returnValue(of(mockCalc));

    await TestBed.configureTestingModule({
      imports: [EditCalculationComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: TaxService,  useValue: taxSpy  },
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: { get: (k: string) => k === 'id' ? '1' : '10' } }
        }},
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('pre-populates the title field with the existing calculation value', () => {
    expect(component.form.get('title')?.value).toBe('Annual 2025');
  });

  it('pre-populates the salary field with the existing calculation value', () => {
    expect(component.form.get('salary')?.value).toBe(500000);
  });

  it('pre-populates the age field with the existing calculation value', () => {
    expect(component.form.get('age')?.value).toBe(35);
  });

  it('shows inline errors when submitting with blank title', () => {
    component.form.patchValue({ title: '' });
    component.onSubmit();
    fixture.detectChanges();
    const errors = fixture.nativeElement.querySelectorAll('p.text-red-500');
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it('makes no API call when form is invalid', () => {
    component.form.patchValue({ title: '' });
    component.onSubmit();
    expect(taxSpy.update).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', () => {
    component.submitting.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBeTrue();
  });

  it('calls taxService.update with the correct calcId on valid submit', () => {
    taxSpy.update.and.returnValue(of(mockCalc));
    component['userEmail'] = 'saziso@example.com';
    component.onSubmit();
    expect(taxSpy.update).toHaveBeenCalledWith(10, jasmine.objectContaining({ title: 'Annual 2025' }));
  });

  it('navigates to the view page on successful save', async () => {
    taxSpy.update.and.returnValue(of(mockCalc));
    const routerSpy = spyOn(component['router'], 'navigate');
    component['userEmail'] = 'saziso@example.com';
    component.onSubmit();
    await fixture.whenStable();
    expect(routerSpy).toHaveBeenCalledWith(['/user', 1, 'calculations', 10]);
  });

  it('shows error banner on API failure', async () => {
    taxSpy.update.and.returnValue(throwError(() => new Error('Update failed')));
    component['userEmail'] = 'saziso@example.com';
    component.onSubmit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Update failed');
  });

  it('cancel() navigates to the view page without an API call', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.cancel();
    expect(routerSpy).toHaveBeenCalledWith(['/user', 1, 'calculations', 10]);
    expect(taxSpy.update).not.toHaveBeenCalled();
  });
});

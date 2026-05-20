import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ViewCalculationComponent } from './view-calculation.component';
import { TaxService } from '../services/tax.service';

const mockCalc = {
  id: 10, title: 'Annual 2025', description: 'My calc',
  salary: 500000, interestIncome: 15000, dividend: 8000, capitalGain: 20000,
  bonus: 25000, retirementAnnuity: 30000, taxAlreadyPaid: 70000, age: 35,
  totalGrossIncome: 568000, totalDeductions: 30000, netTaxableIncome: 538000,
  taxBeforeRebate: 120000, rebate: 17000, finalTaxLiability: 33000,
  createdAt: '2025-03-01T10:00:00', updatedAt: '2025-03-01T10:00:00'
};

describe('ViewCalculationComponent', () => {
  let fixture: ComponentFixture<ViewCalculationComponent>;
  let component: ViewCalculationComponent;
  let taxSpy: jasmine.SpyObj<TaxService>;

  beforeEach(async () => {
    taxSpy = jasmine.createSpyObj('TaxService', ['getById', 'delete']);
    taxSpy.getById.and.returnValue(of(mockCalc));

    await TestBed.configureTestingModule({
      imports: [ViewCalculationComponent],
      providers: [
        { provide: TaxService, useValue: taxSpy },
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: { get: (k: string) => k === 'id' ? '1' : '10' } }
        }},
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('displays the calculation title', () => {
    expect(fixture.nativeElement.textContent).toContain('Annual 2025');
  });

  it('shows the inputs section with salary', () => {
    expect(fixture.nativeElement.textContent).toContain('Salary');
  });

  it('shows the tax breakdown section with final tax liability', () => {
    expect(fixture.nativeElement.textContent).toContain('Final Tax Liability');
  });

  it('Edit button navigates to the edit route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.editCalc();
    expect(routerSpy).toHaveBeenCalledWith(['/user', 1, 'calculations', 10, 'edit']);
  });

  it('Back button navigates to the dashboard', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.goBack();
    expect(routerSpy).toHaveBeenCalledWith(['/user', 1]);
  });

  it('deleteCalc() requires confirmation and navigates on success', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taxSpy.delete.and.returnValue(of(undefined));
    const routerSpy = spyOn(component['router'], 'navigate');
    component.deleteCalc();
    expect(taxSpy.delete).toHaveBeenCalledWith(10);
    expect(routerSpy).toHaveBeenCalledWith(['/user', 1]);
  });

  it('deleteCalc() does nothing when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteCalc();
    expect(taxSpy.delete).not.toHaveBeenCalled();
  });

  it('shows error banner on API failure', async () => {
    taxSpy.getById.and.returnValue(throwError(() => new Error('Not found')));
    fixture = TestBed.createComponent(ViewCalculationComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Not found');
  });
});

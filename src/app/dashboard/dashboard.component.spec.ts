import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';

const mockUser = { id: 1, firstName: 'Saziso', lastName: 'Khango', email: 'saziso@example.com' };
const mockCalcs = [
  { id: 10, title: 'Annual 2025', description: 'My tax calc', salary: 500000, interestIncome: 0,
    dividend: 0, capitalGain: 0, bonus: 0, retirementAnnuity: 0, taxAlreadyPaid: 0, age: 30,
    totalGrossIncome: 500000, totalDeductions: 0, netTaxableIncome: 500000,
    taxBeforeRebate: 100000, rebate: 17235, finalTaxLiability: 82765,
    createdAt: '2025-03-01T10:00:00', updatedAt: '2025-03-01T10:00:00' }
];

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let userSpy: jasmine.SpyObj<UserService>;
  let taxSpy: jasmine.SpyObj<TaxService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['getById']);
    taxSpy  = jasmine.createSpyObj('TaxService',  ['getAllByUser', 'delete']);
    userSpy.getById.and.returnValue(of(mockUser));
    taxSpy.getAllByUser.and.returnValue(of(mockCalcs));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: TaxService,  useValue: taxSpy  },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('displays the user full name in the header', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Saziso Khango');
  });

  it('renders a card for each calculation', () => {
    const cards = fixture.nativeElement.querySelectorAll('li');
    expect(cards.length).toBe(mockCalcs.length);
    expect(fixture.nativeElement.textContent).toContain('Annual 2025');
  });

  it('removes a card from the list after confirmed delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    taxSpy.delete.and.returnValue(of(undefined));
    component.deleteCalc(10);
    fixture.detectChanges();
    expect(component.calculations().length).toBe(0);
  });

  it('does not delete when confirm is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteCalc(10);
    expect(taxSpy.delete).not.toHaveBeenCalled();
  });

  it('shows empty state when there are no calculations', async () => {
    taxSpy.getAllByUser.and.returnValue(of([]));
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No calculations yet');
  });

  it('shows error banner when API call fails', async () => {
    userSpy.getById.and.returnValue(throwError(() => new Error('User not found')));
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('User not found');
  });
});

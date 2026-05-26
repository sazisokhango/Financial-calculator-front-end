import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';
import { InvestmentService } from '../services/investment.service';
import { BondService } from '../services/bond.service';
import { CarLoanService } from '../services/car-loan.service';
import { User } from '../models/user.model';
import { TaxCalculation } from '../models/tax-calculation.model';
import { InvestmentForecast } from '../models/investment-forecast.model';
import { PropertyBond } from '../models/property-bond.model';
import { CarLoan } from '../models/car-loan.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private taxService = inject(TaxService);
  private investmentService = inject(InvestmentService);
  private bondService = inject(BondService);
  private carLoanService = inject(CarLoanService);

  user = signal<User | null>(null);
  calculations = signal<TaxCalculation[]>([]);
  forecasts = signal<InvestmentForecast[]>([]);
  bonds = signal<PropertyBond[]>([]);
  loans = signal<CarLoan[]>([]);
  activeTab = signal<'tax' | 'investments' | 'bonds' | 'loans'>('tax');
  loading = signal(true);
  error = signal<string | null>(null);
  forecastsError = signal<string | null>(null);
  bondsError = signal<string | null>(null);
  loansError = signal<string | null>(null);

  userId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      this.activeTab.set(
        params['tab'] === 'investments' ? 'investments' :
        params['tab'] === 'bonds' ? 'bonds' :
        params['tab'] === 'loans' ? 'loans' :
        'tax'
      );
    });

    this.userService.getById(this.userId).pipe(
      switchMap(user => {
        this.user.set(user);
        return forkJoin([
          this.taxService.getAllByUser(this.userId),
          this.investmentService.getAllByUser(this.userId),
          this.bondService.getAllByUser(user.email),
          this.carLoanService.getAllByUser(this.userId)
        ]);
      })
    ).subscribe({
      next: ([calcs, forecasts, bonds, loans]) => {
        this.calculations.set(calcs);
        this.forecasts.set(forecasts);
        this.bonds.set(bonds);
        this.loans.set(loans);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  viewCalc(calcId: number): void {
    this.router.navigate(['/user', this.userId, 'calculations', calcId]);
  }

  newCalc(): void {
    this.router.navigate(['/user', this.userId, 'calculate']);
  }

  deleteCalc(id: number): void {
    if (!window.confirm('Are you sure you want to delete this calculation?')) return;
    this.taxService.delete(id).subscribe({
      next: () => this.calculations.update(list => list.filter(c => c.id !== id)),
      error: (err: Error) => this.error.set(err.message)
    });
  }

  newForecast(): void {
    this.router.navigate(['/user', this.userId, 'investments', 'forecast']);
  }

  viewForecast(forecastId: number): void {
    this.router.navigate(['/user', this.userId, 'investments', forecastId]);
  }

  deleteForecast(id: number): void {
    if (!window.confirm('Are you sure you want to delete this forecast?')) return;
    this.investmentService.delete(id).subscribe({
      next: () => this.forecasts.update(list => list.filter(f => f.id !== id)),
      error: (err: Error) => this.forecastsError.set(err.message)
    });
  }

  newBondForecast(): void {
    this.router.navigate(['/user', this.userId, 'bonds', 'forecast']);
  }

  viewBond(bondId: number): void {
    this.router.navigate(['/user', this.userId, 'bonds', bondId]);
  }

  deleteBond(id: number): void {
    if (!window.confirm('Are you sure you want to delete this bond forecast?')) return;
    this.bondService.delete(id).subscribe({
      next: () => this.bonds.update(list => list.filter(b => b.id !== id)),
      error: (err: Error) => this.bondsError.set(err.message)
    });
  }

  newLoan(): void {
    this.router.navigate(['/user', this.userId, 'loans', 'new']);
  }

  viewLoan(loanId: number): void {
    this.router.navigate(['/user', this.userId, 'loans', loanId]);
  }

  deleteLoan(id: number): void {
    if (!window.confirm('Are you sure you want to delete this loan calculation?')) return;
    this.carLoanService.delete(id).subscribe({
      next: () => this.loans.update(list => list.filter(l => l.id !== id)),
      error: (err: Error) => this.loansError.set(err.message)
    });
  }
}

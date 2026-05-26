import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CarLoanService } from '../services/car-loan.service';
import { CarLoan } from '../models/car-loan.model';

@Component({
  selector: 'app-view-loan',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './view-loan.component.html',
  styleUrl: './view-loan.component.css'
})
export class ViewLoanComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carLoanService = inject(CarLoanService);

  loan = signal<CarLoan | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private userId!: number;
  private loanId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loanId = Number(this.route.snapshot.paramMap.get('loanId'));

    this.carLoanService.getById(this.loanId).subscribe({
      next: loan => {
        this.loan.set(loan);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  edit(): void {
    this.router.navigate(['/user', this.userId, 'loans', this.loanId, 'edit']);
  }

  back(): void {
    this.router.navigate(['/user', this.userId], { queryParams: { tab: 'loans' } });
  }

  deleteLoan(): void {
    if (!window.confirm('Are you sure you want to delete this loan calculation?')) return;
    this.carLoanService.delete(this.loanId).subscribe({
      next: () => this.router.navigate(['/user', this.userId], { queryParams: { tab: 'loans' } }),
      error: (err: Error) => this.error.set(err.message)
    });
  }
}

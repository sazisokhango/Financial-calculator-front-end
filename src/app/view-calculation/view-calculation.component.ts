import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TaxService } from '../services/tax.service';
import { TaxCalculation } from '../models/tax-calculation.model';

@Component({
  selector: 'app-view-calculation',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './view-calculation.component.html',
  styleUrl: './view-calculation.component.css'
})
export class ViewCalculationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taxService = inject(TaxService);

  calc   = signal<TaxCalculation | null>(null);
  loading = signal(true);
  error   = signal<string | null>(null);

  private userId!: number;
  private calcId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.calcId = Number(this.route.snapshot.paramMap.get('calcId'));

    this.taxService.getById(this.calcId).subscribe({
      next: c => {
        this.calc.set(c);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  editCalc(): void {
    this.router.navigate(['/user', this.userId, 'calculations', this.calcId, 'edit']);
  }

  deleteCalc(): void {
    if (!window.confirm('Are you sure you want to delete this calculation?')) return;
    this.taxService.delete(this.calcId).subscribe({
      next: () => this.router.navigate(['/user', this.userId]),
      error: (err: Error) => this.error.set(err.message)
    });
  }

  goBack(): void {
    this.router.navigate(['/user', this.userId]);
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { InvestmentService } from '../services/investment.service';
import { InvestmentForecast } from '../models/investment-forecast.model';

@Component({
  selector: 'app-view-investment',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, PercentPipe, RouterModule],
  templateUrl: './view-investment.component.html',
  styleUrl: './view-investment.component.css'
})
export class ViewInvestmentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private investmentService = inject(InvestmentService);

  forecast = signal<InvestmentForecast | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private userId!: number;
  private forecastId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.forecastId = Number(this.route.snapshot.paramMap.get('forecastId'));

    this.investmentService.getById(this.forecastId).subscribe({
      next: f => {
        this.forecast.set(f);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  edit(): void {
    this.router.navigate(['/user', this.userId, 'investments', this.forecastId, 'edit']);
  }

  back(): void {
    this.router.navigate(['/user', this.userId], { queryParams: { tab: 'investments' } });
  }

  deleteForecast(): void {
    if (!window.confirm('Are you sure you want to delete this forecast?')) return;
    this.investmentService.delete(this.forecastId).subscribe({
      next: () => this.router.navigate(['/user', this.userId], { queryParams: { tab: 'investments' } }),
      error: (err: Error) => this.error.set(err.message)
    });
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvestmentService } from '../services/investment.service';
import { InvestmentForecastRequest } from '../models/investment-forecast-request.model';

@Component({
  selector: 'app-investment-forecast',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './investment-forecast.component.html',
  styleUrl: './investment-forecast.component.css'
})
export class InvestmentForecastComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private investmentService = inject(InvestmentService);

  userId!: number;
  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    title:               ['', Validators.required],
    description:         [''],
    initialAmount:       [null as number | null, [Validators.required, Validators.min(0)]],
    monthlyContribution: [null as number | null, [Validators.required, Validators.min(0)]],
    termMonths:          [null as number | null, [Validators.required, Validators.min(1)]],
    annualInterestRate:  [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const payload: InvestmentForecastRequest = {
      userId:              this.userId,
      title:               v.title!,
      description:         v.description ?? '',
      initialAmount:       Number(v.initialAmount),
      monthlyContribution: Number(v.monthlyContribution),
      termMonths:          Number(v.termMonths),
      annualInterestRate:  Number(v.annualInterestRate)
    };

    this.investmentService.create(payload).subscribe({
      next: result => this.router.navigate(['/user', this.userId, 'investments', result.id]),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}

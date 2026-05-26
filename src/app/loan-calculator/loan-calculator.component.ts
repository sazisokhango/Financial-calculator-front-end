import { Component, OnInit, signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarLoanService } from '../services/car-loan.service';
import { CarLoanRequest } from '../models/car-loan-request.model';

function depositNotExceedsPriceValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('purchasePrice')?.value;
    const deposit = group.get('initialDeposit')?.value;
    if (price != null && deposit != null && deposit > price) {
      return { depositExceedsPrice: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.css'
})
export class LoanCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carLoanService = inject(CarLoanService);

  userId!: number;
  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    title:          ['', Validators.required],
    description:    [''],
    purchasePrice:  [null as number | null, [Validators.required, Validators.min(0.01)]],
    initialDeposit: [null as number | null, [Validators.required, Validators.min(0)]],
    onceOffFee:     [null as number | null, [Validators.required, Validators.min(0)]],
    adminFee:       [null as number | null, [Validators.required, Validators.min(0)]],
    balloonPayment: [null as number | null, [Validators.required, Validators.min(0)]],
    termMonths:     [null as number | null, [Validators.required, Validators.min(1)]],
    interestRate:   [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]]
  }, { validators: depositNotExceedsPriceValidator() });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const payload: CarLoanRequest = {
      userId:         this.userId,
      title:          v.title!,
      description:    v.description ?? '',
      purchasePrice:  Number(v.purchasePrice),
      initialDeposit: Number(v.initialDeposit),
      onceOffFee:     Number(v.onceOffFee),
      adminFee:       Number(v.adminFee),
      balloonPayment: Number(v.balloonPayment),
      termMonths:     Number(v.termMonths),
      interestRate:   Number(v.interestRate)
    };

    this.carLoanService.create(payload).subscribe({
      next: result => this.router.navigate(['/user', this.userId, 'loans', result.id]),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}

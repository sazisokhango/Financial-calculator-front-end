import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './calculate.component.html',
  styleUrl: './calculate.component.css'
})
export class CalculateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private taxService = inject(TaxService);

  userId!: number;
  private userEmail = '';

  readonly numericFields = [
    { key: 'salary',             label: 'Salary (R)' },
    { key: 'interestIncome',     label: 'Interest Income (R)' },
    { key: 'dividend',           label: 'Dividend (R)' },
    { key: 'capitalGain',        label: 'Capital Gain (R)' },
    { key: 'bonus',              label: 'Bonus (R)' },
    { key: 'retirementAnnuity',  label: 'Retirement Annuity (R)' },
    { key: 'taxAlreadyPaid',     label: 'Tax Already Paid (R)' }
  ] as const;

  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    title:             ['', Validators.required],
    description:       [''],
    salary:            [0, [Validators.required, Validators.min(0)]],
    interestIncome:    [0, [Validators.required, Validators.min(0)]],
    dividend:          [0, [Validators.required, Validators.min(0)]],
    capitalGain:       [0, [Validators.required, Validators.min(0)]],
    bonus:             [0, [Validators.required, Validators.min(0)]],
    retirementAnnuity: [0, [Validators.required, Validators.min(0)]],
    taxAlreadyPaid:    [0, [Validators.required, Validators.min(0)]],
    age:               [null as number | null, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getById(this.userId).subscribe({
      next: user => { this.userEmail = user.email; },
      error: (err: Error) => this.error.set(err.message)
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.userEmail) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const payload = {
      userEmail:         this.userEmail,
      title:             v.title!,
      description:       v.description ?? '',
      salary:            Number(v.salary)            || 0,
      interestIncome:    Number(v.interestIncome)    || 0,
      dividend:          Number(v.dividend)          || 0,
      capitalGain:       Number(v.capitalGain)       || 0,
      bonus:             Number(v.bonus)             || 0,
      retirementAnnuity: Number(v.retirementAnnuity) || 0,
      taxAlreadyPaid:    Number(v.taxAlreadyPaid)    || 0,
      age:               Number(v.age)               || 0
    };

    this.taxService.calculate(payload).subscribe({
      next: result => this.router.navigate(['/user', this.userId, 'calculations', result.id]),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/user', this.userId]);
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'app-edit-calculation',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-calculation.component.html',
  styleUrl: './edit-calculation.component.css'
})
export class EditCalculationComponent implements OnInit {
  private fb         = inject(FormBuilder);
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private userService = inject(UserService);
  private taxService  = inject(TaxService);

  userId!: number;
  calcId!: number;
  private userEmail = '';

  loading    = signal(true);
  submitting = signal(false);
  error      = signal<string | null>(null);

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

  readonly numericFields = [
    { key: 'salary',             label: 'Salary (R)' },
    { key: 'interestIncome',     label: 'Interest Income (R)' },
    { key: 'dividend',           label: 'Dividend (R)' },
    { key: 'capitalGain',        label: 'Capital Gain (R)' },
    { key: 'bonus',              label: 'Bonus (R)' },
    { key: 'retirementAnnuity',  label: 'Retirement Annuity (R)' },
    { key: 'taxAlreadyPaid',     label: 'Tax Already Paid (R)' }
  ] as const;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.calcId = Number(this.route.snapshot.paramMap.get('calcId'));

    forkJoin([
      this.userService.getById(this.userId),
      this.taxService.getById(this.calcId)
    ]).subscribe({
      next: ([user, calc]) => {
        this.userEmail = user.email;
        this.form.patchValue({
          title:             calc.title,
          description:       calc.description,
          salary:            calc.salary,
          interestIncome:    calc.interestIncome,
          dividend:          calc.dividend,
          capitalGain:       calc.capitalGain,
          bonus:             calc.bonus,
          retirementAnnuity: calc.retirementAnnuity,
          taxAlreadyPaid:    calc.taxAlreadyPaid,
          age:               calc.age
        });
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.userEmail) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const payload = {
      userId:            this.userEmail,
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

    this.taxService.update(this.calcId, payload).subscribe({
      next: () => this.navigateToView(),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    this.navigateToView();
  }

  private navigateToView(): void {
    this.router.navigate(['/user', this.userId, 'calculations', this.calcId]);
  }
}

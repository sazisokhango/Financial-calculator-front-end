import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BondService } from '../services/bond.service';
import { UserService } from '../services/user.service';
import { PropertyBondRequest } from '../models/property-bond-request.model';

@Component({
  selector: 'app-bond-forecast',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './bond-forecast.component.html',
  styleUrl: './bond-forecast.component.css'
})
export class BondForecastComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bondService = inject(BondService);
  private userService = inject(UserService);

  userId!: number;
  userEmail = signal<string>('');
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    title:               ['', Validators.required],
    description:         [''],
    initialAmount:       [null as number | null, [Validators.required, Validators.min(1)]],
    monthlyContribution: [null as number | null, [Validators.required, Validators.min(1)]],
    termMonths:          [null as number | null, [Validators.required, Validators.min(1)]],
    interestRate:        [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getById(this.userId).subscribe({
      next: user => {
        this.userEmail.set(user.email);
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
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const payload: PropertyBondRequest = {
      userEmail:           this.userEmail(),
      title:               v.title!,
      description:         v.description ?? '',
      initialAmount:       Number(v.initialAmount),
      monthlyContribution: Number(v.monthlyContribution),
      termMonths:          Number(v.termMonths),
      interestRate:        Number(v.interestRate)
    };

    this.bondService.create(payload).subscribe({
      next: result => this.router.navigate(['/user', this.userId, 'bonds', result.id]),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}

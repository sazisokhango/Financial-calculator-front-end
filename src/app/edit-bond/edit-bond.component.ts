import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BondService } from '../services/bond.service';
import { UserService } from '../services/user.service';
import { PropertyBondRequest } from '../models/property-bond-request.model';

@Component({
  selector: 'app-edit-bond',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './edit-bond.component.html',
  styleUrl: './edit-bond.component.css'
})
export class EditBondComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bondService = inject(BondService);
  private userService = inject(UserService);

  userId!: number;
  bondId!: number;
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
    this.bondId = Number(this.route.snapshot.paramMap.get('bondId'));

    forkJoin([
      this.bondService.getById(this.bondId),
      this.userService.getById(this.userId)
    ]).subscribe({
      next: ([bond, user]) => {
        this.form.patchValue({
          title:               bond.title,
          description:         bond.description,
          initialAmount:       bond.initialAmount,
          monthlyContribution: bond.monthlyContribution,
          termMonths:          bond.termMonths,
          interestRate:        bond.interestRate
        });
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

    this.bondService.update(this.bondId, payload).subscribe({
      next: () => this.router.navigate(['/user', this.userId, 'bonds', this.bondId]),
      error: (err: Error) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/user', this.userId, 'bonds', this.bondId]);
  }
}

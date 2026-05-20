import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]]
  });

  submitting = signal(false);
  apiError = signal<string | null>(null);

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.apiError.set(null);

    const { firstName, lastName, email } = this.form.getRawValue();

    this.authService.register({
      firstName: firstName!,
      lastName: lastName!,
      email: email!.trim()
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: Error) => {
        this.apiError.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}

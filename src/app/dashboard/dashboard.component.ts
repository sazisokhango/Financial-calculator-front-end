import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UserService } from '../services/user.service';
import { TaxService } from '../services/tax.service';
import { User } from '../models/user.model';
import { TaxCalculation } from '../models/tax-calculation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private taxService = inject(TaxService);

  user = signal<User | null>(null);
  calculations = signal<TaxCalculation[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private userId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin([
      this.userService.getById(this.userId),
      this.taxService.getAllByUser(this.userId)
    ]).subscribe({
      next: ([user, calcs]) => {
        this.user.set(user);
        this.calculations.set(calcs);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  viewCalc(calcId: number): void {
    this.router.navigate(['/user', this.userId, 'calculations', calcId]);
  }

  newCalc(): void {
    this.router.navigate(['/user', this.userId, 'calculate']);
  }

  deleteCalc(id: number): void {
    if (!window.confirm('Are you sure you want to delete this calculation?')) return;
    this.taxService.delete(id).subscribe({
      next: () => this.calculations.update(list => list.filter(c => c.id !== id)),
      error: (err: Error) => this.error.set(err.message)
    });
  }
}

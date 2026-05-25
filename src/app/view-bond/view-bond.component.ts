import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { BondService } from '../services/bond.service';
import { PropertyBond } from '../models/property-bond.model';

@Component({
  selector: 'app-view-bond',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './view-bond.component.html',
  styleUrl: './view-bond.component.css'
})
export class ViewBondComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bondService = inject(BondService);

  bond = signal<PropertyBond | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private userId!: number;
  private bondId!: number;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.bondId = Number(this.route.snapshot.paramMap.get('bondId'));

    this.bondService.getById(this.bondId).subscribe({
      next: b => {
        this.bond.set(b);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  edit(): void {
    this.router.navigate(['/user', this.userId, 'bonds', this.bondId, 'edit']);
  }

  back(): void {
    this.router.navigate(['/user', this.userId], { queryParams: { tab: 'bonds' } });
  }

  deleteBond(): void {
    if (!window.confirm('Are you sure you want to delete this bond forecast?')) return;
    this.bondService.delete(this.bondId).subscribe({
      next: () => this.router.navigate(['/user', this.userId], { queryParams: { tab: 'bonds' } }),
      error: (err: Error) => this.error.set(err.message)
    });
  }
}

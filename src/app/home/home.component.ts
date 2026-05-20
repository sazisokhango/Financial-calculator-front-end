import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  filterControl = new FormControl('');
  private filterValue = toSignal(this.filterControl.valueChanges, { initialValue: '' });

  filteredUsers = computed(() => {
    const term = (this.filterValue() ?? '').toLowerCase().trim();
    if (!term) return this.users();
    return this.users().filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  goToDashboard(id: number): void {
    this.router.navigate(['/user', id]);
  }
}

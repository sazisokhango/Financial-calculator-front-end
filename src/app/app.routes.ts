import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalculateComponent } from './calculate/calculate.component';
import { ViewCalculationComponent } from './view-calculation/view-calculation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:id', component: DashboardComponent },
  { path: 'user/:id/calculate', component: CalculateComponent },
  { path: 'user/:id/calculations/:calcId', component: ViewCalculationComponent }
];

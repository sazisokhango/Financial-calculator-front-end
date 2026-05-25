import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalculateComponent } from './calculate/calculate.component';
import { ViewCalculationComponent } from './view-calculation/view-calculation.component';
import { EditCalculationComponent } from './edit-calculation/edit-calculation.component';
import { InvestmentForecastComponent } from './investment-forecast/investment-forecast.component';
import { ViewInvestmentComponent } from './view-investment/view-investment.component';
import { EditInvestmentComponent } from './edit-investment/edit-investment.component';
import { BondForecastComponent } from './bond-forecast/bond-forecast.component';
import { ViewBondComponent } from './view-bond/view-bond.component';
import { EditBondComponent } from './edit-bond/edit-bond.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:id', component: DashboardComponent },
  { path: 'user/:id/calculate', component: CalculateComponent },
  { path: 'user/:id/calculations/:calcId', component: ViewCalculationComponent },
  { path: 'user/:id/calculations/:calcId/edit', component: EditCalculationComponent },
  { path: 'user/:id/investments/forecast', component: InvestmentForecastComponent },
  { path: 'user/:id/investments/:forecastId', component: ViewInvestmentComponent },
  { path: 'user/:id/investments/:forecastId/edit', component: EditInvestmentComponent },
  { path: 'user/:id/bonds/forecast', component: BondForecastComponent },
  { path: 'user/:id/bonds/:bondId', component: ViewBondComponent },
  { path: 'user/:id/bonds/:bondId/edit', component: EditBondComponent }
];

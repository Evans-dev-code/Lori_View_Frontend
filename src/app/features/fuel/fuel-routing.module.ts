import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelDashboardComponent } from './fuel-dashboard/fuel-dashboard.component';

const routes: Routes = [
  { path: '', component: FuelDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelRoutingModule { }
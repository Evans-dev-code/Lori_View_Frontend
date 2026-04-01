import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FuelRoutingModule } from './fuel-routing.module';
import { FuelDashboardComponent } from './fuel-dashboard/fuel-dashboard.component';
import { FuelChartComponent } from './fuel-chart/fuel-chart.component';

@NgModule({
  declarations: [
    FuelDashboardComponent,
    FuelChartComponent
  ],
  imports: [SharedModule, FuelRoutingModule]
})
export class FuelModule { }
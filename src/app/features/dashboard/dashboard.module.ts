import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { LiveMapComponent } from './live-map/live-map.component';
import { FleetSummaryComponent } from './fleet-summary/fleet-summary.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    LiveMapComponent,
    FleetSummaryComponent
  ],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule { }
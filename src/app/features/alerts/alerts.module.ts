import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertListComponent } from './alert-list/alert-list.component';
import { AlertBadgeComponent } from './alert-badge/alert-badge.component';

@NgModule({
  declarations: [AlertListComponent, AlertBadgeComponent],
  imports: [SharedModule, AlertsRoutingModule]
})
export class AlertsModule { }
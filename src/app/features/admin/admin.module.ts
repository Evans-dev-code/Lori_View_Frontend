import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { OwnerDetailComponent } from './owner-detail/owner-detail.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    OwnerListComponent,
    PaymentListComponent,
    OwnerDetailComponent
  ],
  imports: [SharedModule, AdminRoutingModule]
})
export class AdminModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { OwnerDetailComponent } from './owner-detail/owner-detail.component';

const routes: Routes = [
  { path: '',         component: AdminDashboardComponent },
  { path: 'owners',   component: OwnerListComponent },
  { path: 'payments', component: PaymentListComponent },
  {  path: 'owners/:id', component: OwnerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
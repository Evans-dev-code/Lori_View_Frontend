import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckListComponent } from './truck-list/truck-list.component';
import { TruckDetailComponent } from './truck-detail/truck-detail.component';
import { TruckFormComponent } from './truck-form/truck-form.component';

const routes: Routes = [
  { path: '',          component: TruckListComponent },
  { path: 'new',       component: TruckFormComponent },
  { path: ':id',       component: TruckDetailComponent },
  { path: ':id/edit',  component: TruckFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrucksRoutingModule { }
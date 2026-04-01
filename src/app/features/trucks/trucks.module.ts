import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TrucksRoutingModule } from './trucks-routing.module';
import { TruckListComponent } from './truck-list/truck-list.component';
import { TruckDetailComponent } from './truck-detail/truck-detail.component';
import { TruckFormComponent } from './truck-form/truck-form.component';

@NgModule({
  declarations: [
    TruckListComponent,
    TruckDetailComponent,
    TruckFormComponent
  ],
  imports: [SharedModule, TrucksRoutingModule]
})
export class TrucksModule { }
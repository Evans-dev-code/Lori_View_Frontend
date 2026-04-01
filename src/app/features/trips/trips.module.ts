import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TripsRoutingModule } from './trips-routing.module';
import { TripListComponent } from './trip-list/trip-list.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { TripMapComponent } from './trip-map/trip-map.component';

@NgModule({
  declarations: [
    TripListComponent,
    TripDetailComponent,
    TripMapComponent
  ],
  imports: [SharedModule, TripsRoutingModule]
})
export class TripsModule { }
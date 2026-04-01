import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationPing, LiveTruck } from '../models/location-ping.model';

@Injectable({ providedIn: 'root' })
export class LocationService {

  private api = `${environment.apiUrl}/location`;

  constructor(private http: HttpClient) {}

  getLiveLocation(truckId: number): Observable<LocationPing> {
    return this.http.get<LocationPing>(
      `${this.api}/truck/${truckId}/live`
    );
  }

  getTripRoute(tripId: number): Observable<LocationPing[]> {
    return this.http.get<LocationPing[]>(
      `${this.api}/trip/${tripId}/route`
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FuelReading } from '../models/fuel.model';

@Injectable({ providedIn: 'root' })
export class FuelService {

  private api = `${environment.apiUrl}/fuel`;

  constructor(private http: HttpClient) {}

  getCurrentFuelLevel(truckId: number): Observable<FuelReading> {
    return this.http.get<FuelReading>(
      `${this.api}/truck/${truckId}/current`
    );
  }

  getFuelUsedOnTrip(tripId: number): Observable<number> {
    return this.http.get<number>(
      `${this.api}/trip/${tripId}/used`
    );
  }

  getFuelReadingsInRange(
    truckId: number,
    from: string,
    to: string
  ): Observable<FuelReading[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);
    return this.http.get<FuelReading[]>(
      `${this.api}/truck/${truckId}/range`,
      { params }
    );
  }

  getFuelEfficiency(
    distanceKm: number,
    fuelUsedL: number
  ): Observable<number> {
    const params = new HttpParams()
      .set('distanceKm', distanceKm)
      .set('fuelUsedL', fuelUsedL);
    return this.http.get<number>(
      `${this.api}/efficiency`,
      { params }
    );
  }
}
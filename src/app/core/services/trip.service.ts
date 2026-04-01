import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trip } from '../models/trip.model';

export interface TripStartRequest {
  truckId:     number;
  driverId?:   number;
  origin:      string;
  destination: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {

  private api = `${environment.apiUrl}/trips`;

  constructor(private http: HttpClient) {}

  getTripsByTruck(truckId: number): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.api}/truck/${truckId}`);
  }

  getAllTripsByOwner(ownerId: number): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.api}/owner/${ownerId}`);
  }

  getTripById(tripId: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.api}/${tripId}`);
  }

  getOngoingTrip(truckId: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.api}/truck/${truckId}/ongoing`);
  }

  startTrip(request: TripStartRequest): Observable<Trip> {
  // Send as JSON body, not query params
  return this.http.post<Trip>(
    `${this.api}/start`,
    {
      truckId:     Number(request.truckId),
      origin:      request.origin,
      destination: request.destination
    }
  );
}

  endTrip(tripId: number): Observable<Trip> {
    return this.http.patch<Trip>(`${this.api}/${tripId}/end`, null);
  }

  cancelTrip(tripId: number): Observable<Trip> {
    return this.http.patch<Trip>(`${this.api}/${tripId}/cancel`, null);
  }
}
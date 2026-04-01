import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Truck, TruckStatus } from '../models/truck.model';

export interface TruckRequest {
  ownerId:        number;
  plateNumber:    string;
  make:           string;
  model:          string;
  year?:          number | null;
  fuelCapacityL?: number | null;
  deviceImei?:    string | null;
}

@Injectable({ providedIn: 'root' })
export class TruckService {

  private api = `${environment.apiUrl}/trucks`;

  constructor(private http: HttpClient) {}

  getTrucksByOwner(ownerId: number): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.api}/owner/${ownerId}`);
  }

  getActiveTrucks(ownerId: number): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.api}/owner/${ownerId}/active`);
  }

  getTruckById(truckId: number): Observable<Truck> {
    return this.http.get<Truck>(`${this.api}/${truckId}`);
  }

  registerTruck(request: TruckRequest): Observable<Truck> {
    return this.http.post<Truck>(this.api, request);
  }

  updateTruck(truckId: number, request: TruckRequest): Observable<Truck> {
    return this.http.put<Truck>(`${this.api}/${truckId}`, request);
  }

  updateStatus(truckId: number, status: string): Observable<Truck> {
    return this.http.patch<Truck>(
      `${this.api}/${truckId}/status`,
      null,
      { params: new HttpParams().set('status', status) }
    );
  }

  deleteTruck(truckId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${truckId}`);
  }
}
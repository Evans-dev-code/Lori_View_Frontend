import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Owner } from '../models/owner.model';
import { Payment } from '../models/payment.model';
import { Subscription } from '../models/subscription.model';

export interface AdminDashboard {
  totalOwners:        number;
  totalTrucks:        number;
  totalTrips:         number;
  activeSubscribers:  number;
  trialOwners:        number;
  activeOwners:       number;
  expiredOwners:      number;
  totalRevenueKes:    number;
  monthlyRevenueKes:  number;
  newOwnersThisMonth: number;
  tripsThisMonth:     number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.api}/dashboard`);
  }

  getAllOwners(): Observable<Owner[]> {
    return this.http.get<Owner[]>(`${this.api}/owners`);
  }

  getOwnerById(id: number): Observable<Owner> {
    return this.http.get<Owner>(`${this.api}/owners/${id}`);
  }

  getOwnerTrucks(ownerId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.api}/owners/${ownerId}/trucks`
    );
  }

  addTruckForOwner(ownerId: number, request: any): Observable<any> {
    return this.http.post<any>(
      `${this.api}/owners/${ownerId}/trucks`, request
    );
  }

  getOwnerPayments(ownerId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.api}/owners/${ownerId}/payments`
    );
  }

  getOwnerSubscriptions(ownerId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(
      `${this.api}/owners/${ownerId}/subscriptions`
    );
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.api}/payments`);
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.api}/subscriptions`);
  }

  suspendOwner(id: number): Observable<Owner> {
    return this.http.patch<Owner>(
      `${this.api}/owners/${id}/suspend`, null
    );
  }

  activateOwner(id: number): Observable<Owner> {
    return this.http.patch<Owner>(
      `${this.api}/owners/${id}/activate`, null
    );
  }
}
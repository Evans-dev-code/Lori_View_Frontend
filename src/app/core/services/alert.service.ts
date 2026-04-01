import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {

  private api = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) {}

  getAllByOwner(ownerId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.api}/owner/${ownerId}`);
  }

  getUnreadByTruck(truckId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.api}/truck/${truckId}/unread`);
  }

  getUnreadCount(ownerId: number): Observable<number> {
    return this.http.get<number>(`${this.api}/owner/${ownerId}/unread-count`);
  }

  markAllAsRead(truckId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.api}/truck/${truckId}/mark-read`, null
    );
  }
}
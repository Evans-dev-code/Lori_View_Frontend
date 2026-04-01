import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { TruckService } from '../../../core/services/truck.service';
import { AuthService } from '../../../core/services/auth.service';
import { Alert, AlertSeverity, AlertType } from '../../../core/models/alert.model';
import { Truck } from '../../../core/models/truck.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit {

  loading        = true;
  alerts: Alert[] = [];
  filtered: Alert[] = [];
  trucks: Truck[]   = [];

  search         = '';
  filterSeverity = 'ALL';
  filterType     = 'ALL';
  filterTruck    = 'ALL';

  severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  types      = ['ALL', 'SPEEDING', 'GEOFENCE', 'FUEL_DROP',
                'IDLE', 'OFFLINE', 'HARSH_BRAKING'];

  constructor(
    private alertService: AlertService,
    private truckService: TruckService,
    private authService:  AuthService,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    const ownerId = this.authService.getOwnerId()!;
    this.truckService.getTrucksByOwner(ownerId).subscribe(
      trucks => this.trucks = trucks
    );
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    const ownerId = this.authService.getOwnerId()!;
    this.alertService.getAllByOwner(ownerId).subscribe({
      next: alerts => {
        this.alerts   = alerts;
        this.filtered = alerts;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.alerts.filter(a => {
      const matchSearch =
        !this.search ||
        a.message?.toLowerCase().includes(this.search.toLowerCase()) ||
        a.plateNumber?.toLowerCase().includes(this.search.toLowerCase());

      const matchSev =
        this.filterSeverity === 'ALL' ||
        a.severity === this.filterSeverity;

      const matchType =
        this.filterType === 'ALL' ||
        a.type === this.filterType;

      const matchTruck =
        this.filterTruck === 'ALL' ||
        String(a.truckId) === this.filterTruck;

      return matchSearch && matchSev && matchType && matchTruck;
    });
  }

  markRead(truckId: number): void {
    this.alertService.markAllAsRead(truckId).subscribe({
      next: () => {
        this.alerts = this.alerts.map(a =>
          a.truckId === truckId ? { ...a, isRead: true } : a
        );
        this.applyFilter();
        this.snackBar.open(
          'All alerts marked as read', '',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      }
    });
  }

  get criticalCount(): number {
    return this.alerts.filter(
      a => a.severity === AlertSeverity.CRITICAL
    ).length;
  }

  get unreadCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }

  get highCount(): number {
    return this.alerts.filter(
      a => a.severity === AlertSeverity.HIGH
    ).length;
  }

  severityClass(s: string): string { return s.toLowerCase(); }
  typeLabel(t: string): string {
    return t.replace(/_/g, ' ').toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-KE', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
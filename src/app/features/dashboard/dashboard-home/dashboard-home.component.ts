import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { TruckService } from '../../../core/services/truck.service';
import { TripService } from '../../../core/services/trip.service';
import { AlertService } from '../../../core/services/alert.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Truck, TruckStatus } from '../../../core/models/truck.model';
import { Trip, TripStatus } from '../../../core/models/trip.model';
import { Alert, AlertSeverity } from '../../../core/models/alert.model';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  loading     = true;
  ownerId!:   number;
  trucks:     Truck[] = [];
  trips:      Trip[]  = [];
  alerts:     Alert[] = [];

  private refreshSub?: Subscription;
  private wsSubs: { unsubscribe: () => void }[] = [];

  constructor(
    private authService:  AuthService,
    private truckService: TruckService,
    private tripService:  TripService,
    private alertService: AlertService,
    private wsService:    WebsocketService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.ownerId = this.authService.getOwnerId()!;

    // Load all data first, then connect WebSocket
    this.loadAll();
    this.connectWebSocket();

    // Background refresh every 30 seconds
    this.refreshSub = interval(30_000)
      .pipe(switchMap(() => this.loadAllObservable()))
      .subscribe({
        next: ([trucks, trips, alerts]) => {
          this.trucks = trucks;
          this.trips  = trips;
          this.alerts = alerts;
        }
      });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.wsSubs.forEach(s => s.unsubscribe());
  }

  // ── Data loading ───────────────────────────────────

  loadAll(): void {
    this.loading = true;
    this.loadAllObservable().subscribe({
      next: ([trucks, trips, alerts]) => {
        this.trucks  = trucks;
        this.trips   = trips;
        this.alerts  = alerts;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private loadAllObservable() {
    return forkJoin([
      this.truckService.getTrucksByOwner(this.ownerId),
      this.tripService.getAllTripsByOwner(this.ownerId),
      this.alertService.getAllByOwner(this.ownerId)
    ]);
  }

  // ── WebSocket ──────────────────────────────────────

  private connectWebSocket(): void {
    this.wsService.connect()
      .then(() => {

        // Live location pings → update truck marker on map
        const locSub = this.wsService
          .subscribeToLocation(this.ownerId)
          .subscribe({
            next: (ping: any) => {
              const truck = this.trucks.find(
                t => t.id === ping.truckId
              );
              if (truck) {
                truck.lastLatitude    = ping.latitude;
                truck.lastLongitude   = ping.longitude;
                truck.currentSpeedKmh = ping.speedKmh;
              }
            },
            error: () => {}
          });

        // Live alerts → prepend to list
        const alertSub = this.wsService
          .subscribeToAlerts(this.ownerId)
          .subscribe({
            next: (alert: Alert) => {
              // Avoid duplicates
              if (!this.alerts.find(a => a.id === alert.id)) {
                this.alerts = [alert, ...this.alerts];
              }
            },
            error: () => {}
          });

        this.wsSubs.push(locSub, alertSub);
      })
      .catch(() => {
        // WebSocket not available — polling covers updates
      });
  }

  // ── Computed stats ─────────────────────────────────

  get totalTrucks():    number {
    return this.trucks.length;
  }

  get activeTrucks():   number {
    return this.trucks
      .filter(t => t.status === TruckStatus.ACTIVE).length;
  }

  get ongoingTrips():   number {
    return this.trips
      .filter(t => t.status === TripStatus.ONGOING).length;
  }

  get criticalAlerts(): number {
    return this.alerts.filter(a =>
      a.severity === AlertSeverity.CRITICAL ||
      a.severity === AlertSeverity.HIGH
    ).length;
  }

  get recentAlerts(): Alert[] {
    return this.alerts.slice(0, 5);
  }

  get recentTrips(): Trip[] {
    return this.trips.slice(0, 5);
  }

  // ── User helpers ───────────────────────────────────

  get trialDaysRemaining(): number {
    return this.authService.getCurrentUser()?.trialDaysRemaining || 0;
  }

  get isTrial(): boolean {
    return this.authService.getCurrentUser()?.accountStatus === 'TRIAL';
  }

  get userName(): string {
    return this.authService.getCurrentUser()
      ?.fullName?.split(' ')[0] || 'Owner';
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // ── Navigation ─────────────────────────────────────

  goToTrucks():          void { this.router.navigate(['/trucks']); }
  goToTrips():           void { this.router.navigate(['/trips']); }
  goToAlerts():          void { this.router.navigate(['/alerts']); }
  goToSubscription():    void { this.router.navigate(['/subscription']); }
  addTruck():            void { this.router.navigate(['/trucks', 'new']); }

  goToTruckDetail(id: number): void {
    this.router.navigate(['/trucks', id]);
  }

  goToTripDetail(id: number): void {
    this.router.navigate(['/trips', id]);
  }

  // ── UI helpers ─────────────────────────────────────

  getSeverityClass(severity: string): string {
    return severity?.toLowerCase() || '';
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || '';
  }

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatTime(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('en-KE', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  fuelPercent(truck: Truck): number {
    if (!truck.currentFuelLevel || !truck.fuelCapacityL) return 0;
    return Math.round(
      (truck.currentFuelLevel / truck.fuelCapacityL) * 100
    );
  }

  fuelColor(pct: number): string {
    if (pct > 50) return 'var(--success)';
    if (pct > 20) return 'var(--warning)';
    return 'var(--danger)';
  }
}
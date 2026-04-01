import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TruckService } from '../../../core/services/truck.service';
import { TripService } from '../../../core/services/trip.service';
import { AlertService } from '../../../core/services/alert.service';
import { Truck } from '../../../core/models/truck.model';
import { Trip } from '../../../core/models/trip.model';
import { Alert } from '../../../core/models/alert.model';

@Component({
  selector: 'app-truck-detail',
  templateUrl: './truck-detail.component.html',
  styleUrls: ['./truck-detail.component.scss']
})
export class TruckDetailComponent implements OnInit {

  loading  = true;
  truck!:  Truck;
  trips:   Trip[]  = [];
  alerts:  Alert[] = [];
  activeTab = 'overview';

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private truckService: TruckService,
    private tripService:  TripService,
    private alertService: AlertService,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadData(id);
  }

  loadData(id: number): void {
    this.loading = true;
    this.truckService.getTruckById(id).subscribe({
      next: truck => {
        this.truck = truck;
        this.loading = false;
        this.loadTrips();
        this.loadAlerts();
      },
      error: () => { this.loading = false; this.router.navigate(['/trucks']); }
    });
  }

  loadTrips(): void {
    this.tripService.getTripsByTruck(this.truck.id).subscribe({
      next: trips => this.trips = trips
    });
  }

  loadAlerts(): void {
    this.alertService.getUnreadByTruck(this.truck.id).subscribe({
      next: alerts => this.alerts = alerts
    });
  }

  editTruck(): void {
    this.router.navigate(['/trucks', this.truck.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/trucks']);
  }

  updateStatus(status: string): void {
    this.truckService.updateStatus(this.truck.id, status).subscribe({
      next: updated => {
        this.truck = updated;
        this.snackBar.open(
          `Status updated to ${status}`,
          '',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      }
    });
  }

  fuelPercent(): number {
    if (!this.truck?.currentFuelLevel || !this.truck?.fuelCapacityL) return 0;
    return Math.round(
      (this.truck.currentFuelLevel / this.truck.fuelCapacityL) * 100
    );
  }

  fuelColor(): string {
    const p = this.fuelPercent();
    if (p > 50) return 'var(--success)';
    if (p > 20) return 'var(--warning)';
    return 'var(--danger)';
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-KE',
      { day:'numeric', month:'short', year:'numeric' }
    );
  }

  goToTripDetail(id: number): void {
    this.router.navigate(['/trips', id]);
  }
}
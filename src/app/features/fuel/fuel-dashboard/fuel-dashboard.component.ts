import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { TruckService } from '../../../core/services/truck.service';
import { FuelService } from '../../../core/services/fuel.service';
import { TripService } from '../../../core/services/trip.service';
import { Truck } from '../../../core/models/truck.model';
import { Trip, TripStatus } from '../../../core/models/trip.model';
import { FuelReading } from '../../../core/models/fuel.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fuel-dashboard',
  templateUrl: './fuel-dashboard.component.html',
  styleUrls: ['./fuel-dashboard.component.scss']
})
export class FuelDashboardComponent implements OnInit {

  loading         = true;
  trucks: Truck[] = [];
  trips:  Trip[]  = [];

  selectedTruckId: number | null = null;
  fuelReadings:    FuelReading[] = [];
  loadingReadings  = false;

  dateFrom = this.defaultFrom();
  dateTo   = new Date().toISOString().split('T')[0];

  constructor(
    private authService:  AuthService,
    private truckService: TruckService,
    private fuelService:  FuelService,
    private tripService:  TripService
  ) {}

  ngOnInit(): void {
    const ownerId = this.authService.getOwnerId()!;

    forkJoin([
      this.truckService.getTrucksByOwner(ownerId),
      this.tripService.getAllTripsByOwner(ownerId)
    ]).subscribe({
      next: ([trucks, trips]) => {
        this.trucks  = trucks;
        this.trips   = trips;
        this.loading = false;
        if (trucks.length > 0) {
          this.selectTruck(trucks[0].id);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  selectTruck(id: number): void {
    this.selectedTruckId = id;
    this.loadReadings();
  }

  loadReadings(): void {
    if (!this.selectedTruckId) return;
    this.loadingReadings = true;

    this.fuelService.getFuelReadingsInRange(
      this.selectedTruckId,
      this.dateFrom + 'T00:00:00Z',
      this.dateTo   + 'T23:59:59Z'
    ).subscribe({
      next:  readings => { this.fuelReadings = readings; this.loadingReadings = false; },
      error: ()       => { this.loadingReadings = false; }
    });
  }

  // ── Getters ────────────────────────────────────────

  get selectedTruck(): Truck | undefined {
    return this.trucks.find(t => t.id === this.selectedTruckId);
  }

  get currentFuelPct(): number {
    const t = this.selectedTruck;
    if (!t || !t.currentFuelLevel || !t.fuelCapacityL) return 0;
    return Math.round((t.currentFuelLevel / t.fuelCapacityL) * 100);
  }

  get totalFuelUsedThisMonth(): number {
    return this.trips
      .filter(t => t.fuelUsedL && t.fuelUsedL > 0)
      .reduce((sum, t) => sum + (t.fuelUsedL || 0), 0);
  }

  get avgEfficiency(): number {
    const valid = this.trips.filter(
      t => t.fuelEfficiencyKmL && t.fuelEfficiencyKmL > 0
    );
    if (!valid.length) return 0;
    const total = valid.reduce(
      (s, t) => s + (t.fuelEfficiencyKmL || 0), 0
    );
    return +( total / valid.length ).toFixed(1);
  }

  get completedTrips(): Trip[] {
    return this.trips.filter(t => t.status === TripStatus.COMPLETED);
  }

  // ── Helpers ────────────────────────────────────────

  fuelColor(pct: number): string {
    if (pct > 50) return 'var(--success)';
    if (pct > 20) return 'var(--warning)';
    return 'var(--danger)';
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-KE',
      { day: 'numeric', month: 'short' }
    );
  }

  private defaultFrom(): string {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }
}
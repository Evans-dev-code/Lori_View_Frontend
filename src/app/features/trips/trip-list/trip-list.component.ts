import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TripService, TripStartRequest } from '../../../core/services/trip.service';
import { TruckService } from '../../../core/services/truck.service';
import { Trip, TripStatus } from '../../../core/models/trip.model';
import { Truck } from '../../../core/models/truck.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {

  loading      = true;
  trips:       Trip[]  = [];
  filtered:    Trip[]  = [];
  trucks:      Truck[] = [];
  search       = '';
  filterStatus = 'ALL';
  showStartForm = false;
  starting     = false;

  statuses = ['ALL', 'ONGOING', 'COMPLETED', 'CANCELLED'];

  startForm!: FormGroup;

  commonRoutes = [
    { from: 'Mombasa Port',    to: 'Nairobi ICD' },
    { from: 'Nairobi ICD',     to: 'Kampala ICD' },
    { from: 'Mombasa Port',    to: 'Kampala ICD' },
    { from: 'Kampala ICD',     to: 'Kigali' },
    { from: 'Nairobi ICD',     to: 'Dar es Salaam' }
  ];

  constructor(
    private tripService:  TripService,
    private truckService: TruckService,
    private authService:  AuthService,
    private router:       Router,
    private fb:           FormBuilder,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    this.startForm = this.fb.group({
      truckId:     ['', Validators.required],
      origin:      ['', Validators.required],
      destination: ['', Validators.required]
    });

    const ownerId = this.authService.getOwnerId()!;
    this.truckService.getTrucksByOwner(ownerId).subscribe(
      trucks => this.trucks = trucks
    );
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    const ownerId = this.authService.getOwnerId()!;
    this.tripService.getAllTripsByOwner(ownerId).subscribe({
      next: trips => {
        this.trips    = trips;
        this.filtered = trips;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.trips.filter(t => {
      const matchSearch =
        !this.search ||
        t.origin?.toLowerCase().includes(this.search.toLowerCase()) ||
        t.destination?.toLowerCase().includes(this.search.toLowerCase()) ||
        t.plateNumber?.toLowerCase().includes(this.search.toLowerCase());

      const matchStatus =
        this.filterStatus === 'ALL' ||
        t.status === this.filterStatus;

      return matchSearch && matchStatus;
    });
  }

  onSearch(val: string):       void { this.search = val;       this.applyFilter(); }
  onStatusFilter(s: string):   void { this.filterStatus = s;   this.applyFilter(); }

  fillRoute(from: string, to: string): void {
    this.startForm.patchValue({ origin: from, destination: to });
  }

  startTrip(): void {
  if (this.startForm.invalid) {
    this.startForm.markAllAsTouched();
    return;
  }
  this.starting = true;

  const request: TripStartRequest = {
    truckId:     Number(this.startForm.value.truckId), // ensure number
    origin:      this.startForm.value.origin,
    destination: this.startForm.value.destination
  };

  this.tripService.startTrip(request).subscribe({
    next: trip => {
      this.starting      = false;
      this.showStartForm = false;
      this.snackBar.open(
        `Trip started: ${trip.origin} → ${trip.destination}`,
        '',
        { duration: 4000, panelClass: ['success-snackbar'],
          horizontalPosition: 'right', verticalPosition: 'top' }
      );
      this.loadTrips();
    },
    error: err => {
      this.starting = false;
      const msg = err.error?.message || 'Failed to start trip';
      this.snackBar.open(msg, 'Dismiss', {
        duration: 4000, panelClass: ['error-snackbar'],
        horizontalPosition: 'right', verticalPosition: 'top'
      });
    }
  });
}

  viewTrip(id: number): void {
    this.router.navigate(['/trips', id]);
  }

  get ongoingCount():   number { return this.trips.filter(t => t.status === TripStatus.ONGOING).length; }
  get completedCount(): number { return this.trips.filter(t => t.status === TripStatus.COMPLETED).length; }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-KE',
      { day:'numeric', month:'short', year:'numeric' }
    );
  }

  duration(start: string, end: string): string {
    if (!start || !end) return '—';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }
}
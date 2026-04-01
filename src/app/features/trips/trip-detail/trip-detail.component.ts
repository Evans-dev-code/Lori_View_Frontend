import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripService } from '../../../core/services/trip.service';
import { Trip, TripStatus } from '../../../core/models/trip.model';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss']
})
export class TripDetailComponent implements OnInit {

  loading  = true;
  trip!:   Trip;
  ending   = false;
  cancelling = false;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private tripService: TripService,
    private snackBar:    MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.tripService.getTripById(id).subscribe({
      next: trip => { this.trip = trip; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/trips']); }
    });
  }

  get isOngoing(): boolean {
    return this.trip?.status === TripStatus.ONGOING;
  }

  endTrip(): void {
    if (!confirm('Mark this trip as completed?')) return;
    this.ending = true;
    this.tripService.endTrip(this.trip.id).subscribe({
      next: updated => {
        this.trip   = updated;
        this.ending = false;
        this.snackBar.open(
          'Trip completed successfully!', '',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      },
      error: () => { this.ending = false; }
    });
  }

  cancelTrip(): void {
    if (!confirm('Cancel this trip?')) return;
    this.cancelling = true;
    this.tripService.cancelTrip(this.trip.id).subscribe({
      next: updated => {
        this.trip       = updated;
        this.cancelling = false;
        this.snackBar.open(
          'Trip cancelled.', '',
          { duration: 3000 }
        );
      },
      error: () => { this.cancelling = false; }
    });
  }

  goBack(): void { this.router.navigate(['/trips']); }

  goToTruck(): void {
    if (this.trip?.truckId) {
      this.router.navigate(['/trucks', this.trip.truckId]);
    }
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-KE', {
      day:'numeric', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
  }

  duration(): string {
    if (!this.trip?.startedAt || !this.trip?.endedAt) return '—';
    const ms = new Date(this.trip.endedAt).getTime() -
               new Date(this.trip.startedAt).getTime();
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    return `${h} hours ${m} minutes`;
  }
}
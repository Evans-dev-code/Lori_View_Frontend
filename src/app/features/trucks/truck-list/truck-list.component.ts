import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TruckService } from '../../../core/services/truck.service';
import { Truck, TruckStatus } from '../../../core/models/truck.model';

@Component({
  selector: 'app-truck-list',
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.scss']
})
export class TruckListComponent implements OnInit {

  loading  = true;
  trucks:  Truck[] = [];
  filtered: Truck[] = [];
  search   = '';
  filterStatus = 'ALL';

  statuses = ['ALL', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'];

  constructor(
    private truckService: TruckService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTrucks();
  }

  loadTrucks(): void {
    this.loading = true;
    const ownerId = this.authService.getOwnerId()!;
    this.truckService.getTrucksByOwner(ownerId).subscribe({
      next: trucks => {
        this.trucks   = trucks;
        this.filtered = trucks;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.trucks.filter(t => {
      const matchSearch =
        !this.search ||
        t.plateNumber.toLowerCase().includes(this.search.toLowerCase()) ||
        (t.make || '').toLowerCase().includes(this.search.toLowerCase()) ||
        (t.model || '').toLowerCase().includes(this.search.toLowerCase());

      const matchStatus =
        this.filterStatus === 'ALL' ||
        t.status === this.filterStatus;

      return matchSearch && matchStatus;
    });
  }

  onSearch(val: string): void {
    this.search = val;
    this.applyFilter();
  }

  onFilterStatus(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  viewTruck(id: number): void {
    this.router.navigate(['/trucks', id]);
  }

  addTruck(): void {
    this.router.navigate(['/trucks', 'new']);
  }

  editTruck(e: Event, id: number): void {
    e.stopPropagation();
    this.router.navigate(['/trucks', id, 'edit']);
  }

  deleteTruck(e: Event, truck: Truck): void {
    e.stopPropagation();
    if (!confirm(`Delete truck ${truck.plateNumber}? This cannot be undone.`)) return;
    this.truckService.deleteTruck(truck.id).subscribe({
      next: () => {
        this.snackBar.open(
          `${truck.plateNumber} removed`,
          '',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.loadTrucks();
      }
    });
  }

  get activeTrucks(): number {
    return this.trucks.filter(
      t => t.status === TruckStatus.ACTIVE
    ).length;
  }

  fuelPercent(truck: Truck): number {
    if (!truck.currentFuelLevel || !truck.fuelCapacityL) return 0;
    return Math.round((truck.currentFuelLevel / truck.fuelCapacityL) * 100);
  }

  fuelColor(pct: number): string {
    if (pct > 50) return 'var(--success)';
    if (pct > 20) return 'var(--warning)';
    return 'var(--danger)';
  }
}
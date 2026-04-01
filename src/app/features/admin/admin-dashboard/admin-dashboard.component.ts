import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AdminDashboard } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  loading = true;
  stats: AdminDashboard = {
    totalOwners:       0,
    totalTrucks:       0,
    totalTrips:        0,
    activeSubscribers: 0,
    trialOwners:       0,
    activeOwners:      0,
    expiredOwners:     0,
    totalRevenueKes:   0,
    monthlyRevenueKes: 0,
    newOwnersThisMonth:0,
    tripsThisMonth:    0
  };

  constructor(
    private adminService: AdminService,
    public  router:       Router
  ) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next:  s => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}
}
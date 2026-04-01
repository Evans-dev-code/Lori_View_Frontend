import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Payment, PaymentStatus } from '../../../core/models/payment.model';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {

  loading        = true;
  payments: Payment[] = [];
  filtered: Payment[] = [];
  filterStatus   = 'ALL';
  statuses       = ['ALL', 'SUCCESS', 'PENDING', 'FAILED'];

  constructor(
    private adminService: AdminService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllPayments().subscribe({
      next: payments => {
        this.payments = payments;
        this.filtered = payments;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.filterStatus === 'ALL'
      ? this.payments
      : this.payments.filter(
          p => p.status === this.filterStatus
        );
  }

  get totalRevenue(): number {
    return this.payments
      .filter(p => p.status === PaymentStatus.SUCCESS)
      .reduce((s, p) => s + p.amountKes, 0);
  }

  statusClass(s: string): string { return s.toLowerCase(); }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('en-KE',
      { day:'numeric', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit' }
    );
  }

  goBack(): void { this.router.navigate(['/admin']); }
}
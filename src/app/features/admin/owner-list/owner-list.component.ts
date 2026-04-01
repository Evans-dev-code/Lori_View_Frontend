import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { Owner } from '../../../core/models/owner.model';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.scss']
})
export class OwnerListComponent implements OnInit {

  loading       = true;
  owners: Owner[] = [];
  filtered: Owner[] = [];
  search        = '';
  filterStatus  = 'ALL';
  statuses      = ['ALL','TRIAL','ACTIVE','EXPIRED','SUSPENDED'];

  constructor(
    private adminService: AdminService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllOwners().subscribe({
      next:  o => { this.owners = o; this.filtered = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.owners.filter(o => {
      const matchSearch =
        !this.search ||
        o.fullName.toLowerCase().includes(this.search.toLowerCase()) ||
        o.email.toLowerCase().includes(this.search.toLowerCase()) ||
        o.phone?.includes(this.search);

      const matchStatus =
        this.filterStatus === 'ALL' ||
        o.accountStatus === this.filterStatus;

      return matchSearch && matchStatus;
    });
  }

  viewOwner(id: number): void {
    this.router.navigate(['/admin/owners', id]);
  }

  goBack(): void { this.router.navigate(['/admin']); }

  statusClass(s: string): string {
    return s?.toLowerCase() || 'trial';
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-KE',
      { day:'numeric', month:'short', year:'numeric' }
    );
  }
}
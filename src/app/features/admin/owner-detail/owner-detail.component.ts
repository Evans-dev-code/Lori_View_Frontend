import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { Owner } from '../../../core/models/owner.model';
import { Truck } from '../../../core/models/truck.model';
import { Payment } from '../../../core/models/payment.model';
import { Subscription } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.scss']
})
export class OwnerDetailComponent implements OnInit {

  loading      = true;
  ownerId!:    number;
  owner!:      Owner;
  trucks:      Truck[]        = [];
  payments:    Payment[]      = [];
  subscriptions: Subscription[] = [];

  showAddTruck = false;
  addingTruck  = false;
  suspending   = false;

  truckForm!: FormGroup;

  makes = ['Isuzu','Volvo','Mercedes','MAN','Scania',
           'DAF','Iveco','Toyota','Mitsubishi','Hino'];

  activeTab: 'trucks' | 'payments' | 'subscriptions' = 'trucks';

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private fb:           FormBuilder,
    private adminService: AdminService,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ownerId = +this.route.snapshot.paramMap.get('id')!;

    this.truckForm = this.fb.group({
      plateNumber:   ['', [Validators.required,
                          Validators.pattern(/^[A-Z]{3}\s?\d{3}[A-Z]$/i)]],
      make:          ['', Validators.required],
      model:         ['', Validators.required],
      year:          [''],
      fuelCapacityL: ['', [Validators.required, Validators.min(1)]],
      deviceImei:    ['', Validators.pattern(/^\d{15}$/)]
    });

    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    forkJoin([
      this.adminService.getOwnerById(this.ownerId),
      this.adminService.getOwnerTrucks(this.ownerId),
      this.adminService.getOwnerPayments(this.ownerId),
      this.adminService.getOwnerSubscriptions(this.ownerId)
    ]).subscribe({
      next: ([owner, trucks, payments, subs]) => {
        this.owner         = owner as Owner;
        this.trucks        = trucks as Truck[];
        this.payments      = payments as Payment[];
        this.subscriptions = subs as Subscription[];
        this.loading       = false;
      },
      error: () => { this.loading = false; }
    });
  }

  addTruck(): void {
    if (this.truckForm.invalid) {
      this.truckForm.markAllAsTouched();
      return;
    }
    this.addingTruck = true;
    const payload: any = {
      ...this.truckForm.value,
      year:          this.truckForm.value.year
                     ? Number(this.truckForm.value.year) : undefined,
      fuelCapacityL: Number(this.truckForm.value.fuelCapacityL),
      deviceImei:    this.truckForm.value.deviceImei || undefined,
      plateNumber:   this.truckForm.value.plateNumber?.toUpperCase()
    };

    this.adminService.addTruckForOwner(this.ownerId, payload)
      .subscribe({
        next: truck => {
          this.addingTruck  = false;
          this.showAddTruck = false;
          this.trucks.push(truck as any);
          this.truckForm.reset();
          this.snackBar.open(
            `Truck ${(truck as any).plateNumber} added!`,
            '', { duration: 3000, panelClass: ['success-snackbar'],
                  horizontalPosition: 'right', verticalPosition: 'top' }
          );
        },
        error: err => {
          this.addingTruck = false;
          const msg = err.error?.message || 'Failed to add truck';
          this.snackBar.open(msg, 'Dismiss', {
            duration: 4000, panelClass: ['error-snackbar']
          });
        }
      });
  }

  suspendOwner(): void {
    this.suspending = true;
    this.adminService.suspendOwner(this.ownerId).subscribe({
      next: o => {
        this.owner      = o as Owner;
        this.suspending = false;
        this.snackBar.open('Owner suspended', '', {
          duration: 3000, panelClass: ['success-snackbar']
        });
      },
      error: () => { this.suspending = false; }
    });
  }

  activateOwner(): void {
    this.adminService.activateOwner(this.ownerId).subscribe({
      next: o => {
        this.owner = o as Owner;
        this.snackBar.open('Owner activated', '', {
          duration: 3000, panelClass: ['success-snackbar']
        });
      }
    });
  }

  goBack(): void { this.router.navigate(['/admin/owners']); }

  statusClass(s: string): string { return s?.toLowerCase() || 'trial'; }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-KE',
      { day:'numeric', month:'short', year:'numeric' }
    );
  }

  formatAmount(n: number): string {
    return n ? `KES ${n.toLocaleString()}` : '—';
  }

  err(f: string): string {
    const c = this.truckForm.get(f);
    if (!c?.invalid || !c?.touched) return '';
    if (c.hasError('required')) return 'Required';
    if (c.hasError('pattern'))  return 'Invalid format';
    if (c.hasError('min'))      return 'Too small';
    return '';
  }
}
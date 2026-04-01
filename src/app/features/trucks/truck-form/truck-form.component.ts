import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TruckService } from '../../../core/services/truck.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-truck-form',
  templateUrl: './truck-form.component.html',
  styleUrls: ['./truck-form.component.scss']
})
export class TruckFormComponent implements OnInit {

  form!:    FormGroup;
  isEdit    = false;
  truckId!: number;
  loading   = false;
  saving    = false;

  makes = [
    'Isuzu', 'Volvo', 'Mercedes', 'MAN', 'Scania',
    'DAF', 'Iveco', 'Toyota', 'Mitsubishi', 'Hino'
  ];

  constructor(
    private fb:           FormBuilder,
    private truckService: TruckService,
    private authService:  AuthService,
    private route:        ActivatedRoute,
    private router:       Router,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      plateNumber:   ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{3}\s?\d{3}[A-Z]$/i)
      ]],
      make:          ['', Validators.required],
      model:         ['', Validators.required],
      year:          ['', [
        Validators.min(1990),
        Validators.max(new Date().getFullYear() + 1)
      ]],
      fuelCapacityL: ['', [Validators.required, Validators.min(1)]],
      deviceImei:    ['', Validators.pattern(/^\d{15}$/)]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit  = true;
      this.truckId = +id;
      this.loadTruck();
    }
  }

  loadTruck(): void {
    this.loading = true;
    this.truckService.getTruckById(this.truckId).subscribe({
      next:  truck => { this.form.patchValue(truck); this.loading = false; },
      error: ()    => { this.loading = false; this.goBack(); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const ownerId = this.authService.getOwnerId()!;

    // Use 'any' to avoid strict null checks on optional fields
    const payload: any = {
      ownerId,
      plateNumber:   this.form.value.plateNumber?.toUpperCase().trim(),
      make:          this.form.value.make,
      model:         this.form.value.model,
      year:          this.form.value.year
                       ? Number(this.form.value.year)
                       : undefined,
      fuelCapacityL: this.form.value.fuelCapacityL
                       ? Number(this.form.value.fuelCapacityL)
                       : undefined,
      deviceImei:    this.form.value.deviceImei?.trim() || undefined
    };

    const req$ = this.isEdit
      ? this.truckService.updateTruck(this.truckId, payload)
      : this.truckService.registerTruck(payload);

    req$.subscribe({
      next: truck => {
        this.saving = false;
        this.snackBar.open(
          `Truck ${truck.plateNumber} ${this.isEdit ? 'updated' : 'registered'} successfully!`,
          '',
          {
            duration:           3000,
            panelClass:         ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition:   'top'
          }
        );
        this.router.navigate(['/trucks', truck.id]);
      },
      error: err => {
        this.saving = false;
        const message = err.error?.message || 'Failed to save truck. Please try again.';
        this.snackBar.open(message, 'Dismiss', {
          duration:           4000,
          panelClass:         ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition:   'top'
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/trucks']);
  }

  err(field: string): string {
    const c = this.form.get(field);
    if (!c?.invalid || !c?.touched) return '';
    if (c.hasError('required'))  return 'This field is required';
    if (c.hasError('pattern'))   return 'Invalid format';
    if (c.hasError('min'))       return 'Value too small';
    if (c.hasError('max'))       return 'Value too large';
    return 'Invalid value';
  }
}
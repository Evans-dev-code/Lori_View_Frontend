import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TruckService } from '../../../core/services/truck.service';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  saving        = false;
  savingPw      = false;
  hidePw        = true;
  hideNewPw     = true;

  truckCount = 0;
  tripCount  = 0;

  get user() { return this.authService.getCurrentUser(); }

  get accountStatus(): string {
    return this.user?.accountStatus || 'TRIAL';
  }

  get trialDays(): number {
    return this.user?.trialDaysRemaining || 0;
  }

  get initials(): string {
    return (this.user?.fullName || 'U')
      .split(' ').map((n: string) => n[0])
      .join('').toUpperCase().slice(0, 2);
  }

  constructor(
    private fb:           FormBuilder,
    private authService:  AuthService,
    private truckService: TruckService,
    private tripService:  TripService,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: [this.user?.fullName || '', Validators.required],
      phone:    [this.user?.phone || '',
                 Validators.pattern(/^(\+254|0)[17]\d{8}$/)]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirm:     ['', Validators.required]
    }, { validators: this.matchPasswords });

    const ownerId = this.authService.getOwnerId()!;
    this.truckService.getTrucksByOwner(ownerId).subscribe(
      trucks => this.truckCount = trucks.length
    );
    this.tripService.getAllTripsByOwner(ownerId).subscribe(
      trips => this.tripCount = trips.length
    );
  }

  matchPasswords(g: any) {
    return g.get('newPassword').value === g.get('confirm').value
      ? null : { mismatch: true };
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Profile updated!', '', {
          duration: 3000, panelClass: ['success-snackbar'],
          horizontalPosition: 'right', verticalPosition: 'top'
        });
      },
      error: () => { this.saving = false; }
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPw = true;
    this.authService.updateProfile({
      password: this.passwordForm.value.newPassword
    }).subscribe({
      next: () => {
        this.savingPw = false;
        this.passwordForm.reset();
        this.snackBar.open('Password updated!', '', {
          duration: 3000, panelClass: ['success-snackbar'],
          horizontalPosition: 'right', verticalPosition: 'top'
        });
      },
      error: () => { this.savingPw = false; }
    });
  }

  logout(): void { this.authService.logout(); }
}
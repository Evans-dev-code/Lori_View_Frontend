import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  isLoading    = false;
  hidePw       = true;
  hideConfirm  = true;
  currentStep  = 0;

  steps = ['Account', 'Security', 'Ready'];

  benefits = [
    { icon: '📍', text: 'Live GPS tracking for all your trucks' },
    { icon: '⛽', text: 'Fuel consumption monitoring & theft alerts' },
    { icon: '🔔', text: 'Instant SMS & push notifications' },
    { icon: '📊', text: 'Full trip history & analytics reports' },
    { icon: '🔧', text: 'Vehicle health & engine diagnostics' },
    { icon: '💰', text: 'Cost & profitability tracking per trip' }
  ];

  trialFeatures = [
    '2 trucks monitored for free',
    'Full access to all features',
    'No credit card required',
    'Cancel anytime'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName:        ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      phone:           ['', [Validators.required,
                             Validators.pattern(/^(\+254|0)[17]\d{8}$/)]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agree:           [false, Validators.requiredTrue]
    }, { validators: this.passwordMatch });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatch(group: AbstractControl) {
    const pw  = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  get pwStrength(): number {
    const pw = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (pw.length >= 6)                  score++;
    if (pw.length >= 10)                 score++;
    if (/[A-Z]/.test(pw))               score++;
    if (/[0-9]/.test(pw))               score++;
    if (/[^A-Za-z0-9]/.test(pw))        score++;
    return score;
  }

  get pwStrengthLabel(): string {
    const s = this.pwStrength;
    if (s <= 1) return 'Weak';
    if (s <= 2) return 'Fair';
    if (s <= 3) return 'Good';
    if (s <= 4) return 'Strong';
    return 'Very strong';
  }

  get pwStrengthColor(): string {
    const s = this.pwStrength;
    if (s <= 1) return '#ef4444';
    if (s <= 2) return '#f59e0b';
    if (s <= 3) return '#3b82f6';
    return '#22c55e';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { fullName, email, phone, password } = this.registerForm.value;

    this.authService.register({ fullName, email, phone, password }).subscribe({
      next: res => {
        this.isLoading = false;
        this.snackBar.open(
          `Welcome to LoriView, ${res.fullName.split(' ')[0]}! Your 14-day trial has started. 🎉`,
          '',
          { duration: 5000, panelClass: ['success-snackbar'],
            horizontalPosition: 'right', verticalPosition: 'top' }
        );
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading = false;
        this.snackBar.open(
          err.error?.message || 'Registration failed. Please try again.',
          'Dismiss',
          { duration: 4000, panelClass: ['error-snackbar'],
            horizontalPosition: 'right', verticalPosition: 'top' }
        );
      }
    });
  }

  err(field: string): string {
    const c = this.registerForm.get(field);
    if (!c?.invalid || !c?.touched) return '';
    if (c.hasError('required'))    return `${this.fieldLabel(field)} is required`;
    if (c.hasError('email'))       return 'Enter a valid email address';
    if (c.hasError('minlength'))   return `Minimum ${c.errors?.['minlength']?.requiredLength} characters`;
    if (c.hasError('pattern'))     return 'Enter a valid Kenyan number (07xx or +254)';
    return '';
  }

  get confirmErr(): string {
    const c = this.registerForm.get('confirmPassword');
    if (!c?.touched) return '';
    if (this.registerForm.hasError('mismatch')) return 'Passwords do not match';
    return '';
  }

  private fieldLabel(f: string): string {
    const map: Record<string, string> = {
      fullName: 'Full name', email: 'Email', phone: 'Phone number',
      password: 'Password', confirmPassword: 'Confirm password'
    };
    return map[f] || f;
  }
}
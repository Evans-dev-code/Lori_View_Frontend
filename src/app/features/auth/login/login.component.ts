import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  activeStatIndex = 0;
  private ticker: any;

  stats = [
    { icon: '🚛', value: '2,400+', label: 'Trucks tracked daily' },
    { icon: '⛽', value: '18%',    label: 'Avg fuel saved per fleet' },
    { icon: '📍', value: '< 5s',   label: 'Real-time alert speed' },
    { icon: '🛡️', value: '99.7%',  label: 'Platform uptime' }
  ];

  features = [
    {
      icon: '🗺️',
      title: 'Live GPS Map',
      desc: 'Watch every truck move in real time on an interactive map. Know exactly where your fleet is at any second — from Mombasa Port to Kampala ICD.'
    },
    {
      icon: '⛽',
      title: 'Fuel Intelligence',
      desc: 'Track litres consumed per kilometre on every trip. Detect sudden fuel drops that signal siphoning before your driver reaches the next stop.'
    },
    {
      icon: '🔔',
      title: 'Instant Alerts',
      desc: 'Get SMS and push notifications the moment a truck speeds, leaves its route, goes offline, or shows unusual engine behaviour.'
    },
    {
      icon: '📊',
      title: 'Trip Analytics',
      desc: 'Full history for every Mombasa–Kampala run. Distance, fuel, average speed, idle time, stops — all in one clear report.'
    },
    {
      icon: '🔧',
      title: 'Vehicle Health',
      desc: 'OBD-II diagnostics tell you about engine faults before they cause a breakdown 400 km from the nearest workshop.'
    },
    {
      icon: '👤',
      title: 'Driver Scoring',
      desc: 'Score every driver on speed compliance, fuel efficiency and harsh braking. Know who is costing you money and who is saving it.'
    }
  ];

  testimonials = [
    {
      quote: 'We cut fuel costs by 22% in the first three months. The fuel theft alerts alone paid for the whole system.',
      name: 'Peter Njoroge',
      role: 'Fleet Owner · Nairobi',
      avatar: 'PN',
      color: '#f59e0b'
    },
    {
      quote: 'I used to call drivers every hour to know where they were. Now I just open LoriView and see everything.',
      name: 'Grace Auma',
      role: 'Logistics Manager · Mombasa',
      avatar: 'GA',
      color: '#6366f1'
    },
    {
      quote: 'The geofence alerts stopped two unauthorised detours last month. Money saved, cargo delivered on time.',
      name: 'Samuel Ochieng',
      role: 'Transport Owner · Kampala',
      avatar: 'SO',
      color: '#22c55e'
    }
  ];

  routes = [
    { from: 'Mombasa', to: 'Nairobi',   km: 480,  active: true,  trucks: 4 },
    { from: 'Nairobi', to: 'Kampala',   km: 660,  active: true,  trucks: 3 },
    { from: 'Mombasa', to: 'Kampala',   km: 1140, active: false, trucks: 1 },
    { from: 'Kampala', to: 'Kigali',    km: 500,  active: true,  trucks: 2 },
    { from: 'Nairobi', to: 'Dar',       km: 860,  active: false, trucks: 1 },
    { from: 'Mombasa', to: 'Dar',       km: 530,  active: true,  trucks: 2 }
  ];

  plans = [
    { name: 'Basic',    price: 'KES 1,500', trucks: 'Up to 3 trucks',    color: '#64748b' },
    { name: 'Standard', price: 'KES 3,500', trucks: 'Up to 10 trucks',   color: '#f59e0b', popular: true },
    { name: 'Premium',  price: 'KES 7,000', trucks: 'Unlimited trucks',  color: '#6366f1' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.ticker = setInterval(() => {
      this.activeStatIndex = (this.activeStatIndex + 1) % this.stats.length;
    }, 2800);
  }

  ngOnDestroy(): void {
    clearInterval(this.ticker);
  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  this.authService.login(
    this.loginForm.value.email,
    this.loginForm.value.password
  ).subscribe({
    next: response => {
      this.isLoading = false;

      if (response.role === 'SUPER_ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    },
    error: err => {
      this.isLoading = false;
      const msg = err.error?.message || 'Invalid email or password';
      this.snackBar.open(msg, 'Dismiss', {
        duration:           4000,
        panelClass:         ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition:   'top'
      });
    }
  });
}

  emailError(): string {
    const c = this.loginForm.get('email');
    if (c?.hasError('required')) return 'Email is required';
    if (c?.hasError('email'))    return 'Enter a valid email';
    return '';
  }

  passwordError(): string {
    const c = this.loginForm.get('password');
    if (c?.hasError('required'))   return 'Password is required';
    if (c?.hasError('minlength'))  return 'Minimum 6 characters';
    return '';
  }
}
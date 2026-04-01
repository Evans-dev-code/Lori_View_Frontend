import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MpesaService, PlanPrice } from '../../../core/services/mpesa.service';
import { Subscription } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {

  plans: PlanPrice[]  = [];
  currentSubscription: Subscription | null = null;
  loading = true;

  planFeatures: Record<string, string[]> = {
    BASIC: [
      'Live GPS tracking',
      'Fuel monitoring',
      'Speed & geofence alerts',
      'Trip history & reports',
      'Driver management'
    ],
    STANDARD: [
      'Live GPS tracking',
      'Fuel monitoring',
      'Speed & geofence alerts',
      'Trip history & reports',
      'Driver management',
      'Vehicle diagnostics'
    ],
    PREMIUM: [
      'Live GPS tracking',
      'Fuel monitoring',
      'Speed & geofence alerts',
      'Trip history & reports',
      'Driver management',
      'Vehicle diagnostics',
      'Cost & profitability tracking',
      'Priority support'
    ]
  };

  get trialDays(): number {
    return this.authService.getCurrentUser()?.trialDaysRemaining || 0;
  }

  get isTrial(): boolean {
    return this.authService.getCurrentUser()?.accountStatus === 'TRIAL';
  }

  get isExpired(): boolean {
    return this.authService.getCurrentUser()?.accountStatus === 'EXPIRED';
  }

  constructor(
    private mpesaService: MpesaService,
    private authService:  AuthService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.plans   = this.mpesaService.plans;
    this.loading = false;
  }

  getFeaturesForPlan(plan: string): string[] {
    return this.planFeatures[plan] || [];
  }

  selectPlan(plan: PlanPrice): void {
    this.router.navigate(['/subscription/pay'], {
      queryParams: {
        plan:   plan.plan,
        amount: plan.priceKes,
        trucks: plan.trucks
      }
    });
  }

  planColor(plan: string): string {
    const map: Record<string, string> = {
      BASIC:    'var(--text-muted)',
      STANDARD: 'var(--amber)',
      PREMIUM:  'var(--indigo)'
    };
    return map[plan] || 'var(--text-muted)';
  }
}
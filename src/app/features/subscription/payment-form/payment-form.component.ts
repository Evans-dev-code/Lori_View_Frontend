import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MpesaService } from '../../../core/services/mpesa.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {

  form!:        FormGroup;
  plan          = '';
  amountKes     = 0;
  trucks        = '';
  paying        = false;
  paymentSent   = false;
  subscriptionId = 0;

  constructor(
    private fb:           FormBuilder,
    private route:        ActivatedRoute,
    private router:       Router,
    private mpesaService: MpesaService,
    private authService:  AuthService,
    private snackBar:     MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.plan      = params['plan']   || '';
      this.amountKes = +params['amount'] || 0;
      this.trucks    = params['trucks'] || '';
    });

    this.form = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(\+254|0)[17]\d{8}$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.paying = true;
    const ownerId = this.authService.getOwnerId()!;
    const phone   = this.form.value.phone;

    // First create subscription, then initiate payment
    this.mpesaService
      .createSubscription(ownerId, this.plan)
      .subscribe({
        next: sub => {
          this.subscriptionId = sub.id;
          this.mpesaService.initiateStkPush(
            ownerId, sub.id, phone, this.amountKes
          ).subscribe({
            next: () => {
              this.paying     = false;
              this.paymentSent = true;
            },
            error: () => { this.paying = false; }
          });
        },
        error: () => { this.paying = false; }
      });
  }

  goBack(): void {
    this.router.navigate(['/subscription']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  phoneError(): string {
    const c = this.form.get('phone');
    if (!c?.invalid || !c?.touched) return '';
    if (c.hasError('required')) return 'Phone number is required';
    if (c.hasError('pattern'))
      return 'Enter a valid Kenyan number (07xx or +254)';
    return '';
  }
}
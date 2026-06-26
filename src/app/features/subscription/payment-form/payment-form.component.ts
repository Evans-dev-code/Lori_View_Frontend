import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { MpesaService } from '../../../core/services/mpesa.service';
import { AuthService } from '../../../core/services/auth.service';

type PaymentState =
  | 'form'
  | 'sending'
  | 'waiting_pin'
  | 'success'
  | 'failed'
  | 'timeout';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  plan          = '';
  amountKes     = 0;
  trucks        = '';

  state: PaymentState = 'form';
  checkoutRequestId   = '';
  statusMessage       = '';
  receiptNumber       = '';

  private pollSub?: Subscription;
  private pollCount = 0;
  private readonly MAX_POLLS = 24; // 24 x 5s = 120 seconds max wait

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
      this.plan      = params['plan']    || '';
      this.amountKes = +params['amount'] || 0;
      this.trucks    = params['trucks']  || '';
    });

    this.form = this.fb.group({
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(\+254|0)[17]\d{8}$/)
      ]]
    });
  }

  ngOnDestroy(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state = 'sending';
    const ownerId = this.authService.getOwnerId()!;
    const phone   = this.form.value.phone;

    this.mpesaService
      .createSubscription(ownerId, this.plan)
      .subscribe({
        next: sub => {
          this.mpesaService.initiateStkPush(
            ownerId, sub.id, phone, this.amountKes
          ).subscribe({
            next: payment => {
              this.checkoutRequestId = payment.checkoutRequestId;
              this.state = 'waiting_pin';
              this.startPolling();
            },
            error: (err) => {
              this.state = 'failed';
              this.statusMessage = err.error?.details || 'Could not send payment prompt. Try again.';
            }
          });
        },
        error: () => {
          this.state = 'failed';
          this.statusMessage = 'Could not create subscription. Try again.';
        }
      });
  }

  private startPolling(): void {
    this.pollCount = 0;

    this.pollSub = interval(5000).pipe(
      switchMap(() =>
        this.mpesaService.getPaymentStatus(this.checkoutRequestId)
      ),
      takeWhile(res =>
        res.status === 'PENDING' && this.pollCount < this.MAX_POLLS,
        true // emit the final value that breaks the condition too
      )
    ).subscribe({
      next: res => {
        this.pollCount++;

        if (res.status === 'SUCCESS') {
          this.state = 'success';
          this.receiptNumber = res.receiptNumber || '';
          this.pollSub?.unsubscribe();
        } else if (res.status === 'FAILED') {
          this.state = 'failed';
          this.statusMessage = res.message || 'Payment failed or was cancelled.';
          this.pollSub?.unsubscribe();
        } else if (this.pollCount >= this.MAX_POLLS) {
          this.state = 'timeout';
          this.pollSub?.unsubscribe();
        } else {
          this.statusMessage = res.message || 'Waiting for PIN entry…';
        }
      },
      error: () => {
        // Network blip — keep polling, don't fail immediately
      }
    });
  }

  retryPayment(): void {
    this.state = 'form';
    this.statusMessage = '';
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/subscription']);
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
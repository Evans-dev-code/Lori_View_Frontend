import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment } from '../models/payment.model';
import { Subscription } from '../models/subscription.model';
import { SubscriptionPlan } from '../models/subscription.model';

export interface PlanPrice {
  plan:      SubscriptionPlan;
  priceKes:  number;
  trucks:    string;
  popular?:  boolean;
}

@Injectable({ providedIn: 'root' })
export class MpesaService {

  private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  createSubscription(
    ownerId: number,
    plan: string
  ): Observable<Subscription> {
    const params = new HttpParams()
      .set('ownerId', ownerId)
      .set('plan', plan);
    return this.http.post<Subscription>(
      `${this.api}/subscriptions/create`,
      null,
      { params }
    );
  }

  initiateStkPush(
    ownerId:        number,
    subscriptionId: number,
    phoneNumber:    string,
    amountKes:      number
  ): Observable<Payment> {
    const params = new HttpParams()
      .set('ownerId',        ownerId)
      .set('subscriptionId', subscriptionId)
      .set('phoneNumber',    phoneNumber)
      .set('amountKes',      amountKes);
    return this.http.post<Payment>(
      `${this.api}/mpesa/stk-push`,
      null,
      { params }
    );
  }

  plans: PlanPrice[] = [
    {
      plan:     SubscriptionPlan.BASIC,
      priceKes: 1500,
      trucks:   'Up to 3 trucks'
    },
    {
      plan:     SubscriptionPlan.STANDARD,
      priceKes: 3500,
      trucks:   'Up to 10 trucks',
      popular:  true
    },
    {
      plan:     SubscriptionPlan.PREMIUM,
      priceKes: 7000,
      trucks:   'Unlimited trucks'
    }
  ];

  getActiveSubscription(ownerId: number): Observable<Subscription> {
  return this.http.get<Subscription>(
    `${this.api}/subscriptions/owner/${ownerId}/active`
  );
}
}
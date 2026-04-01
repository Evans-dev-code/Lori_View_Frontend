import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';

@NgModule({
  declarations: [SubscriptionPlansComponent, PaymentFormComponent],
  imports: [SharedModule, SubscriptionRoutingModule]
})
export class SubscriptionModule { }
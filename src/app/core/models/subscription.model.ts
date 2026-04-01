export interface Subscription {
  id:         number;
  ownerId:    number;
  plan:       SubscriptionPlan;
  amountKes:  number;
  startedAt:  string;
  expiresAt:  string;
  isActive:   boolean;
  createdAt:  string;
}

export enum SubscriptionPlan {
  BASIC    = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM  = 'PREMIUM'
}
export interface Payment {
  id:                  number;
  ownerId:             number;
  subscriptionId:      number;
  merchantRequestId:   string;
  checkoutRequestId:   string;
  mpesaReceiptNumber:  string;
  phoneNumber:         string;
  amountKes:           number;
  status:              PaymentStatus;
  resultCode:          string;
  resultDescription:   string;
  paidAt:              string;
  createdAt:           string;
}

export enum PaymentStatus {
  PENDING   = 'PENDING',
  SUCCESS   = 'SUCCESS',
  FAILED    = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED  = 'REFUNDED'
}
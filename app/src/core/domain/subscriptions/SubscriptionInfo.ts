import { PaymentInfo } from "./PaymentInfo";

export interface SubscriptionInfo {
  id: string;
  name: string;
  purchaseDate: string;
  pricing: string;
  status: string;
  cancelDate?: string;
  nextBillDate?: string;
  active: boolean;
  planType: string;
  klarna: boolean;
  paymentInfo: PaymentInfo;
}

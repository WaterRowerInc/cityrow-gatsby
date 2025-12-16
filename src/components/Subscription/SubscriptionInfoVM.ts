import { PaymentInfo } from "../../core/domain/subscriptions/PaymentInfo";
export interface SubscriptionInfoVM {
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

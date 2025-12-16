import { PaymentInfo } from "./PaymentInfo";
import { SubscriptionInfo } from "./SubscriptionInfo";

export interface PaymentInfoService {
  getPaymentInfo(): Promise<PaymentInfo>;

  updatePaymentInfo(paymentMethod: string, coupon?: string): Promise<SubscriptionInfo>;
}

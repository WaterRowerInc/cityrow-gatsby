import { NoPaymentInfoError } from "../../domain/payment/NoPaymentInfoError";
import { PaymentInfoService } from "../../domain/subscriptions/PaymentInfoService";
import { PaymentInfo } from "../../domain/subscriptions/PaymentInfo";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class GetUserPaymentInfo {
  private readonly paymentInfoService: PaymentInfoService;

  constructor(paymentInfoService: PaymentInfoService) {
    this.paymentInfoService = paymentInfoService;
  }

  execute = async (): Promise<PaymentInfo> => {
    try {
      return await this.paymentInfoService.getPaymentInfo();
    } catch (e: any) {
      if (e instanceof NoPaymentInfoError) throw e;
      throw new NotExpectedError(e.message);
    }
  };
}

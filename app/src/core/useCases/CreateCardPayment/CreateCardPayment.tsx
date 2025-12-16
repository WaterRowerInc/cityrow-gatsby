import { PaymentService } from "../../domain/payment/PaymentService";
import { CreateCardPaymentRequest } from "../../domain/payment/CreateCardPaymentRequest";
import { CreatePaymentError } from "../../domain/payment/CreatePaymentError";

export class CreateCardPayment {
  private readonly paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  execute = async (request: CreateCardPaymentRequest) => {
    try {
      return await this.paymentService.createCardPayment(request);
    } catch (e: any) {
      throw new CreatePaymentError(e.message);
    }
  };
}

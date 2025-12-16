import { PaymentService } from "../../domain/payment/PaymentService";
import { KlarnaSessionRequest } from "../../domain/payment/KlarnaSessionRequest";
import { KlarnaSession } from "../../domain/payment/KlarnaSession";

export class CreateKlarnaSession {
  private readonly paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  execute = async (klarnaSessionRequest: KlarnaSessionRequest): Promise<KlarnaSession> =>
    await this.paymentService.createKlarnaSession(klarnaSessionRequest);
}

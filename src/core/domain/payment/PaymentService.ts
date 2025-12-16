import { StripePlan } from "./StripePlan";
import { KlarnaSessionRequest } from "./KlarnaSessionRequest";
import { KlarnaSession } from "./KlarnaSession";
import { CreateCardPaymentRequest } from "./CreateCardPaymentRequest";

export interface PaymentService {
  createKlarnaSession(klarnaSessionRequest: KlarnaSessionRequest): Promise<KlarnaSession>;

  getPaymentPlanFromStripePlanId(stripePlanId: string): Promise<StripePlan>;

  createCardPayment(request: CreateCardPaymentRequest): Promise<string>;
}

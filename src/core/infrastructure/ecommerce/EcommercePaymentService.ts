import swell from "swell-js";
import { loadStripe } from "@stripe/stripe-js";
import { EcommerceClient } from "./EcommerceClient";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { PaymentService } from "../../domain/payment/PaymentService";
import { StripePlan } from "../../domain/payment/StripePlan";
import { KlarnaSessionRequest } from "../../domain/payment/KlarnaSessionRequest";
import { KlarnaSession } from "../../domain/payment/KlarnaSession";
import { CreateCardPaymentRequest } from "../../domain/payment/CreateCardPaymentRequest";

export class EcommercePaymentService implements PaymentService {
  private readonly ecommerceClient: EcommerceClient;

  constructor(ecommerceClient: EcommerceClient) {
    this.ecommerceClient = ecommerceClient;
  }

  createKlarnaSession = async (klarnaSessionRequest: KlarnaSessionRequest): Promise<KlarnaSession> => {
    const stripe = await loadStripe(process.env.GATSBY_STRIPE_USD!);
    const sourceOptions: any = {
      type: "klarna",
      amount: klarnaSessionRequest.amount,
      currency: klarnaSessionRequest.currency,
      klarna: {
        first_name: klarnaSessionRequest.firstName,
        last_name: klarnaSessionRequest.lastName,
        locale: klarnaSessionRequest.locale,
        product: "payment",
        purchase_country: klarnaSessionRequest.country,
        shipping_first_name: klarnaSessionRequest.firstName,
        shipping_last_name: klarnaSessionRequest.lastName,
      },
      owner: {
        address: {
          city: klarnaSessionRequest.city,
          country: klarnaSessionRequest.country,
          line1: klarnaSessionRequest.address,
          line2: klarnaSessionRequest.apartment,
          postal_code: klarnaSessionRequest.postalCode,
          state: klarnaSessionRequest.state,
        },
        email: klarnaSessionRequest.email,
        name: `${klarnaSessionRequest.firstName} ${klarnaSessionRequest.lastName}`,
        phone: klarnaSessionRequest.phone,
      },
      source_order: {
        items: klarnaSessionRequest.items,
        shipping: {
          address: {
            city: klarnaSessionRequest.city,
            country: klarnaSessionRequest.country,
            line1: klarnaSessionRequest.address,
            line2: klarnaSessionRequest.apartment,
            postal_code: klarnaSessionRequest.postalCode,
            state: klarnaSessionRequest.state,
          },
          phone: klarnaSessionRequest.phone,
        },
      },
    };
    const response = await stripe?.createSource(sourceOptions);
    if (!response?.source?.klarna?.client_token)
      throw new NotExpectedError(response?.error?.message || "Not expected Error, contact with your administrator");
    return this.jsonToKlarnaSession(response);
  };

  getPaymentPlanFromStripePlanId = async (stripePlanId: string): Promise<StripePlan> => {
    try {
      const allStripePlans = await this.getAllStripePlans();
      return allStripePlans.find((stripePlan) => stripePlan.id === stripePlanId)!;
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  createCardPayment = async ({ amount, currency, paymentMethod }: CreateCardPaymentRequest): Promise<string> => {
    const stripe = await loadStripe(process.env.GATSBY_STRIPE_USD!);
    const intent = await swell.payment.createIntent({
      gateway: "stripe",
      intent: {
        payment_method: paymentMethod,
        amount,
        currency,
        capture_method: "manual",
        setup_future_usage: "off_session",
      },
    });
    const response = await stripe!.confirmCardPayment(intent.clientSecret);
    if (response.error) throw new Error(response.error.message);
    return response!.paymentIntent!.id;
  };

  private jsonToKlarnaSession = (json: any): KlarnaSession => ({
    id: json.source.id,
    paymentMethods: json.source.klarna.payment_method_categories,
    token: json.source.klarna.client_token,
  });

  private getAllStripePlans = async (): Promise<StripePlan[]> => {
    try {
      const response = await swell.content.get("stripe-plan");
      return response?.results?.map((json) => this.jsonToStripePlan(json)) || [];
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  private jsonToStripePlan = (json: any): StripePlan => ({
    id: json.id,
    paymentPlanId: json.backendUuid,
  });
}

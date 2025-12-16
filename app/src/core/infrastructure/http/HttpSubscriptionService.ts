import { PromoCode } from "../../domain/subscriptions/PromoCode";
import { HttpClient } from "./HttpClient";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SubscriptionRequest } from "../../domain/subscriptions/SubscriptionRequest";
import { SubscriptionInfo } from "../../domain/subscriptions/SubscriptionInfo";
import { PaymentInfo } from "../../domain/subscriptions/PaymentInfo";

export class HttpSubscriptionService implements SubscriptionService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  createNotStartedSubscription = async ({
    country,
    paymentMethod,
    paymentPlanId,
    postalCode,
    state,
    couponCode,
  }: SubscriptionRequest) => {
    try {
      await this.httpClient.post("/v2/create-not-started-subscription/", {
        country,
        payment_plan_id: paymentPlanId,
        postal_code: postalCode,
        payment_method: paymentMethod,
        state,
        coupon: couponCode,
      });
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  createSubscription = async ({
    country,
    paymentMethod,
    paymentPlanId,
    postalCode,
    state,
    couponCode,
  }: SubscriptionRequest) => {
    try {
      await this.httpClient.post("/v2/subscribe/", {
        ...(country && { country }),
        payment_plan_id: paymentPlanId,
        ...(postalCode && { postal_code: postalCode }),
        payment_method: paymentMethod,
        ...(state && { state }),
        coupon: couponCode,
      });
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  cancelSubscription = async (): Promise<SubscriptionInfo> => {
    try {
      const response = await this.httpClient.delete("/subscribe/cancel/");
      return this.jsonToSubscriptionInfo(response.data);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  checkPromoCode = async (code: string): Promise<PromoCode> => {
    const response = await this.httpClient.get(`/validate-coupon/${code}/`);
    return this.jsonToPromoCode(response.data);
  };

  getUserSubscription = async (): Promise<SubscriptionInfo> => {
    const response = await this.httpClient.get("/billing_info/");
    return this.jsonToSubscriptionInfo(response.data);
  };

  getSubscriptionStatus = async (): Promise<string | null> => {
    const response = await this.httpClient.get("/billing_info/");
    return response?.data?.status;
  };

  subscribeWithKlarna = async ({
    country,
    couponCode,
    paymentPlanId,
    postalCode,
    source,
    state,
  }: SubscriptionRequest) => {
    try {
      await this.httpClient.post("/subscribe-klarna/", {
        country,
        coupon: couponCode,
        payment_plan_id: paymentPlanId,
        postal_code: postalCode,
        source,
        state,
      });
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  updateSubscriptionPlan = async (planId: string): Promise<SubscriptionInfo> => {
    const res = await this.httpClient.post("/subscribe/update/", { plan_id: planId });
    return this.jsonToSubscriptionInfo(res.data);
  };

  private jsonToPromoCode = (json: any): PromoCode => ({
    id: json?.discount?.coupon?.id,
    name: json?.discount?.coupon?.name,
    discount: json?.total_discount_amounts
      ?.map((discount) => discount.amount / 100)
      .reduce((item, total) => item + total),
    total: json?.total / 100,
  });

  private jsonToPaymentInfo = (json: any): PaymentInfo => ({
    number: json?.last4,
    expiration: json?.exp_month
      ?.toString()
      ?.padStart(2, "0")
      ?.concat(`/${json?.exp_year?.toString()?.substr(2, 2)}`),
    klarna: json?.klarna,
  });

  private jsonToSubscriptionInfo = (json: any): SubscriptionInfo => ({
    id: json.stripe_id,
    name: json.title,
    purchaseDate: json.purchase_date,
    pricing: `- $${json.plan_amount / 100}/${json.plan_type?.toLowerCase() === "yearly" ? "Year" : "Month"}`,
    status: json.status,
    cancelDate: json.cancelled_on,
    nextBillDate: json.next_billing_date || "-",
    active: json.status ? json.status?.toLowerCase().includes("active") : false,
    planType: json.plan_type,
    klarna: json.klarna,
    paymentInfo: this.jsonToPaymentInfo(json.card_data),
  });
}

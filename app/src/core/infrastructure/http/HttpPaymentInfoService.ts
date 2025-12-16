import { NoPaymentInfoError } from "../../domain/payment/NoPaymentInfoError";
import { PaymentInfo } from "../../domain/subscriptions/PaymentInfo";
import { PaymentInfoService } from "../../domain/subscriptions/PaymentInfoService";
import { SubscriptionInfo } from "../../domain/subscriptions/SubscriptionInfo";
import { HttpClient } from "./HttpClient";

export class HttpPaymentInfoService implements PaymentInfoService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getPaymentInfo = async (): Promise<PaymentInfo> => {
    const response = await this.httpClient.get("/token_info/");
    if (!response?.data?.last4) throw new NoPaymentInfoError();
    return this.jsonToPaymentInfo(response.data);
  };

  updatePaymentInfo = async (paymentMethod: string, coupon?: string): Promise<SubscriptionInfo> => {
    const response = await this.httpClient.post("/v2/subscribe/update/", {
      payment_method: paymentMethod,
      ...(coupon && { coupon: coupon }),
    });
    return this.jsonToSubscriptionInfo(response.data);
  };

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

  private jsonToPaymentInfo = (json: any): PaymentInfo => ({
    number: json?.last4,
    expiration: json?.exp_month
      ?.toString()
      ?.padStart(2, "0")
      ?.concat(`/${json?.exp_year?.toString()?.substr(2, 2)}`),
    klarna: json?.klarna,
  });
}

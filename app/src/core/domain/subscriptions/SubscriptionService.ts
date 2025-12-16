import { SubscriptionRequest } from "./SubscriptionRequest";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { PromoCode } from "./PromoCode";

export interface SubscriptionService {
  createNotStartedSubscription(subscriptionRequest: SubscriptionRequest);

  createSubscription(subscriptionRequest: SubscriptionRequest);

  checkPromoCode(code: string): Promise<PromoCode>;

  getSubscriptionStatus(): Promise<string | null>;

  getUserSubscription(): Promise<SubscriptionInfo>;

  cancelSubscription(): Promise<SubscriptionInfo>;

  subscribeWithKlarna(subscriptionRequest: SubscriptionRequest);

  updateSubscriptionPlan(planId: string): Promise<SubscriptionInfo>;
}

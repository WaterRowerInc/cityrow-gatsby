export interface SubscriptionRequest {
  country?: string;
  source?: string;
  paymentMethod?: string;
  state?: string;
  paymentPlanId: string;
  postalCode?: string;
  couponCode?: string;
}

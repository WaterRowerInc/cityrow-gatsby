export interface Coupon {
  couponCode: string;
  id?: string;
  name?: string;
  period: string;
  stripeId: string;
  amountOff?: number;
  percentageOff?: number;
}

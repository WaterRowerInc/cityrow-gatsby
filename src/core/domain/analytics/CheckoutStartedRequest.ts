import { ProductAnalyticsRequest } from "./ProductAnalyticsRequest";

export interface CheckoutStartedRequest {
  affiliation: string;
  cart_id: string;
  coupon: string;
  currency: string;
  discount: number;
  package: string;
  products: ProductAnalyticsRequest[];
  shipping: number;
  tax: number;
}

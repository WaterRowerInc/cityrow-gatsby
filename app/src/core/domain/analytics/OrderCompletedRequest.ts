import { ProductAnalyticsRequest } from "./ProductAnalyticsRequest";

export interface OrderCompletedRequest {
  affiliation: string;
  coupon: string;
  currency: string;
  discount: number;
  order_id: string;
  package: string;
  products: ProductAnalyticsRequest[];
  revenue: number;
  shipping: number;
  shipping_method: string;
  tax: number;
  total: number;
}

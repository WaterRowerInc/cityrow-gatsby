export interface ProductAnalyticsRequest {
  brand: string;
  cart_id?: string;
  category: string;
  coupon: string;
  currency?: string;
  image_url: string;
  name: string;
  package?: string;
  position: number;
  price: number;
  product_id: string;
  quantity: number;
  revenueType?: string;
  sku: string;
  value?: number;
  variant: string;
  url: string;
}

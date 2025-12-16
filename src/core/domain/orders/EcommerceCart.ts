import { Coupon } from "../coupons/Coupon";

export interface EcommerceCart {
  couponCode?: string;
  coupon?: CartCoupon;
  discounts: number;
  subscriptionDiscounts: number;
  discountsList: Discount[];
  id: string;
  items: CartItem[];
  shippingMethod: string;
  shippingPrice: number;
  subscriptionCoupon?: Coupon;
  subTotal: number;
  tax: number;
  totalPrice: number;
  displayTotal: number;
}

export interface Discount {
  type: string;
  amount: number;
  rule: { productId?: string; type: "total" | "product" | "shipment"; valuePercent: number; valueType: "percent" };
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  productId: string;
  options: CartItemOption[];
  price: number;
  discount: number;
  discountTitle?: string;
  quantity: number;
  bundleItems: CartItem[];
  isSubscription: boolean;
  hasSubscriptionPackage: boolean;
  subtitle?: string;
  disclaimer?: string;
  originalPrice?: number;
  shippingOptions?: string[];
  allowParcelShipping?: boolean;
  needsSubscription?: boolean;
  hasSalePrice?: boolean;
  slug: string;
}

export interface CartItemOption {
  name: string;
  value: string;
}

export interface CartCoupon {
  name: string;
  description: string;
}

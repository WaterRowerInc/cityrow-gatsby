export interface CartVM {
  coupon?: CartCouponVM;
  couponCode?: string;
  discounts: string;
  subscriptionDiscounts?: string;
  itemsQuantity: number;
  items: CartItemVM[];
  shipping: string;
  subTotal: string;
  tax: string;
  totalPrice: string;
  displayPrice: string;
}

export interface CartItemVM {
  id: string;
  name: string;
  options: CartItemOptionVM[];
  price: string;
  priceWithoutPromotion?: string;
  appliedPromotionName?: string;
  bundleItems: CartItemVM[];
  quantity: number;
  isSubscription?: boolean;
  disclaimer?: string;
  subtitle?: string;
  originalPrice?: string;
  hasSalePrice?: boolean;
}

export interface CartItemOptionVM {
  name: string;
  value: string;
}

export interface AppliedPromotion {
  name: string;
  amount: number;
}

export interface CartCouponVM {
  name: string;
  description: string;
}

import { Item } from "./Item";
import { UpdateCartRequest } from "./UpdateCartRequest";
import { ShippingOption } from "./ShippingOption";
import { EcommerceCart } from "./EcommerceCart";
import { Cart } from "./Cart";
import { Coupon } from "../coupons/Coupon";

export type EcommerceCartCallback = (cart: EcommerceCart) => void;
export type CartCallback = (cart: Cart) => void;
export type CartSubscription = { unsubscribe: () => void };
export type CartSubscriptionUpdate = { unsubscribe: () => void };

export interface CartService {
  addToCart(items: Item[]): Promise<EcommerceCart>;

  applyCouponToCart(promoCode: string): Promise<EcommerceCart>;

  applySubscriptionCouponToCart(subscriptionCoupon: Coupon): Promise<EcommerceCart>;

  getCart(): Promise<EcommerceCart>;

  getShippingOptions(): Promise<ShippingOption[]>;

  removeCouponsFromCart(): Promise<EcommerceCart>;

  removeSubscriptionsFromCart(): Promise<EcommerceCart>;

  removeItemFromCart(itemId: string): Promise<EcommerceCart>;

  updateCart(updateCartRequest: UpdateCartRequest): Promise<EcommerceCart>;

  subscribe(callback: EcommerceCartCallback): CartSubscription;
}

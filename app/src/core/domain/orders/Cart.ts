import { CartCoupon, CartItem, Discount, EcommerceCart } from "./EcommerceCart";
import { Coupon } from "../coupons/Coupon";

export class Cart {
  coupon?: CartCoupon;
  couponCode?: string;
  discounts = 0;
  subscriptionDiscounts = 0;
  discountsList: Discount[] = [];
  hasSubscription = false;
  hasSubscriptionPackage = false;
  needsSubscription = false;
  id = "";
  items: CartItem[] = [];
  shippingMethod = "";
  shippingPrice = 0;
  subTotal = 0;
  tax = 0;
  totalPrice = 0;
  displayTotal = 0;
  subscriptionCoupon?: Coupon;

  get = (): Cart => this;

  getItemsQuantity = (): number => this.items.length;

  getPackage = (): string => {
    if (this.hasSubscriptionPackage) {
      if (this.items.some((item) => item.name.toLowerCase().includes("max"))) return "Max";
      if (this.items.some((item) => item.name.toLowerCase().includes("classic"))) return "Classic";
      if (this.items.some((item) => item.name.toLowerCase().includes("commodule"))) return "ComMod";
    }
    if (this.hasSubscription) return "Subscription";
    return "";
  };

  getSubscription = (): string | undefined =>
    this.items
      ?.find((item) => item.options.find((option) => ["Plan", "Subscription"].includes(option.name)))
      ?.options.find((option) => ["Plan", "Subscription"].includes(option.name))?.value;

  hasRower = (): boolean =>
    this.items.some((item) => item.name.toLowerCase().includes("max") || item.name.toLowerCase().includes("classic"));

  reset = (): void => {
    this.coupon = undefined;
    this.couponCode = undefined;
    this.discounts = 0;
    this.discountsList = [];
    this.hasSubscription = false;
    this.hasSubscriptionPackage = false;
    this.id = "";
    this.items = [];
    this.shippingMethod = "";
    this.shippingPrice = 0;
    this.subscriptionCoupon = undefined;
    this.subTotal = 0;
    this.tax = 0;
    this.totalPrice = 0;
    this.displayTotal = 0;
  };

  findCouponCode = (): string | undefined => {
    const subscriptionPlan = this.getSubscription();
    if (
      !(
        this.subscriptionCoupon?.period.toLowerCase() === "all" ||
        this.subscriptionCoupon?.period?.toLowerCase() === subscriptionPlan?.toLowerCase()
      )
    )
      return;
    return this.subscriptionCoupon?.couponCode;
  };

  update = ({
    coupon,
    couponCode,
    discounts,
    subscriptionDiscounts,
    discountsList,
    items,
    id,
    shippingMethod,
    shippingPrice,
    subscriptionCoupon,
    subTotal,
    tax,
    displayTotal,
    totalPrice,
  }: EcommerceCart): Cart => {
    this.coupon = coupon;
    this.couponCode = couponCode;
    this.discounts = discounts;
    this.subscriptionDiscounts = subscriptionDiscounts;
    this.discountsList = discountsList;
    this.id = id;
    this.items = items;
    this.shippingMethod = shippingMethod;
    this.shippingPrice = shippingPrice;
    this.subscriptionCoupon = subscriptionCoupon;
    this.subTotal = subTotal;
    this.tax = tax;
    this.totalPrice = totalPrice;
    this.displayTotal = displayTotal;
    this.updateStatus();
    return this;
  };

  private updateStatus = () => {
    this.hasSubscription = this.items.some((item) => item.isSubscription);
    this.hasSubscriptionPackage = this.items.some((item) => item.hasSubscriptionPackage);
    this.needsSubscription = this.items.some((item) => item.needsSubscription);
  };
}

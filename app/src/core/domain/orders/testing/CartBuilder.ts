import { CartCoupon, CartItem, Discount } from "../EcommerceCart";
import { Cart } from "../Cart";
import { Coupon } from "../../coupons/Coupon";

// noinspection JSMismatchedCollectionQueryUpdate
export class CartBuilder {
  private coupon?: CartCoupon;
  private couponCode?: string;
  private discounts = 0;
  private discountsList: Discount[] = [];
  private hasSubscription = false;
  private hasSubscriptionPackage = false;
  private id = "";
  private items: CartItem[] = [];
  private shippingPrice = 0;
  private subTotal = 0;
  private tax = 0;
  private totalPrice = 0;
  private subscriptionCoupon?: Coupon;

  withCouponCode = (couponCode?: string): CartBuilder => {
    this.couponCode = couponCode;
    if (couponCode) this.coupon = { name: couponCode, description: "a description" };
    return this;
  };

  withDiscounts = (discounts: number): CartBuilder => {
    this.discounts = discounts;
    return this;
  };

  withDiscountsList = (discountsList: Discount[]): CartBuilder => {
    this.discountsList = discountsList;
    return this;
  };

  withHasSubscription = (hasSubscription: boolean): CartBuilder => {
    this.hasSubscription = hasSubscription;
    return this;
  };

  withHasSubscriptionPackage = (hasSubscriptionPackage: boolean): CartBuilder => {
    this.hasSubscriptionPackage = hasSubscriptionPackage;
    return this;
  };

  withItem = (item: CartItem): CartBuilder => {
    this.items.push(item);
    return this;
  };

  withShippingPrice = (shippingPrice: number): CartBuilder => {
    this.shippingPrice = shippingPrice;
    return this;
  };

  withSubTotal = (subTotal: number): CartBuilder => {
    this.subTotal = subTotal;
    return this;
  };

  withTax = (tax: number): CartBuilder => {
    this.tax = tax;
    return this;
  };

  withTotalPrice = (totalPrice: number): CartBuilder => {
    this.totalPrice = totalPrice;
    return this;
  };

  build = (): Cart => {
    const myCart = new Cart();
    myCart.coupon = this.coupon;
    myCart.couponCode = this.couponCode;
    myCart.discounts = this.discounts;
    myCart.discountsList = this.discountsList;
    myCart.hasSubscription = this.hasSubscription;
    myCart.hasSubscriptionPackage = this.hasSubscriptionPackage;
    myCart.id = this.id;
    myCart.items = this.items;
    myCart.shippingPrice = this.shippingPrice;
    myCart.subTotal = this.subTotal;
    myCart.tax = this.tax;
    myCart.totalPrice = this.totalPrice;
    myCart.subscriptionCoupon = this.subscriptionCoupon;
    return myCart;
  };
}

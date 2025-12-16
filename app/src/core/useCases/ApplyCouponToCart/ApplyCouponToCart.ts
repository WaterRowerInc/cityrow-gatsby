import { CartService } from "../../domain/orders/CartService";
import { Cart } from "../../domain/orders/Cart";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";
import { CouponService } from "../../domain/coupons/CouponService";
import { InvalidCouponPlanError } from "../../domain/coupons/InvalidCouponPlanError";
import { Coupon } from "../../domain/coupons/Coupon";
import { NoSubscriptionInCartError } from "../../domain/coupons/NoSubscriptionInCartError";
import { EcommerceCart } from "../../domain/orders/EcommerceCart";
import { InvalidCouponError } from "../../domain/coupons/InvalidCouponError";

export class ApplyCouponToCart {
  private readonly cart: Cart;
  private readonly cartService: CartService;
  private readonly couponService: CouponService;
  private readonly trackAnalytics: TrackAnalytics;
  private promoCode: string;
  private ecommerceCart: EcommerceCart | undefined;

  constructor(cart: Cart, cartService: CartService, couponService: CouponService, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.cartService = cartService;
    this.couponService = couponService;
    this.trackAnalytics = trackAnalytics;
    this.promoCode = "";
  }

  execute = async (promoCode: string): Promise<Cart> => {
    try {
      this.promoCode = promoCode;
      await this.trackCouponEvent("Coupon Entered");
      const subscriptionCoupon = await this.getEcommerceCoupon();
      if (subscriptionCoupon) {
        await this.applySubscriptionCoupon(subscriptionCoupon);
      } else {
        this.ecommerceCart = await this.cartService.applyCouponToCart(promoCode);
      }
      await this.trackCouponCode();
      return this.cart.update(this.ecommerceCart!);
    } catch (e: any) {
      if (e instanceof InvalidCouponPlanError) throw e;
      if (e instanceof NoSubscriptionInCartError) throw e;
      throw new NotExpectedError(e.message);
    }
  };

  private getEcommerceCoupon = async (): Promise<Coupon | undefined> => {
    try {
      return await this.couponService.findByCode(this.promoCode);
    } catch (e) {
      return;
    }
  };

  private applySubscriptionCoupon = async (subscriptionCoupon: Coupon) => {
    const subscription = this.cart.items.find((item) => item.isSubscription);
    if (!subscription) throw new NoSubscriptionInCartError();
    if (!this.hasSamePlan(subscriptionCoupon, subscription.options[0]?.value)) throw new InvalidCouponPlanError();
    try {
      this.ecommerceCart = await this.cartService.applyCouponToCart(this.promoCode);
    } catch (e) {
      if (!(e instanceof InvalidCouponError)) throw e;
      this.ecommerceCart = await this.cartService.applySubscriptionCouponToCart(subscriptionCoupon);
    }
  };

  private hasSamePlan = (ecommerceCoupon: Coupon, subscriptionPlan: string): boolean =>
    ecommerceCoupon?.period?.toLowerCase() === "all" ||
    ecommerceCoupon?.period?.toLowerCase() === subscriptionPlan.toLowerCase();

  private trackCouponEvent = async (event: string) =>
    await this.trackAnalytics.execute(event, { coupon: this.promoCode });

  private trackCouponCode = async () => {
    if (this.ecommerceCart!.couponCode) {
      await this.trackCouponEvent("Coupon Applied");
    } else {
      await this.trackCouponEvent("Coupon Denied");
    }
  };
}

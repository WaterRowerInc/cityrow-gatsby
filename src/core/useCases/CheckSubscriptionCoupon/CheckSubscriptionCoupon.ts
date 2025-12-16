import { CouponService } from "../../domain/coupons/CouponService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { PromoCode } from "../../domain/subscriptions/PromoCode";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { InvalidCouponPlanError } from "../../domain/coupons/InvalidCouponPlanError";

export class CheckSubscriptionCoupon {
  private readonly subscriptionService: SubscriptionService;
  private readonly couponService: CouponService;

  constructor(subscriptionService: SubscriptionService, couponService: CouponService) {
    this.subscriptionService = subscriptionService;
    this.couponService = couponService;
  }

  execute = async (code: string, planType: string): Promise<PromoCode> => {
    try {
      const ecommerceCoupon = await this.couponService.findByCode(code);
      if (
        ecommerceCoupon?.period?.toLowerCase() !== "all" &&
        ecommerceCoupon?.period?.toLowerCase() !== planType.toLowerCase()
      )
        throw new InvalidCouponPlanError();

      return await this.subscriptionService.checkPromoCode(code);
    } catch (error) {
      if (!(error instanceof InvalidCouponPlanError)) throw new NotExpectedError("Promo Code Not Found");
      throw error;
    }
  };
}

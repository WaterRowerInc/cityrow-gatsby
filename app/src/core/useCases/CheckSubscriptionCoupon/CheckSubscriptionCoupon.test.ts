import { anything, instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { CouponService } from "../../domain/coupons/CouponService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { InvalidCouponPlanError } from "../../domain/coupons/InvalidCouponPlanError";
import { CheckSubscriptionCoupon } from "./CheckSubscriptionCoupon";

describe("CheckSubscriptionCoupon should", () => {
  it("return promo code if introduced coupon and current plan period are found and same", async () => {
    when(couponService.findByCode("aCode")).thenResolve({
      couponCode: "aCouponCode",
      period: "monthly",
      name: "aCouponName",
      stripeId: "aCouponCode",
    });

    await checkSubscriptionCoupon().execute("aCode", "monthly");

    verify(subscriptionService.checkPromoCode(anything())).called();
  });

  it("throw an error if introduced coupon period is different from current plan period", async () => {
    when(couponService.findByCode("aCode")).thenResolve({
      couponCode: "aCouponCode",
      period: "yearly",
      name: "aCouponName",
      stripeId: "aCouponCode",
    });

    await expectThrows(async () => {
      await checkSubscriptionCoupon().execute("aCode", "monthly");
    }, InvalidCouponPlanError);
  });

  it("throw an error if introduced coupon is not found", async () => {
    when(couponService.findByCode("aCode")).thenResolve();

    await expectThrows(async () => {
      await checkSubscriptionCoupon().execute("aCode", "monthly");
    }, InvalidCouponPlanError);
  });

  it("fail if check subscription code fails", async () => {
    when(couponService.findByCode(anything())).thenResolve({
      couponCode: "aCode",
      period: "all",
      name: "aCouponName",
      stripeId: "aCouponCode",
    });
    when(subscriptionService.checkPromoCode(anything())).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await checkSubscriptionCoupon().execute(anything(), anything());
    }, NotExpectedError);
  });

  beforeEach(() => {
    subscriptionService = mock<SubscriptionService>();
    couponService = mock<CouponService>();
  });

  function checkSubscriptionCoupon(): CheckSubscriptionCoupon {
    return new CheckSubscriptionCoupon(instance(subscriptionService), instance(couponService));
  }

  let subscriptionService: SubscriptionService;
  let couponService: CouponService;
});

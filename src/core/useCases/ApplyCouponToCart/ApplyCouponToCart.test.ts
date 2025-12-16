import { CartService } from "../../domain/orders/CartService";
import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { ApplyCouponToCart } from "./ApplyCouponToCart";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";
import { CouponService } from "../../domain/coupons/CouponService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { ecommerceCartItemFixtures } from "../../domain/orders/testing/EcommerceCartItemFixtures";
import { InvalidCouponPlanError } from "../../domain/coupons/InvalidCouponPlanError";
import { NoSubscriptionInCartError } from "../../domain/coupons/NoSubscriptionInCartError";
import { InvalidCouponError } from "../../domain/coupons/InvalidCouponError";

describe("ApplyCouponToCart should", () => {
  it("track coupon entered analytics event", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithACouponCode);
    const aCart = new CartBuilder().build();

    await applyCouponToCart(aCart).execute(aCouponCode);

    verify(trackAnalytics.execute("Coupon Entered", deepEqual(aCouponRequest))).once();
  });

  it("apply Coupon To Cart if the cart doesn't have a subscription", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithACouponCode);
    when(cart.update(anEcommerceCartWithACouponCode)).thenReturn(new CartBuilder().withCouponCode(aCouponCode).build());
    const aCartWithNoSubscription = new CartBuilder().build();

    const newCart = await applyCouponToCart(aCartWithNoSubscription).execute(aCouponCode);

    expect(newCart.couponCode).toBe(aCouponCode);
  });

  it("apply Coupon To Cart with a cart with a subscription and the subscription has the same period than the coupon", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithACouponCode);
    when(couponService.findByCode(aCouponCode)).thenResolve({
      couponCode: aCouponCode,
      period: "monthly",
      name: "aCouponName",
      stripeId: aCouponCode,
    });
    const aCartWithAMonthlySubscription = new CartBuilder()
      .withItem(ecommerceCartItemFixtures.aMonthlySubscriptionItem)
      .build();
    when(cart.update(anEcommerceCartWithACouponCode)).thenReturn(new CartBuilder().withCouponCode(aCouponCode).build());

    const newCart = await applyCouponToCart(aCartWithAMonthlySubscription).execute(aCouponCode);

    expect(newCart.couponCode).toBe(aCouponCode);
  });

  it("apply a Subscription Coupon To Cart", async () => {
    const aCoupon = {
      couponCode: aCouponCode,
      period: "monthly",
      name: "aCouponName",
      stripeId: aCouponCode,
    };
    when(couponService.findByCode(aCouponCode)).thenResolve(aCoupon);
    when(cartService.applySubscriptionCouponToCart(aCoupon)).thenResolve(anEcommerceCartWithACouponCode);
    const aCartWithAMonthlySubscription = new CartBuilder()
      .withItem(ecommerceCartItemFixtures.aMonthlySubscriptionItem)
      .build();
    when(cart.update(anEcommerceCartWithACouponCode)).thenReturn(new CartBuilder().withCouponCode(aCouponCode).build());
    when(cartService.applyCouponToCart(aCouponCode)).thenReject(new InvalidCouponError());

    const newCart = await applyCouponToCart(aCartWithAMonthlySubscription).execute(aCouponCode);

    verify(cartService.applySubscriptionCouponToCart(aCoupon)).once();
    expect(newCart.couponCode).toBe(aCouponCode);
  });

  it("throw an error if applyCouponToCart fails and it doesn't fail because Invalid Coupon Error", async () => {
    const aCoupon = {
      couponCode: aCouponCode,
      period: "monthly",
      name: "aCouponName",
      stripeId: aCouponCode,
    };
    when(couponService.findByCode(aCouponCode)).thenResolve(aCoupon);
    when(cartService.applySubscriptionCouponToCart(aCoupon)).thenResolve(anEcommerceCartWithACouponCode);
    const aCartWithAMonthlySubscription = new CartBuilder()
      .withItem(ecommerceCartItemFixtures.aMonthlySubscriptionItem)
      .build();
    when(cart.update(anEcommerceCartWithACouponCode)).thenReturn(new CartBuilder().withCouponCode(aCouponCode).build());
    when(cartService.applyCouponToCart(aCouponCode)).thenReject(new Error());

    await expectThrows(async () => {
      await applyCouponToCart(aCartWithAMonthlySubscription).execute(aCouponCode);
    }, NotExpectedError);
  });

  it("throw no subscription in cart error if the coupon is a subscription coupon and the cart doesn't have a subscription", async () => {
    when(couponService.findByCode(aCouponCode)).thenResolve({
      couponCode: aCouponCode,
      period: "yearly",
      name: "aCouponName",
      stripeId: aCouponCode,
    });
    const aCartWithoutASubscription = new CartBuilder().build();

    await expectThrows(async () => {
      await applyCouponToCart(aCartWithoutASubscription).execute(aCouponCode);
    }, NoSubscriptionInCartError);
  });

  it("throw an invalid plan error if the Coupon and the subscription has a different period", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithACouponCode);
    when(couponService.findByCode(aCouponCode)).thenResolve({
      couponCode: aCouponCode,
      period: "yearly",
      name: "aCouponName",
      stripeId: aCouponCode,
    });
    const aCartWithAMonthlySubscription = new CartBuilder()
      .withItem(ecommerceCartItemFixtures.aMonthlySubscriptionItem)
      .build();

    await expectThrows(async () => {
      await applyCouponToCart(aCartWithAMonthlySubscription).execute(aCouponCode);
    }, InvalidCouponPlanError);
  });

  it("track coupon applied analytics event if the cart has a coupon applied", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithACouponCode);
    const aCartWithNoSubscription = new CartBuilder().build();

    await applyCouponToCart(aCartWithNoSubscription).execute(aCouponCode);

    verify(trackAnalytics.execute("Coupon Applied", deepEqual({ coupon: aCouponCode }))).once();
  });

  it("track coupon denied analytics event if the cart do not have a coupon applied", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenResolve(anEcommerceCartWithoutACouponCode);
    const aCartWithNoSubscription = new CartBuilder().build();

    await applyCouponToCart(aCartWithNoSubscription).execute(aCouponCode);

    verify(trackAnalytics.execute("Coupon Denied", deepEqual({ coupon: aCouponCode }))).once();
  });

  it("fail if applying the coupon fails", async () => {
    when(cartService.applyCouponToCart(aCouponCode)).thenThrow(new NotExpectedError(anything()));

    await expectThrows(async () => {
      await applyCouponToCart().execute(aCouponCode);
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = mock<Cart>();
    cartService = mock<CartService>();
    couponService = mock<CouponService>();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function applyCouponToCart(aCart?: Cart): ApplyCouponToCart {
    return new ApplyCouponToCart(
      aCart || instance(cart),
      instance(cartService),
      instance(couponService),
      instance(trackAnalytics)
    );
  }

  let cart: Cart;
  let cartService: CartService;
  let couponService: CouponService;
  let trackAnalytics: TrackAnalytics;
  const aCouponCode = ecommerceCartFixtures.anEcommerceCartWithACouponCode.couponCode;
  const anEcommerceCartWithACouponCode = ecommerceCartFixtures.anEcommerceCartWithACouponCode;
  const anEcommerceCartWithoutACouponCode = ecommerceCartFixtures.anEcommerceCart;
  const aCouponRequest = { coupon: aCouponCode };
});

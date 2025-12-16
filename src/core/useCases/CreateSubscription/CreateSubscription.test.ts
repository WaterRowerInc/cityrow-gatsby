// noinspection JSVoidFunctionReturnValueUsed
import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { CreateSubscription } from "./CreateSubscription";
import { orderFixtures } from "../../domain/orders/testing/OrderFixtures";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { PaymentService } from "../../domain/payment/PaymentService";
import { stripePlansFixtures } from "../../domain/payment/testing/StripePlansFixtures";
import { Cart } from "../../domain/orders/Cart";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

describe("CreateOrder should", () => {
  it("create a subscription for a card payment", async () => {
    const aSubscriptionRequest = {
      country: anOrderWithSubscription.shipping.country,
      couponCode: undefined,
      paymentMethod: anOrderWithSubscription.cardToken,
      paymentPlanId: aStripePlan.paymentPlanId,
      postalCode: anOrderWithSubscription.shipping.zip,
      state: anOrderWithSubscription.shipping.state,
    };
    when(cart.getSubscription()).thenReturn("Monthly");
    when(cart.findCouponCode()).thenReturn(undefined);
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscription.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenResolve(aStripePlan);

    await createSubscription().execute(anOrderWithSubscription);

    verify(subscriptionService.createSubscription(deepEqual(aSubscriptionRequest))).called();
  });

  it("create a subscription with a coupon code", async () => {
    const aSubscriptionRequest = {
      country: anOrderWithSubscription.shipping.country,
      couponCode: "someCode",
      paymentMethod: anOrderWithSubscription.cardToken,
      paymentPlanId: aStripePlan.paymentPlanId,
      postalCode: anOrderWithSubscription.shipping.zip,
      state: anOrderWithSubscription.shipping.state,
    };
    when(cart.getSubscription()).thenReturn("Monthly");
    when(cart.findCouponCode()).thenReturn("someCode");
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscription.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenResolve(aStripePlan);

    await createSubscription().execute(anOrderWithSubscription);

    verify(subscriptionService.createSubscription(deepEqual(aSubscriptionRequest))).called();
  });

  it("create a subscription for a klarna payment if the cart has a subscription", async () => {
    const aSubscriptionRequest = {
      country: anOrderWithSubscriptionWithKlarna.shipping.country,
      couponCode: undefined,
      source: anOrderWithSubscriptionWithKlarna.cardToken,
      paymentPlanId: aStripePlan.paymentPlanId,
      postalCode: anOrderWithSubscriptionWithKlarna.shipping.zip,
      state: anOrderWithSubscriptionWithKlarna.shipping.state,
    };
    when(cart.getSubscription()).thenReturn("Yearly");
    when(cart.findCouponCode()).thenReturn(undefined);
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscriptionWithKlarna.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenResolve(aStripePlan);

    await createSubscription().execute(anOrderWithSubscriptionWithKlarna);

    verify(subscriptionService.subscribeWithKlarna(deepEqual(aSubscriptionRequest))).called();
  });

  it("throw a Not Expected Error when getting fails", async () => {
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscriptionWithKlarna.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenThrow(new Error("an Error"));

    await expectThrows(async () => {
      await createSubscription().execute(anOrderWithSubscription);
    }, NotExpectedError);
  });

  it("throw a Not Expected Error when subscribing fails", async () => {
    const aSubscriptionRequest = {
      country: anOrderWithSubscription.shipping.country,
      couponCode: undefined,
      paymentMethod: anOrderWithSubscription.cardToken,
      paymentPlanId: aStripePlan.paymentPlanId,
      postalCode: anOrderWithSubscription.shipping.zip,
      state: anOrderWithSubscription.shipping.state,
    };
    when(cart.getSubscription()).thenReturn("Monthly");
    when(cart.findCouponCode()).thenReturn(undefined);
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscription.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenResolve(aStripePlan);
    when(subscriptionService.createSubscription(deepEqual(aSubscriptionRequest))).thenThrow(new Error("an Error"));

    await expectThrows(async () => {
      await createSubscription().execute(anOrderWithSubscription);
    }, NotExpectedError);
  });

  it("throw a Not Expected Error when subscribing a klarna subscription fails", async () => {
    const aSubscriptionRequest = {
      country: anOrderWithSubscriptionWithKlarna.shipping.country,
      couponCode: undefined,
      source: anOrderWithSubscriptionWithKlarna.cardToken,
      paymentPlanId: aStripePlan.paymentPlanId,
      postalCode: anOrderWithSubscriptionWithKlarna.shipping.zip,
      state: anOrderWithSubscriptionWithKlarna.shipping.state,
    };
    when(cart.getSubscription()).thenReturn("Yearly");
    when(cart.findCouponCode()).thenReturn(undefined);
    when(
      paymentService.getPaymentPlanFromStripePlanId(
        anOrderWithSubscriptionWithKlarna.items[0].product.options[0].values[0].paymentPlanId
      )
    ).thenResolve(aStripePlan);
    when(subscriptionService.subscribeWithKlarna(deepEqual(aSubscriptionRequest))).thenThrow(new Error("an Error"));

    await expectThrows(async () => {
      await createSubscription().execute(anOrderWithSubscriptionWithKlarna);
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = mock<Cart>();
    paymentService = mock<PaymentService>();
    subscriptionService = mock<SubscriptionService>();
  });

  function createSubscription(): CreateSubscription {
    return new CreateSubscription(instance(cart), instance(paymentService), instance(subscriptionService));
  }

  let cart: Cart;
  let paymentService: PaymentService;
  let subscriptionService: SubscriptionService;
  const anOrderWithSubscription = orderFixtures.anOrderWithSubscription;
  const anOrderWithSubscriptionWithKlarna: any = orderFixtures.anOrderWithSubscriptionWithKlarna;
  const aStripePlan = stripePlansFixtures.aStripePlan;
});

import { anything, capture, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { EmailAlreadyRegisteredError } from "../../core/domain/auth/EmailAlreadyRegisteredError";
import { Discount } from "../../core/domain/orders/EcommerceCart";
import { NotExpectedError } from "../../core/domain/orders/NotExpectedError";
import { CartBuilder } from "../../core/domain/orders/testing/CartBuilder";
import { cartUpdateRequestsFixtures } from "../../core/domain/orders/testing/CartUpdateRequestsFixtures";
import { checkoutFormFixtures } from "../../core/domain/orders/testing/CheckoutFormFixtures";
import { ecommerceCartFixtures } from "../../core/domain/orders/testing/EcommerceCartFixtures";
import { ecommerceCartItemFixtures } from "../../core/domain/orders/testing/EcommerceCartItemFixtures";
import { orderFixtures } from "../../core/domain/orders/testing/OrderFixtures";
import { shippingFixtures } from "../../core/domain/orders/testing/ShippingFixtures";
import { klarnaSessionFixtures } from "../../core/domain/payment/testing/KlarnaSessionFixtures";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";
import { userFixtures } from "../../core/domain/user/testing/UserFixtures";
import { CreateCardPayment } from "../../core/useCases/CreateCardPayment/CreateCardPayment";
import { CreateKlarnaSession } from "../../core/useCases/CreateKlarnaToken/CreateKlarnaSession";
import { CreateOrder } from "../../core/useCases/CreateOrder/CreateOrder";
import { FindCountryByCode } from "../../core/useCases/FindCountryByCode/FindCountryByCode";
import { GetAllStatesByCountry } from "../../core/useCases/GetAllStatesByCountry/GetAllStatesByCountry";
import { GetCart } from "../../core/useCases/GetCart/GetCart";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetShippingOptions } from "../../core/useCases/GetShippingServices/GetShippingOptions";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { GetUserSubscriptionInfo } from "../../core/useCases/GetUserSubscriptionInfo/GetUserSubscriptionInfo";
import { LogIn } from "../../core/useCases/LogIn/LogIn";
import { UpdateCartSubscriptionPlan } from "../../core/useCases/ReplaceMonthlySubscriptionForAnnual/UpdateCartSubscriptionPlan";
import { TrackAnalyticsCheckoutStarted } from "../../core/useCases/TrackAnalytics/CheckoutStarted/TrackAnalyticsCheckoutStarted";
import { TrackAnalyticsPaymentInfoEntered } from "../../core/useCases/TrackAnalytics/PaymentInfoEntered/TrackAnalyticsPaymentInfoEntered";
import { TrackAnalyticsShipmentInfoEntered } from "../../core/useCases/TrackAnalytics/ShipmentInfoEntered/TrackAnalyticsShipmentInfoEntered";
import { UpdateCart } from "../../core/useCases/UpdateCart/UpdateCart";
import { UpdateLocale } from "../../core/useCases/UpdateLocale/UpdateLocale";
import { CheckoutPresenter, CheckoutView } from "./CheckoutPresenter";

describe("CheckoutPresenter should", () => {
  it("track checkout started on start", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.start();

    verify(view.showLoader()).called();
    verify(trackAnalyticsCheckoutStarted.execute()).called();
    verify(view.hideLoader()).called();
  });

  it("show loader before fetching the user on start", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    verify(view.showLoader()).calledBefore(getUser.execute());
  });

  it("set Klarna Total Price on start", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());
    verify(view.setKlarnaTotalPrice(anything())).called();
  });

  it("update total price on start", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());
    verify(view.updateTotalPrice(anything())).called();
  });

  it("update subscription plan on start", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(
      new CartBuilder().withItem(aCartItemWithYearlySubscription).withHasSubscription(true).build()
    );
  });

  it("hide account form on start if the cart do not has a subscription package or do not has a subscription", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());
    verify(view.setAccountFormVisible(false)).called();
  });

  it("do not hide account form on start if the cart has a subscription package and a subscription", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withHasSubscription(true).withHasSubscriptionPackage(true).build());
    verify(view.setAccountFormVisible(true)).called();
  });

  it("clear selected shipping option on start", async () => {
    await initializeCartWithRower();

    verify(updateCart.execute(anything())).twice();
  });

  it("update shipping options on start", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());
    verify(view.updateShippingOptions(anything())).called();
  });

  it("hide klarna payment method on start if we are in prod and the cart do not have rower item", async () => {
    process.env.GATSBY_ENVIRONMENT_KEY = "prod";
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());
    verify(view.hideKlarnaPaymentMethod()).called();
  });

  it("do not hide klarna payment method on start if we are in staging and the cart has a rower item", async () => {
    process.env.GATSBY_ENVIRONMENT_KEY = "staging";
    await initializeCartWithRower();

    verify(view.hideKlarnaPaymentMethod()).never();
  });

  it("do not hide klarna payment method on start if we are in prod and the cart has a rower item", async () => {
    process.env.GATSBY_ENVIRONMENT_KEY = "prod";
    await initializeCartWithRower();

    verify(view.hideKlarnaPaymentMethod()).never();
  });

  it("do not hide klarna payment method on start if the cart has total price different than 0", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(25).build());
    verify(view.hideKlarnaPaymentMethod()).never();
  });

  it("hide klarna payment method on start if the cart total price is zero", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(0).build());
    verify(view.hideKlarnaPaymentMethod()).once();
  });

  it("do not hide klarna payment method on start if the cart total price is higher than zero", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(20).build());
    verify(view.hideKlarnaPaymentMethod()).never();
  });

  it("hide account form on start if the user has a session", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getUser.execute()).thenResolve(aUser);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withItem(aCartItemWithMonthlySubscription).build());
    const [onUserUpdateCallback] = capture(getUser.subscribe).last();
    onUserUpdateCallback(aUser);

    verify(view.setAccountFormVisible(false)).twice();
  });

  it("do not hide account if the user doesn't have a session and do not show any error message", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().build());

    verify(view.setAccountFormVisible(false)).called();
    verify(view.showErrorMessage(anything())).never();
  });

  it("show an error message if there is an expected error on the user log in check", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getUser.execute()).thenThrow(new NotExpectedError("anError"));
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    verify(view.setAccountFormVisible(anything())).never();
    verify(view.showErrorMessage("anError")).once();
    verify(view.hideLoader()).once();
  });

  it("show modal if user email already exist in our system", async () => {
    await initializeCartWithRower();
    when(createOrder.execute(anything())).thenThrow(new EmailAlreadyRegisteredError());

    await presenter.submitOrder(aCheckoutFormPayingWithCard);

    verify(view.showLoader()).called();
    verify(view.showUserRegisteredModal()).once();
    verify(view.hideLoader()).called();
  });

  it("hide loader after fetching the shipping options", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    verify(view.hideLoader()).called();
  });

  it("reset credit card input on submit order error if payment method is card", async () => {
    when(createOrder.execute(anything())).thenThrow(aGeneralError);
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.submitOrder(aCheckoutFormPayingWithCard);

    verify(view.resetCardInfo()).called();
  });

  it("show state options on start", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();

    verify(getAllStatesForCountry.execute(anything())).called();
  });

  it("show loader before updating the cart's address", async () => {
    await presenter.onUpdateEmail("someEmail");

    verify(updateCart.execute(deepEqual({ account: { email: "someEmail" } }))).called();
  });

  it("show loader before updating the cart's address", async () => {
    await presenter.onUpdateAddress(anAddress);

    verify(view.showShippingLoader()).calledBefore(updateCart.execute(anything()));
  });

  it("update cart with an address on address update", async () => {
    await presenter.onUpdateAddress(anAddress);

    verify(updateCart.execute(anything())).called();
    const [updateCartRequest] = capture(updateCart.execute).last();
    expect(updateCartRequest).toStrictEqual(aCartUpdateRequestWithAnAddress);
  });

  it("show error message when update cart throws an error", async () => {
    const errorMessage = "This is an error message";
    when(updateCart.execute(anything())).thenThrow(new NotExpectedError(errorMessage));

    await presenter.onUpdateAddress(anAddress);

    verify(view.showErrorMessage(errorMessage)).calledBefore(view.hideShippingLoader());
  });

  it("update shipping options after update cart on address update", async () => {
    await initializeCartWithRower();
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.onUpdateAddress(anAddress);

    verify(getShippingOptions.execute()).calledAfter(updateCart.execute(anything()));
    verify(view.updateShippingOptions(anything())).calledAfter(getShippingOptions.execute());
    const [shippingOptionsVM] = capture(view.updateShippingOptions).last();
    expect(shippingOptionsVM).toStrictEqual([
      { id: "standard", name: "Standard", disabled: false, description: "Some des stand", price: "$75,000" },
      { id: "white", name: "White Glove", disabled: false, description: "Some des white", price: "$195" },
    ]);
  });

  it("show error message when getting shipping options throws an error", async () => {
    await initializeCartWithRower();
    const errorMessage = "This is an error message";
    when(getShippingOptions.execute()).thenThrow(new NotExpectedError(errorMessage));

    await presenter.onUpdateAddress(anAddress);

    verify(view.showErrorMessage(errorMessage)).called();
    verify(view.hideShippingLoader()).called();
  });

  it("show loader before updating the shipping option", async () => {
    await presenter.onUpdateShippingOption(anything());

    verify(view.showShippingLoader()).calledBefore(updateCart.execute(anything()));
  });

  it("update cart with a shipping option on shipping option update", async () => {
    when(updateCart.execute(aCartUpdateRequestWithShippingOption)).thenResolve();

    await presenter.onUpdateShippingOption(aShippingOption);

    verify(updateCart.execute(anything())).called();
    const [updateCartRequest] = capture(updateCart.execute).last();
    expect(updateCartRequest).toStrictEqual(aCartUpdateRequestWithShippingOption);
  });

  it("execute the trackAnalyticsPaymentInfoEntered useCase when a payment info is entered", async () => {
    const aPaymentMethod = "aPaymentMethod";

    await presenter.onPaymentInfoEntered(aPaymentMethod);

    verify(trackAnalyticsPaymentInfoEntered.execute(aPaymentMethod)).called();
  });

  it("execute the trackAnalyticsPaymentInfoEntered useCase when a payment info is entered", async () => {
    const aPaymentMethod = "aPaymentMethod";

    await presenter.onShipmentInfoEntered(aPaymentMethod);

    verify(trackAnalyticsShipmentInfoEntered.execute(aPaymentMethod)).called();
  });

  it(
    "on the payment method change event, show a loader, update subscription plan for a yearly subscription," +
      " hide loader and show upgrade plan message, if paying with klarna and had a monthly subscription on the cart",
    async () => {
      const cartSubscription = { unsubscribe: jest.fn() };
      when(getCart.subscribe(anything())).thenReturn(cartSubscription);
      when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
      when(getShippingOptions.execute()).thenResolve(someShippingOptions);

      await presenter.start();
      const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
      onCartUpdatedCallback(new CartBuilder().withItem(aCartItemWithMonthlySubscription).build());

      await presenter.onPaymentMethodChange("klarna");

      verify(view.showLoader()).called();
      verify(updateCartSubscriptionPlan.execute(anything(), "Yearly", true)).called();
      const [item] = capture(updateCartSubscriptionPlan.execute).last();
      expect(item).toStrictEqual(aCartItemWithMonthlySubscription);
      verify(view.hideLoader()).called();
      verify(view.showUpgradePlanMessage()).called();
    }
  );

  it(
    "on the payment method change event, update subscription plan and not show upgrade plan message," +
      "if paying with klarna and had yearly subscription on the cart",
    async () => {
      const cartSubscription = { unsubscribe: jest.fn() };
      when(getCart.subscribe(anything())).thenReturn(cartSubscription);
      when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
      when(getShippingOptions.execute()).thenResolve(someShippingOptions);

      await presenter.start();
      const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
      onCartUpdatedCallback(
        new CartBuilder().withItem(aCartItemWithYearlySubscription).withHasSubscription(true).build()
      );

      await presenter.onPaymentMethodChange("klarna");

      verify(updateCartSubscriptionPlan.execute(anything(), "Yearly", true)).called();
      verify(view.showUpgradePlanMessage()).never();
    }
  );

  it(
    "on the payment method change event, do not update subscription plan nor hide upgrade plan message," +
      "if paying with card and had yearly subscription on the cart",
    async () => {
      const cartSubscription = { unsubscribe: jest.fn() };
      when(getCart.subscribe(anything())).thenReturn(cartSubscription);
      when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
      when(getShippingOptions.execute()).thenResolve(someShippingOptions);

      await presenter.start();
      const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
      onCartUpdatedCallback(new CartBuilder().withItem(aCartItemWithYearlySubscription).build());

      await presenter.onPaymentMethodChange("card");

      verify(updateCartSubscriptionPlan.execute(anything(), anything())).never();
      verify(view.hideUpgradePlanMessage()).never();
    }
  );

  it("update subscription with a monthly plan paying with card, if the user already had a monthly plan and when he selected klarna the plan changed to yearly", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    let [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withItem(aCartItemWithMonthlySubscription).build());
    await presenter.onPaymentMethodChange("klarna");
    [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withItem(aCartItemWithYearlySubscription).build());

    await presenter.onPaymentMethodChange("card");

    verify(view.showLoader()).called();
    verify(updateCartSubscriptionPlan.execute(anything(), "Monthly", undefined)).called();
    const [item] = capture(updateCartSubscriptionPlan.execute).last();
    expect(item).toStrictEqual(aCartItemWithYearlySubscription);
    verify(view.hideLoader()).called();
    verify(view.hideUpgradePlanMessage()).called();
  });

  it("create klarna session and show the widget on checkout if paying with klarna", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    const aCoupon: Discount = {
      type: "coupon",
      rule: {
        type: "product",
        valueType: "percent",
        valuePercent: 10,
        productId: "60e46350891e56737fba4e8f"
      },
      amount: 5.5,
    };
    const aPromotion: Discount = {
      type: "promo-test",
      rule: {
        type: "shipment",
        valueType: "percent",
        valuePercent: 100,
      },
      amount: 7.5,
    };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(
      new CartBuilder()
        .withTotalPrice(40.1)
        .withShippingPrice(7.5)
        .withItem(anItem)
        .withDiscountsList([aCoupon, aPromotion])
        .withTax(5.6)
        .build()
    );
    when(createKlarnaSession.execute(anything())).thenResolve(aKlarnaSession);
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.checkout(aCheckoutFormPayingWithKlarna);

    verify(view.showLoader()).called();
    verify(createKlarnaSession.execute(deepEqual(aKlarnaSessionRequestWithDiscountsAndTaxes))).calledAfter(
      view.showLoader()
    );
    verify(view.showKlarnaWidget(deepEqual(aKlarnaSession))).called();
  });

  it("show an error message on the view when an error is thrown on the create klarna session use case when paying with klarna", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());
    when(createKlarnaSession.execute(anything())).thenThrow(aGeneralError);
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.checkout(aCheckoutFormPayingWithKlarna);

    verify(view.showErrorMessage(anything())).called();
    const [errorMessage] = capture(view.showErrorMessage).last();
    expect(errorMessage).toBe(aGeneralError.message);
    verify(view.hideLoader()).twice();
  });

  it("create order on checkout if paying with card", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());
    const aCreateCardPaymentRequest = {
      amount: `${9901}`,
      currency: "usd",
      paymentMethod: aCheckoutFormPayingWithCard.card.token,
    };
    when(createCardPayment.execute(anything())).thenResolve("aPaymentIntent");
    when(createOrder.execute(anNotLoggedInOrderPayingWithCardRequest)).thenResolve();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.checkout(aCheckoutFormPayingWithCard);

    verify(view.showLoader()).called();
    verify(createCardPayment.execute(deepEqual(aCreateCardPaymentRequest))).called();
    verify(createOrder.execute(deepEqual(anNotLoggedInOrderPayingWithCardRequest))).calledAfter(view.showLoader());
    const [request] = capture(createOrder.execute).last();
    expect(request).toStrictEqual(anNotLoggedInOrderPayingWithCardRequest);
    verify(view.showSuccessMessage("Order placed successfully!")).calledAfter(createOrder.execute(anything()));
    verify(view.hideLoader()).twice();
  });

  it("create order on checkout without sending the payment intent if buying a cart with total price zero", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(0).withItem(aSubscriptionItem).build());
    when(createOrder.execute(anOrderRequestWithCardAndAmount0)).thenResolve();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();

    await presenter.checkout(aCheckoutFormPayingWithCard);

    verify(createCardPayment.execute(anything())).never();
    verify(createOrder.execute(anything())).called();
    const [orderRequestGeneratedFromCheckoutForm] = capture(createOrder.execute).last();
    expect(orderRequestGeneratedFromCheckoutForm).toStrictEqual(anOrderRequestWithCardAndAmount0);
    verify(view.showSuccessMessage("Order placed successfully!")).calledAfter(createOrder.execute(anything()));
    verify(view.hideLoader()).twice();
  });

  it("create order on checkout not sending the user email and password if the user is logged in", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getUser.execute()).thenResolve(aUser);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());
    when(createCardPayment.execute(anything())).thenResolve("aPaymentIntent");
    when(createOrder.execute(anLoggedInOrderRequest)).thenResolve();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();
    when(getUserSubscriptionInfo.execute()).thenResolve(aSubscriptionInfo);

    await presenter.checkout(aCheckoutFormPayingWithCardWithUserLoggedIn);

    verify(view.showLoader()).called();
    verify(createOrder.execute(anything())).called();
    const [orderRequestGeneratedFromCheckoutForm] = capture(createOrder.execute).last();
    expect(orderRequestGeneratedFromCheckoutForm).toStrictEqual(anLoggedInOrderRequest);
    verify(view.showSuccessMessage("Order placed successfully!")).calledAfter(createOrder.execute(anything()));
    verify(view.hideLoader()).twice();
  });

  it("show an error message on the view when an error is thrown on the create order use case when paying with card", async () => {
    when(createOrder.execute(anything())).thenThrow(aGeneralError);
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();
    await initializeCartWithSubscription();

    await presenter.checkout(aCheckoutFormPayingWithCard);

    verify(view.showErrorMessage(anything())).called();
    const [errorMessage] = capture(view.showErrorMessage).last();
    expect(errorMessage).toBe(aGeneralError.message);
    verify(view.hideLoader()).called();
  });

  it("show an error if user has a non canceled subscription and tries to buy another one", async () => {
    when(getUser.execute()).thenResolve(aUser);
    await initializeCartWithSubscription();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();
    when(getUserSubscriptionInfo.execute()).thenResolve(aSubscriptionInfo);

    await presenter.checkout(aCheckoutFormPayingWithCard);

    verify(getUserSubscriptionInfo.execute()).called();
    verify(view.setIsSubscriptionPurchaseNotAllowed(true)).called();
  });

  it("not show an error if user has a canceled subscription and tries to buy another one", async () => {
    when(getUser.execute()).thenResolve(aUser);
    await initializeCartWithSubscription();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();
    when(getUserSubscriptionInfo.execute()).thenResolve({ ...aSubscriptionInfo, status: "canceled" });

    await presenter.checkout(aCheckoutFormPayingWithCard);

    verify(getUserSubscriptionInfo.execute()).called();
    verify(view.setIsSubscriptionPurchaseNotAllowed(true)).never();
  });

  it("create order on submit order", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());

    when(createOrder.execute(anOrderRequestWithKlarna)).thenResolve();

    await presenter.submitOrder(aCheckoutFormPayingWithKlarna);

    verify(view.showLoader()).twice();
    verify(createOrder.execute(anything())).called();
    const [orderRequestGeneratedFromCheckoutForm] = capture(createOrder.execute).last();
    expect(orderRequestGeneratedFromCheckoutForm).toStrictEqual(anOrderRequestWithKlarna);
    verify(view.showSuccessMessage("Order placed successfully!")).calledAfter(createOrder.execute(anything()));
    verify(view.hideLoader()).twice();
  });

  it("log in new user on submit order", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());

    when(createOrder.execute(anOrderRequestWithKlarna)).thenResolve();

    await presenter.submitOrder(aCheckoutFormPayingWithKlarna);

    verify(logIn.execute(anything(), anything())).called();
  });

  it("redirect to specific checkout confirmation page after order is processed", async () => {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);

    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    onCartUpdatedCallback(new CartBuilder().withTotalPrice(aTotalPrice).withItem(anItem).build());

    when(createOrder.execute(anOrderRequestWithKlarna)).thenResolve();

    await presenter.submitOrder(aCheckoutFormPayingWithKlarna);

    verify(view.showLoader()).twice();
    verify(createOrder.execute(anything())).called();
    verify(view.navigateToNewPath(anything(), anything())).calledAfter(
      view.showSuccessMessage("Order placed successfully!")
    );
    verify(view.hideLoader()).twice();
  });

  beforeEach(() => {
    process.env.GATSBY_ENVIRONMENT_KEY = "staging";
    view = mock<CheckoutView>();
    createKlarnaSession = mock<CreateKlarnaSession>();
    createOrder = mock<CreateOrder>();
    findCountryByCode = mock<FindCountryByCode>();
    getAllStatesForCountry = mock<GetAllStatesByCountry>();
    getCart = mock<GetCart>();
    getLocalizationCode = mock<GetLocalizationCode>();
    getShippingOptions = mock<GetShippingOptions>();
    getUser = mock<GetUser>();
    logIn = mock<LogIn>();
    getUserSubscriptionInfo = mock<GetUserSubscriptionInfo>();
    createCardPayment = mock<CreateCardPayment>();
    trackAnalyticsCheckoutStarted = mock<TrackAnalyticsCheckoutStarted>();
    trackAnalyticsPaymentInfoEntered = mock<TrackAnalyticsPaymentInfoEntered>();
    trackAnalyticsShipmentInfoEntered = mock<TrackAnalyticsShipmentInfoEntered>();
    updateCart = mock<UpdateCart>();
    updateLocale = mock<UpdateLocale>();
    updateCartSubscriptionPlan = mock<UpdateCartSubscriptionPlan>();
    presenter = createPresenter();
    when(trackAnalyticsCheckoutStarted.execute()).thenResolve();
  });

  function createPresenter(): CheckoutPresenter {
    return new CheckoutPresenter(
      instance(view),
      instance(createCardPayment),
      instance(createKlarnaSession),
      instance(createOrder),
      instance(findCountryByCode),
      instance(getAllStatesForCountry),
      instance(getCart),
      instance(getLocalizationCode),
      instance(getShippingOptions),
      instance(getUser),
      instance(getUserSubscriptionInfo),
      instance(logIn),
      instance(trackAnalyticsCheckoutStarted),
      instance(trackAnalyticsPaymentInfoEntered),
      instance(trackAnalyticsShipmentInfoEntered),
      instance(updateCart),
      instance(updateLocale),
      instance(updateCartSubscriptionPlan)
    );
  }

  async function initializeCartWithRower() {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(findCountryByCode.execute(aLocalizationCode)).thenResolve(anything());
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    const cart = new CartBuilder()
      .withItem({
        name: "Max Rower",
        price: 1000,
        id: "test1",
        productId: "test1",
        slug: "test1",
        quantity: 1,
        options: [],
        discount: 0,
        bundleItems: [],
        isSubscription: false,
        hasSubscriptionPackage: true,
        shippingOptions: ["Standard", "White Glove"],
      })
      .withTotalPrice(1495)
      .build();
    onCartUpdatedCallback(cart.update(cart));
  }

  async function initializeCartWithSubscription() {
    const cartSubscription = { unsubscribe: jest.fn() };
    when(getCart.subscribe(anything())).thenReturn(cartSubscription);
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);
    when(findCountryByCode.execute(aLocalizationCode)).thenResolve(anything());
    when(getShippingOptions.execute()).thenResolve(someShippingOptions);
    await presenter.start();
    const [onCartUpdatedCallback] = capture(getCart.subscribe).last();
    const cart = new CartBuilder()
      .withItem({
        name: "Monthly subscription",
        price: 0,
        id: "test1",
        productId: "test1",
        slug: "test1",
        quantity: 1,
        options: [],
        discount: 0,
        bundleItems: [],
        isSubscription: true,
        hasSubscriptionPackage: false,
      })
      .build();

    onCartUpdatedCallback(cart.update(cart));
  }

  let view: CheckoutView;
  let presenter: CheckoutPresenter;
  let createKlarnaSession: CreateKlarnaSession;
  let createOrder: CreateOrder;
  let findCountryByCode: FindCountryByCode;
  let getAllStatesForCountry: GetAllStatesByCountry;
  let getCart: GetCart;
  let getLocalizationCode: GetLocalizationCode;
  let getShippingOptions: GetShippingOptions;
  let getUser: GetUser;
  let logIn: LogIn;
  let getUserSubscriptionInfo: GetUserSubscriptionInfo;
  let createCardPayment: CreateCardPayment;
  let trackAnalyticsCheckoutStarted: TrackAnalyticsCheckoutStarted;
  let trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered;
  let trackAnalyticsShipmentInfoEntered: TrackAnalyticsShipmentInfoEntered;
  let updateCart: UpdateCart;
  let updateLocale: UpdateLocale;
  let updateCartSubscriptionPlan: UpdateCartSubscriptionPlan;
  const aCartItemWithMonthlySubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription.items[0];
  const aCartItemWithYearlySubscription = ecommerceCartFixtures.anEcommerceCartWithYearlySubscription.items[0];
  const aCartUpdateRequestWithAnAddress = cartUpdateRequestsFixtures.aCartUpdateRequestWithAnAddress;
  const aCartUpdateRequestWithShippingOption = cartUpdateRequestsFixtures.aCartUpdateRequestWithShippingOption;
  const aCheckoutFormPayingWithCard = checkoutFormFixtures.aCheckoutFormPayingWithCard;
  const aCheckoutFormPayingWithCardWithUserLoggedIn = checkoutFormFixtures.aCheckoutFormPayingWithCardWithUserLoggedIn;
  const aCheckoutFormPayingWithKlarna = checkoutFormFixtures.aCheckoutFormPayingWithKlarna;
  const aGeneralError = new NotExpectedError("This is a general Error");
  const aKlarnaSessionRequest = klarnaSessionFixtures.aKlarnaSessionRequest;
  const aKlarnaSessionRequestWithDiscountsAndTaxes = klarnaSessionFixtures.aKlarnaSessionRequestWithDiscountsAndTaxes;
  const aKlarnaSession = klarnaSessionFixtures.aKlarnaSession;
  const aLocalizationCode = shippingFixtures.aLocalizationCode;
  const aSubscriptionInfo = {
    id: "anId",
    name: "x",
    purchaseDate: "x",
    pricing: "x",
    status: "active",
    active: true,
    planType: "x",
    transactionHistory: [],
    klarna: false,
    paymentInfo: { number: "aCreditCardNumber", klarna: false },
  };
  const aShippingOption = shippingFixtures.aShippingOption;
  const aTotalPrice = 99.01;
  const aUser = userFixtures.aUser;
  const anAddress = cartUpdateRequestsFixtures.aCartAddress;
  const anItem = {
    id: "61897fd97c62f941f81c5032",
    productId: "abcd",
    slug: "abcd",
    name: aKlarnaSessionRequest.items[0].description,
    options: [],
    price: 25,
    discount: 5,
    quantity: aKlarnaSessionRequest.items[0].quantity,
    bundleItems: [],
    isSubscription: false,
    hasSubscriptionPackage: false,
  };
  const aSubscriptionItem = ecommerceCartItemFixtures.aMonthlySubscriptionItem;
  const anNotLoggedInOrderPayingWithCardRequest = {
    ...orderFixtures.anOrderRequestWithCardAndAmount4000,
    amount: 9901,
  };
  const anOrderRequestWithCardAndAmount0 = orderFixtures.anOrderRequestWithCardAndAmount0;
  const anLoggedInOrderRequest = { ...orderFixtures.anOrderRequestLoggedInWithCardAndAmount4000, amount: 9901 };
  const anOrderRequestWithKlarna = { ...orderFixtures.anOrderRequestWithKlarnaWithAmount4000, amount: 9901 };
  const someShippingOptions = shippingFixtures.someShippingOptions;
});

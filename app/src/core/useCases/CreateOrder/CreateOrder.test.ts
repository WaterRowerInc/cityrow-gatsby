import { DeleteUser } from "../DeleteUser/DeleteUser";
import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { OrderService } from "../../domain/orders/OrderService";
import { CreateOrder } from "./CreateOrder";
import { CartService } from "../../domain/orders/CartService";
import { orderFixtures } from "../../domain/orders/testing/OrderFixtures";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";
import { TrackAnalyticsOrderCompleted } from "../TrackAnalytics/OrderCompleted/TrackAnalyticsOrderCompleted";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { ecommerceCartItemFixtures } from "../../domain/orders/testing/EcommerceCartItemFixtures";
import { RegisterUser } from "../RegisterUser/RegisterUser";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { EmailAlreadyRegisteredError } from "../../domain/auth/EmailAlreadyRegisteredError";
import { CreateSubscription } from "../CreateSubscription/CreateSubscription";
import { TrackAnalyticsUserConverted } from "../TrackAnalytics/UserConverted/TrackAnalyticsUserConverted";

describe("CreateOrder should", () => {
  it("update the ecommerce cart, the cart and create the order", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());

    await createOrder().execute(anOrderRequestWithCard);

    verify(cartService.updateCart(anOrderRequestWithCard)).called();
    verify(cart.update(anEcommerceCart)).called();
    verify(orderService.createOrder()).called();
  });

  it("register a new user if user don't have session and we have a subscription in the cart", async () => {
    const aUserFromOrderRequest = {
      email: anOrderRequestWithCard!.account!.email,
      firstName: anOrderRequestWithCard?.firstName!,
      lastName: anOrderRequestWithCard?.lastName!,
      password: anOrderRequestWithCard?.account!.password,
    };
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCartWithASubscription);
    when(cart.update(anEcommerceCartWithASubscription)).thenReturn(
      new CartBuilder().withItem(aSubscriptionItem).build()
    );
    when(cart.getSubscription()).thenReturn("Monthly");
    when(orderService.createOrder()).thenResolve(anOrderWithSubscription);
    when(sessionStorage.hasSession()).thenResolve(false);
    when(registerUser.execute(deepEqual(aUserFromOrderRequest))).thenResolve();

    await createOrder().execute(anOrderRequestWithCard);

    verify(registerUser.execute(deepEqual(aUserFromOrderRequest))).called();
  });

  it("not subscribe a user if the cart doesn't have a subscription", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());

    await createOrder().execute(anOrderRequestWithCard);

    verify(orderService.createOrder()).once();
    verify(createSubscription.execute(anything())).never();
  });

  it("create a subscription for a card payment if the cart has a subscription", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCartWithASubscription);
    when(cart.update(anEcommerceCartWithASubscription)).thenReturn(
      new CartBuilder().withItem(aSubscriptionItem).build()
    );
    when(cart.getSubscription()).thenReturn("Monthly");
    when(orderService.createOrder()).thenResolve(anOrderWithSubscription);

    await createOrder().execute(anOrderRequestWithCard);

    verify(createSubscription.execute(deepEqual(anOrderWithSubscription))).called();
  });

  it("track the Order Completed Event after creating the order", async () => {
    const someTraits = {
      city: anOrderRequestWithCard.city,
      coupon: "aCouponCode",
      created_method: "Checkout",
      currency: "USD",
      email: anOrderRequestWithCard.account?.email,
      first_name: anOrderRequestWithCard.firstName,
      last_name: anOrderRequestWithCard.lastName,
      state: anOrderRequestWithCard.state,
      street: anOrderRequestWithCard.address,
      total_revenue: 250 - 50 - 75.1,
    };
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(
      new CartBuilder()
        .withCouponCode("aCouponCode")
        .withShippingPrice(75.095988456)
        .withTotalPrice(250)
        .withDiscounts(50)
        .build()
    );
    when(cart.couponCode).thenReturn("aCouponCode");
    when(cart.totalPrice).thenReturn(250);
    when(cart.discounts).thenReturn(50);
    when(cart.shippingPrice).thenReturn(75.1);
    when(orderService.createOrder()).thenResolve(anOrder);

    await createOrder().execute(anOrderRequestWithCard);

    verify(orderService.createOrder()).once();
    verify(identifyAnalyticsUser.execute(deepEqual(someTraits))).once();
    verify(trackAnalyticsOrderCompleted.execute(deepEqual(anOrder))).once();
  });

  it("track the User Converted Event if the cart had a subscription", async () => {
    when(cart.hasSubscription).thenReturn(true);

    await createOrder().execute(anOrderRequestWithCard);

    verify(trackAnalyticsUserConverted.execute()).once();
  });

  it("track the User Converted Event if the cart had a subscription package", async () => {
    when(cart.hasSubscriptionPackage).thenReturn(true);

    await createOrder().execute(anOrderRequestWithCard);

    verify(trackAnalyticsUserConverted.execute()).once();
  });

  it("track the User Converted Event if the cart does not have a subscription package nor a subscription", async () => {
    when(cart.hasSubscription).thenReturn(false);
    when(cart.hasSubscriptionPackage).thenReturn(false);

    await createOrder().execute(anOrderRequestWithCard);

    verify(trackAnalyticsUserConverted.execute()).never();
  });

  it("reset the cart after creating the order", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());

    await createOrder().execute(anOrderRequestWithCard);

    verify(orderService.createOrder()).once();
    // noinspection JSVoidFunctionReturnValueUsed
    verify(cart.reset()).once();
  });

  it("throw a Not Expected Error when updating the cart fails", async () => {
    when(cartService.updateCart(anything())).thenThrow(new NotExpectedError("an Error"));

    await expectThrows(async () => {
      await createOrder().execute(anOrderRequestWithCard);
    }, NotExpectedError);
  });

  it("throw a Not Expected Error when creating the order fails", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());
    when(orderService.createOrder()).thenThrow(new NotExpectedError("an Error"));

    await expectThrows(async () => {
      await createOrder().execute(anOrderRequestWithCard);
    }, NotExpectedError);
  });

  it("throw a Not Expected Error when registering the user fails by validation", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCartWithASubscription);
    when(cart.update(anEcommerceCartWithASubscription)).thenReturn(
      new CartBuilder().withItem(aSubscriptionItem).build()
    );
    when(cart.getSubscription()).thenReturn("Monthly");
    when(orderService.createOrder()).thenResolve(anOrderWithSubscription);
    when(sessionStorage.hasSession()).thenResolve(false);
    when(registerUser.execute(anything())).thenThrow(new EmailAlreadyRegisteredError());

    await expectThrows(async () => {
      await createOrder().execute(anOrderRequestWithCard);
    }, EmailAlreadyRegisteredError);
  });

  it("throw a Not Expected Error when registering the user fails", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCartWithASubscription);
    when(cart.update(anEcommerceCartWithASubscription)).thenReturn(
      new CartBuilder().withItem(aSubscriptionItem).build()
    );
    when(cart.getSubscription()).thenReturn("Monthly");
    when(orderService.createOrder()).thenResolve(anOrderWithSubscription);
    when(sessionStorage.hasSession()).thenResolve(false);
    when(registerUser.execute(anything())).thenThrow(new NotExpectedError("an Error"));

    await expectThrows(async () => {
      await createOrder().execute(anOrderRequestWithCard);
    }, NotExpectedError);
  });

  it("throw a Not Expected Error when creating the subscription fails", async () => {
    when(cartService.updateCart(anOrderRequestWithCard)).thenResolve(anEcommerceCartWithASubscription);
    when(cart.update(anEcommerceCartWithASubscription)).thenReturn(
      new CartBuilder().withItem(aSubscriptionItem).build()
    );
    when(cart.getSubscription()).thenReturn("Monthly");
    when(orderService.createOrder()).thenResolve(anOrderWithSubscription);
    when(createSubscription.execute(anything())).thenThrow(new NotExpectedError("an Error"));

    await expectThrows(async () => {
      await createOrder().execute(anOrderRequestWithCard);
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = mock<Cart>();
    cartService = mock<CartService>();
    createSubscription = mock<CreateSubscription>();
    deleteUser = mock<DeleteUser>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    orderService = mock<OrderService>();
    registerUser = mock<RegisterUser>();
    sessionStorage = mock<SessionStorage>();
    trackAnalyticsOrderCompleted = mock<TrackAnalyticsOrderCompleted>();
    trackAnalyticsUserConverted = mock<TrackAnalyticsUserConverted>();
  });

  function createOrder(): CreateOrder {
    return new CreateOrder(
      instance(cart),
      instance(cartService),
      instance(createSubscription),
      instance(deleteUser),
      instance(identifyAnalyticsUser),
      instance(orderService),
      instance(registerUser),
      instance(sessionStorage),
      instance(trackAnalyticsOrderCompleted),
      instance(trackAnalyticsUserConverted)
    );
  }

  let cart: Cart;
  let cartService: CartService;
  let createSubscription: CreateSubscription;
  let deleteUser: DeleteUser;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  let orderService: OrderService;
  let registerUser: RegisterUser;
  let sessionStorage: SessionStorage;
  let trackAnalyticsOrderCompleted: TrackAnalyticsOrderCompleted;
  let trackAnalyticsUserConverted: TrackAnalyticsUserConverted;
  const anOrderRequestWithCard = orderFixtures.anOrderRequestWithCardAndAmount4000;
  const anOrder = orderFixtures.anOrder;
  const anOrderWithSubscription: any = orderFixtures.anOrderWithSubscription;
  const aSubscriptionItem = ecommerceCartItemFixtures.aMonthlySubscriptionItem;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
  const anEcommerceCartWithASubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription;
});

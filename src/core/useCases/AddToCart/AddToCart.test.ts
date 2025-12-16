import { CartService } from "../../domain/orders/CartService";
import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { Cart } from "../../domain/orders/Cart";
import { AddToCart } from "./AddToCart";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { itemFixtures } from "../../domain/orders/testing/ItemFixtures";
import { CannotAddTwoSubscriptionPackagesError } from "../../domain/subscriptions/CannotAddTwoSubscriptionPackagesError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { ecommerceCartItemFixtures } from "../../domain/orders/testing/EcommerceCartItemFixtures";
import { TwoActiveSubscriptionsError } from "../../domain/subscriptions/TwoActiveSubscriptionsError";
import { AlreadyHaveActiveSubscriptionError } from "../../domain/subscriptions/AlreadyHaveActiveSubscriptionError";

describe("AddToCart should", () => {
  it("add to cart items with subscription package", async () => {
    const itemsWithSubscriptionPackage = [itemFixtures.aSubscriptionPackageItem];
    when(cartService.addToCart(itemsWithSubscriptionPackage)).thenResolve(anEcommerceCartWithAMaxRower);

    await addToCart().execute(itemsWithSubscriptionPackage);

    verify(cartService.addToCart(deepEqual(itemsWithSubscriptionPackage))).once();
    expect(cart.items).toStrictEqual([aMaxRowerItem]);
  });

  it("not add to cart items with subscription package if there are a subscription package already in the cart", async () => {
    const itemsWithSubscriptionPackage = [itemFixtures.aSubscriptionPackageItem];
    cart.hasSubscriptionPackage = true;

    await expectThrows(async () => {
      await addToCart().execute(itemsWithSubscriptionPackage);
    }, CannotAddTwoSubscriptionPackagesError);
  });

  it("add to cart a subscription item", async () => {
    const itemsWithSubscription = [itemFixtures.aSubscriptionItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = false;
    when(sessionStorage.hasSession()).thenResolve(false);
    when(cartService.addToCart(itemsWithSubscription)).thenResolve(anEcommerceCartWithASubscription);

    await addToCart().execute(itemsWithSubscription);

    verify(cartService.addToCart(deepEqual(itemsWithSubscription))).once();
    expect(cart.items).toStrictEqual([aSubscriptionCartItem]);
  });

  it("not add to cart a subscription item if the cart has a subscription already", async () => {
    const itemsWithSubscription = [itemFixtures.aSubscriptionItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = true;

    await expectThrows(async () => {
      await addToCart().execute(itemsWithSubscription);
    }, TwoActiveSubscriptionsError);
  });

  it("add to cart a subscription item with a logged in user with no subscription status", async () => {
    const itemsWithSubscription = [itemFixtures.aSubscriptionItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = false;
    when(sessionStorage.hasSession()).thenResolve(true);
    when(subscriptionService.getSubscriptionStatus()).thenResolve(null);
    when(cartService.addToCart(itemsWithSubscription)).thenResolve(anEcommerceCartWithASubscription);

    await addToCart().execute(itemsWithSubscription);

    verify(cartService.addToCart(deepEqual(itemsWithSubscription))).once();
    expect(cart.items).toStrictEqual([aSubscriptionCartItem]);
  });

  it("add to cart a subscription item with a logged in user with a canceled subscription status", async () => {
    const itemsWithSubscription = [itemFixtures.aSubscriptionItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = false;
    when(sessionStorage.hasSession()).thenResolve(true);
    when(subscriptionService.getSubscriptionStatus()).thenResolve("canceled");
    when(cartService.addToCart(itemsWithSubscription)).thenResolve(anEcommerceCartWithASubscription);

    await addToCart().execute(itemsWithSubscription);

    verify(cartService.addToCart(deepEqual(itemsWithSubscription))).once();
    expect(cart.items).toStrictEqual([aSubscriptionCartItem]);
  });

  it("not add to cart a subscription item with a logged in user with a non canceled subscription", async () => {
    const itemsWithSubscription = [itemFixtures.aSubscriptionItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = false;
    when(sessionStorage.hasSession()).thenResolve(true);
    when(subscriptionService.getSubscriptionStatus()).thenResolve("active");

    await expectThrows(async () => {
      await addToCart().execute(itemsWithSubscription);
    }, AlreadyHaveActiveSubscriptionError);
  });

  it("add to cart a any non subscription or subscription package item", async () => {
    const items = [itemFixtures.anItem];
    cart.hasSubscriptionPackage = false;
    cart.hasSubscription = false;
    when(cartService.addToCart(items)).thenResolve(anEcommerceCart);

    await addToCart().execute(items);

    verify(cartService.addToCart(deepEqual(items))).once();
    expect(cart.items).toStrictEqual([anItem]);
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    cart.reset();
    cartService = mock<CartService>();
    subscriptionService = mock<SubscriptionService>();
    sessionStorage = mock<SessionStorage>();
  });

  function addToCart(): AddToCart {
    return new AddToCart(cart, instance(cartService), instance(subscriptionService), instance(sessionStorage));
  }

  let cart: Cart;
  let cartService: CartService;
  let subscriptionService: SubscriptionService;
  let sessionStorage: SessionStorage;
  const anEcommerceCartWithAMaxRower = ecommerceCartFixtures.anEcommerceCartWithAMaxRower;
  const anEcommerceCartWithASubscription = ecommerceCartFixtures.anEcommerceCartWithYearlySubscription;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceWithATShirt;
  const aMaxRowerItem = ecommerceCartItemFixtures.aMaxRowerItem;
  const aSubscriptionCartItem = ecommerceCartItemFixtures.aYearlySubscriptionItem;
  const anItem = ecommerceCartItemFixtures.aTShirtItem;
});

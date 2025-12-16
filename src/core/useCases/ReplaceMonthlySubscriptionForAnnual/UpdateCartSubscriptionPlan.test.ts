import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { UpdateCartSubscriptionPlan } from "./UpdateCartSubscriptionPlan";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";

describe("UpdateCartSubscriptionPlan should", () => {
  it("remove Item From cart, add to cart new a Plan not chargeable and update the cart", async () => {
    const newItems = [
      {
        isSubscription: true,
        options: [{ name: "Plan", value: newPlan }],
        productId: aCartItemWithMonthlySubscription.productId,
        quantity: 1,
      },
    ];
    when(cartService.addToCart(anything())).thenResolve(aCartWithAnnualSubscription);

    await updateSubscriptionPlan().execute(aCartItemWithMonthlySubscription, newPlan);

    verify(cartService.removeItemFromCart(aCartItemWithMonthlySubscription.id)).called();
    verify(cartService.addToCart(anything())).called();
    const [items] = capture(cartService.addToCart).last();
    expect(items).toStrictEqual(newItems);
    verify(cart.update(anything())).called();
    const [newCart] = capture(cart.update).last();
    expect(newCart).toStrictEqual(aCartWithAnnualSubscription);
  });

  it("remove Item From cart, add to cart new chargeable Subscription and update the cart", async () => {
    const newItems = [
      {
        isSubscription: true,
        options: [{ name: "Subscription", value: newPlan }],
        productId: aCartItemWithMonthlySubscription.productId,
        quantity: 1,
      },
    ];
    when(cartService.addToCart(anything())).thenResolve(aCartWithAnnualSubscription);

    await updateSubscriptionPlan().execute(aCartItemWithMonthlySubscription, newPlan, true);

    verify(cartService.removeItemFromCart(aCartItemWithMonthlySubscription.id)).called();
    verify(cartService.addToCart(anything())).called();
    const [items] = capture(cartService.addToCart).last();
    expect(items).toStrictEqual(newItems);
    verify(cart.update(anything())).called();
    const [newCart] = capture(cart.update).last();
    expect(newCart).toStrictEqual(aCartWithAnnualSubscription);
  });

  it("fail if remove Item from Cart fails", async () => {
    when(cartService.removeItemFromCart(anything())).thenThrow(new Error("A message"));

    await expectThrows(async () => {
      await updateSubscriptionPlan().execute(aCartItemWithMonthlySubscription, newPlan);
    }, NotExpectedError);
  });

  it("fail if remove add to cart fails", async () => {
    when(cartService.addToCart(anything())).thenThrow(new Error("A message"));

    await expectThrows(async () => {
      await updateSubscriptionPlan().execute(aCartItemWithMonthlySubscription, newPlan);
    }, NotExpectedError);
  });

  beforeEach(() => {
    cartService = mock<CartService>();
    cart = mock<Cart>();
  });

  function updateSubscriptionPlan(): UpdateCartSubscriptionPlan {
    return new UpdateCartSubscriptionPlan(instance(cart), instance(cartService));
  }

  let cart: Cart;
  let cartService: CartService;
  const aCartItemWithMonthlySubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription.items[0];
  const aCartWithAnnualSubscription = ecommerceCartFixtures.anEcommerceCartWithYearlySubscription;
  const newPlan = "Annual";
});

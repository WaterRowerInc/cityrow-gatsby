import { anything, instance, mock, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { RemoveCouponsFromCart } from "./RemoveCouponsFromCart";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";

describe("RemoveCouponsFromCart should", () => {
  it("remove coupons and retrieve the Cart", async () => {
    when(cartService.removeCouponsFromCart()).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());

    await removeCouponsFromCart().execute();

    verify(cartService.removeCouponsFromCart()).called();
    verify(cart.update(anything())).calledAfter(cartService.removeCouponsFromCart());
  });

  it("fail if remove coupons and retrieve cart fails", async () => {
    when(cartService.removeCouponsFromCart()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await removeCouponsFromCart().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = mock<Cart>();
    cartService = mock<CartService>();
  });

  function removeCouponsFromCart(): RemoveCouponsFromCart {
    return new RemoveCouponsFromCart(instance(cart), instance(cartService));
  }

  let cartService: CartService;
  let cart: Cart;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
});

import { instance, mock, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { cartUpdateRequestsFixtures } from "../../domain/orders/testing/CartUpdateRequestsFixtures";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { UpdateCart } from "./UpdateCart";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";

describe("UpdateCart should", () => {
  it("update the Cart", async () => {
    when(cartService.updateCart(aCartUpdateRequestWithAnAddress)).thenResolve(anEcommerceCart);
    when(cart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());

    await updateCart().execute(aCartUpdateRequestWithAnAddress);

    verify(cartService.updateCart(aCartUpdateRequestWithAnAddress)).called();
    verify(cart.update(anEcommerceCart)).calledAfter(cartService.updateCart(aCartUpdateRequestWithAnAddress));
  });

  it("fail if update cart fails", async () => {
    when(cartService.updateCart(aCartUpdateRequestWithAnAddress)).thenThrow(new Error("an Error"));

    await expectThrows(async () => {
      await updateCart().execute(aCartUpdateRequestWithAnAddress);
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = mock<Cart>();
    cartService = mock<CartService>();
  });

  function updateCart(): UpdateCart {
    return new UpdateCart(instance(cart), instance(cartService));
  }

  let cart: Cart;
  let cartService: CartService;
  const aCartUpdateRequestWithAnAddress = cartUpdateRequestsFixtures.aCartUpdateRequestWithAnAddress;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
});

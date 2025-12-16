import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { GetCart } from "./GetCart";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";
import { ProductService } from "../../domain/products/ProductService";

describe("GetCart should", () => {
  it("retrieve the Cart", async () => {
    when(cartService.getCart()).thenResolve(anEcommerceCart);
    when(spyCart.update(anEcommerceCart)).thenReturn(cart);

    await getCart().execute();

    verify(cartService.getCart()).called();
    verify(spyCart.update(anything())).calledAfter(cartService.getCart());
  });

  it("update cart on subscribe", async () => {
    const mockedFunction = jest.fn();
    when(spyCart.update(anEcommerceCartWithItems)).thenReturn(cart);

    getCart().subscribe(mockedFunction);
    const [ecommerceCartCallback] = capture(cartService.subscribe).last();
    await ecommerceCartCallback(anEcommerceCartWithItems);

    verify(cartService.subscribe(anything())).called();
  });

  it("fail if get cart fails", async () => {
    when(cartService.getCart()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await getCart().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    spyCart = spy(cart);
    cartService = mock<CartService>();
    productService = mock<ProductService>();
  });

  function getCart(): GetCart {
    return new GetCart(cart, instance(cartService), instance(productService));
  }

  let cart: Cart;
  let spyCart: Cart;
  let cartService: CartService;
  let productService: ProductService;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
  const anEcommerceCartWithItems = ecommerceCartFixtures.anEcommerceCartWithAClassicRowerBundle;
});

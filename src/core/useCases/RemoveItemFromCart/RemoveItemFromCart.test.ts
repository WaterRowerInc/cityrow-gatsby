import { ItemDoesNotExistOnCartError } from "../../domain/orders/ItemDoesNotExistOnCartError";
import { ProductService } from "../../domain/products/ProductService";
import { deepEqual, instance, mock, spy, verify, when } from "ts-mockito";
import { CartService } from "../../domain/orders/CartService";
import { RemoveItemFromCart } from "./RemoveItemFromCart";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { CartBuilder } from "../../domain/orders/testing/CartBuilder";
import { Cart } from "../../domain/orders/Cart";
import { ecommerceCartFixtures } from "../../domain/orders/testing/EcommerceCartFixtures";
import { productFixtures } from "../../domain/products/testing/ProductFixtures";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

describe("RemoveItemFromCart should", () => {
  it("remove an existing item, update the cart and retrieve the new one", async () => {
    cart = new CartBuilder().withItem(anItem).build();
    spyCart = spy(cart);
    when(cartService.removeItemFromCart(anItemId)).thenResolve(anEcommerceCart);
    when(spyCart.update(anEcommerceCart)).thenReturn(new CartBuilder().build());
    const aProduct = productFixtures.aProduct;
    when(productService.getFromSlugOrId(anItemId)).thenResolve(aProduct);

    const newCart = await removeItemFromCart().execute(anItemId);

    verify(spyCart.update(anEcommerceCart)).called();
    expect(newCart.items.find((item) => item.id === anItemId)).toBeFalsy();
  });

  it("track Product Removed analytics event", async () => {
    cart = new CartBuilder().withItem(anItem).build();
    when(cartService.removeItemFromCart(anItemId)).thenResolve(anEcommerceCart);
    const aProduct = productFixtures.aProduct;
    when(productService.getFromSlugOrId(anItemId)).thenResolve(aProduct);
    const aProductRemovedRequest = { product_id: aProduct.id, product_slug: aProduct.slug };

    await removeItemFromCart().execute(anItemId);

    verify(trackAnalytics.execute("Product Removed", deepEqual(aProductRemovedRequest))).once();
  });

  it("throw an error message if item isn't in the cart", async () => {
    cart = new CartBuilder().build();
    spyCart = spy(cart);

    await expectThrows(async () => {
      await removeItemFromCart().execute(anItemId);
    }, ItemDoesNotExistOnCartError);
  });

  beforeEach(() => {
    cartService = mock<CartService>();
    productService = mock<ProductService>();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function removeItemFromCart(): RemoveItemFromCart {
    return new RemoveItemFromCart(cart, instance(cartService), instance(productService), instance(trackAnalytics));
  }

  let cart: Cart;
  let spyCart: Cart;
  let cartService: CartService;
  let productService: ProductService;
  let trackAnalytics: TrackAnalytics;
  const anEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
  const anEcommerceCartWithASubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription;
  const anItem = anEcommerceCartWithASubscription.items[0];
  const anItemId = anItem.id;
});

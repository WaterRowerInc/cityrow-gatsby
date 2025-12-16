import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { TrackAnalyticsProductAdded } from "./TrackAnalyticsProductAdded";
import { ProductService } from "../../../domain/products/ProductService";
import { productFixtures } from "../../../domain/products/testing/ProductFixtures";
import { ecommerceCartFixtures } from "../../../domain/orders/testing/EcommerceCartFixtures";
import { Cart } from "../../../domain/orders/Cart";
import { CartBuilder } from "../../../domain/orders/testing/CartBuilder";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsProductAdded should", () => {
  it("track the Product Added event in the analytics service for a non subscription nor subscription package product with the user logged in", async () => {
    cart.update(someEcommerceCart);
    when(productService.getFromSlugOrId(aProductId)).thenResolve(aNonSubscriptionNorSubscriptionPackageProduct);

    await trackAnalyticsProductAdded().execute(aProductId);

    verify(trackAnalytics.execute("Product Added", deepEqual(aProductAddedRequest))).called();
  });

  it("track the Product Added event in the analytics service for a subscription", async () => {
    cart.update(anEcommerceCartWithSubscription);
    cart.id = "someId";
    when(productService.getFromSlugOrId(aProductId)).thenResolve(aSubscription);

    await trackAnalyticsProductAdded().execute(aProductId);

    verify(trackAnalytics.execute("Product Added", deepEqual(aProductAddedRequestWithSubscription))).called();
  });

  it("track the Product Added event in the analytics service for a max rower", async () => {
    cart.update(anEcommerceCartWithAMaxRower);
    cart.id = "someId";
    when(productService.getFromSlugOrId(aProductId)).thenResolve(aMaxRower);

    await trackAnalyticsProductAdded().execute(aProductId);

    verify(trackAnalytics.execute("Product Added", deepEqual(aProductAddedRequestWithMax))).called();
  });

  it("track the Product Added event in the analytics service for a classic rower", async () => {
    cart.update(anEcommerceCartWithAClassicRower);
    cart.id = "someId";
    when(productService.getFromSlugOrId(aProductId)).thenResolve(aClassicRower);

    await trackAnalyticsProductAdded().execute(aProductId);

    verify(trackAnalytics.execute("Product Added", deepEqual(aProductAddedRequestWithClassic))).called();
  });

  it("track the Product Added event in the analytics service for a com mod", async () => {
    cart.update(anEcommerceCartWithAComMod);
    cart.id = "someId";
    when(productService.getFromSlugOrId(aProductId)).thenResolve(aComMod);

    await trackAnalyticsProductAdded().execute(aProductId);

    verify(trackAnalytics.execute("Product Added", deepEqual(aProductAddedRequestWithComMod))).called();
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    productService = mock<ProductService>();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsProductAdded(): TrackAnalyticsProductAdded {
    return new TrackAnalyticsProductAdded(cart, instance(productService), instance(trackAnalytics));
  }

  let cart: Cart;
  let productService: ProductService;
  let trackAnalytics: TrackAnalytics;
  const aProductId = "aProductId";
  const someEcommerceCart = ecommerceCartFixtures.anEcommerceCart;
  const anEcommerceCartWithSubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription;
  const anEcommerceCartWithAMaxRower = ecommerceCartFixtures.anEcommerceCartWithAMaxRowerBundle;
  const anEcommerceCartWithAClassicRower = ecommerceCartFixtures.anEcommerceCartWithAClassicRowerBundle;
  const anEcommerceCartWithAComMod = ecommerceCartFixtures.anEcommerceCartWithAComMod;
  const aNonSubscriptionNorSubscriptionPackageProduct = productFixtures.aProduct;
  const aProductAddedRequest = {
    cart_id: someEcommerceCart.id,
    package: "",
    product_id: aNonSubscriptionNorSubscriptionPackageProduct.id,
    sku: aNonSubscriptionNorSubscriptionPackageProduct.sku,
    category: aNonSubscriptionNorSubscriptionPackageProduct.categories.join(", "),
    name: aNonSubscriptionNorSubscriptionPackageProduct.name,
    brand: "CITYROW",
    variant: "",
    price: aNonSubscriptionNorSubscriptionPackageProduct.price,
    quantity: 1,
    coupon: "",
    position: 1,
    url: "http://localhost/",
    image_url: "",
  };
  const aSubscription = productFixtures.aSubscriptionProduct;
  const aProductAddedRequestWithSubscription = {
    cart_id: someEcommerceCart.id,
    package: "Subscription",
    product_id: aSubscription.id,
    sku: aSubscription.sku,
    category: aSubscription.categories.join(", "),
    name: aSubscription.name,
    brand: "CITYROW",
    variant: "",
    price: aSubscription.price,
    quantity: 1,
    coupon: "",
    position: 1,
    url: "http://localhost/",
    image_url: aSubscription.images.join(", "),
  };
  const aMaxRower = productFixtures.aMaxRower;
  const aProductAddedRequestWithMax = {
    cart_id: someEcommerceCart.id,
    package: "Max",
    product_id: aMaxRower.id,
    sku: aMaxRower.sku,
    category: aMaxRower.categories.join(", "),
    name: aMaxRower.name,
    brand: "CITYROW",
    variant: "",
    price: aMaxRower.price,
    quantity: 1,
    coupon: "",
    position: 1,
    url: "http://localhost/",
    image_url: "someImages",
  };
  const aClassicRower = productFixtures.aClassicRower;
  const aProductAddedRequestWithClassic = {
    cart_id: someEcommerceCart.id,
    package: "Classic",
    product_id: aClassicRower.id,
    sku: aClassicRower.sku,
    category: aClassicRower.categories.join(", "),
    name: aClassicRower.name,
    brand: "CITYROW",
    variant: "",
    price: aClassicRower.price,
    quantity: 1,
    coupon: "",
    position: 1,
    url: "http://localhost/",
    image_url: "",
  };

  const aComMod = productFixtures.aComModule;
  const aProductAddedRequestWithComMod = {
    cart_id: someEcommerceCart.id,
    package: "ComMod",
    product_id: aComMod.id,
    sku: aComMod.sku,
    category: aComMod.categories.join(", "),
    name: aComMod.name,
    brand: "CITYROW",
    variant: "",
    price: aComMod.price,
    quantity: 1,
    coupon: "",
    position: 1,
    url: "http://localhost/",
    image_url: "",
  };
});

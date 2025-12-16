import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { TrackAnalyticsCheckoutStarted } from "./TrackAnalyticsCheckoutStarted";
import { Cart } from "../../../domain/orders/Cart";
import { ProductService } from "../../../domain/products/ProductService";
import { CartBuilder } from "../../../domain/orders/testing/CartBuilder";
import { ecommerceCartFixtures } from "../../../domain/orders/testing/EcommerceCartFixtures";
import { productFixtures } from "../../../domain/products/testing/ProductFixtures";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsCheckoutStarted should", () => {
  it("track the Checkout Started event in the analytics service for a Subscription Package", async () => {
    cart.update(anEcommerceCartWithSubscription);
    cart.id = "someId";
    cart.couponCode = "someCoupon";
    cart.discounts = 15;
    cart.shippingPrice = 35;
    cart.tax = 28;
    when(productService.getFromSlugOrId(anything())).thenResolve(aSubscriptionProduct);

    await trackAnalyticsCheckoutStarted().execute();

    verify(trackAnalytics.execute("Checkout Started", deepEqual(aSubscriptionCheckoutStartedRequest))).called();
  });

  it("track the Checkout Started event in the analytics service for a Max Rower Package", async () => {
    cart.update(anEcommerceCartWithAMaxRower);
    cart.id = "someId";
    when(productService.getFromSlugOrId(anEcommerceCartWithAMaxRower.items[0].productId)).thenResolve(
      aSubscriptionProduct
    );
    when(productService.getFromSlugOrId(anEcommerceCartWithAMaxRower.items[1].productId)).thenResolve(aMaxRowerProduct);

    await trackAnalyticsCheckoutStarted().execute();

    verify(trackAnalytics.execute("Checkout Started", deepEqual(aMaxRowerCheckoutStartedRequest))).called();
  });

  it("track the Checkout Started event in the analytics service for a Classic Rower Package", async () => {
    cart.update(anEcommerceCartWithAClassicRower);
    cart.id = "someId";
    when(productService.getFromSlugOrId(anEcommerceCartWithAClassicRower.items[0].productId)).thenResolve(
      aSubscriptionProduct
    );
    when(productService.getFromSlugOrId(anEcommerceCartWithAClassicRower.items[1].productId)).thenResolve(
      aClassicRowerProduct
    );

    await trackAnalyticsCheckoutStarted().execute();

    verify(trackAnalytics.execute("Checkout Started", deepEqual(aClassicRowerCheckoutStartedRequest))).called();
  });

  it("track the Checkout Started event in the analytics service for a ComModule Package", async () => {
    cart.update(anEcommerceCartWithAComModule);
    cart.id = "someId";
    when(productService.getFromSlugOrId(anEcommerceCartWithAComModule.items[0].productId)).thenResolve(
      aSubscriptionProduct
    );
    when(productService.getFromSlugOrId(anEcommerceCartWithAComModule.items[1].productId)).thenResolve(
      aComModuleProduct
    );

    await trackAnalyticsCheckoutStarted().execute();

    verify(trackAnalytics.execute("Checkout Started", deepEqual(aComModuleCheckoutStartedRequest))).called();
  });

  it("return undefined if the tracking event fails", async () => {
    cart.update(anEcommerceCartWithSubscription);
    cart.id = "someId";
    when(productService.getFromSlugOrId(anything())).thenThrow(new Error("an Error"));

    await trackAnalyticsCheckoutStarted().execute();

    verify(
      trackAnalytics.execute("Checkout Started", deepEqual(aSubscriptionWithoutProductCheckoutStartedRequest))
    ).called();
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    cart.reset();
    productService = mock<ProductService>();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsCheckoutStarted(): TrackAnalyticsCheckoutStarted {
    return new TrackAnalyticsCheckoutStarted(cart, instance(productService), instance(trackAnalytics));
  }

  let cart: Cart;
  let productService: ProductService;
  let trackAnalytics: TrackAnalytics;
  const aSubscriptionProduct = productFixtures.aSubscriptionProduct;
  const aMaxRowerProduct = productFixtures.aMaxRower;
  const aClassicRowerProduct = productFixtures.aClassicRower;
  const aComModuleProduct = productFixtures.aComModule;
  const anEcommerceCartWithSubscription = ecommerceCartFixtures.anEcommerceCartWithMonthlySubscription;
  const anEcommerceCartWithAMaxRower = ecommerceCartFixtures.anEcommerceCartWithAMaxRowerBundle;
  const anEcommerceCartWithAClassicRower = ecommerceCartFixtures.anEcommerceCartWithAClassicRowerBundle;
  const anEcommerceCartWithAComModule = ecommerceCartFixtures.anEcommerceCartWithAComMod;
  const aSubscription = {
    product_id: aSubscriptionProduct.id,
    brand: "CITYROW",
    category: aSubscriptionProduct.categories.join(", "),
    coupon: "",
    image_url: aSubscriptionProduct.images?.[0] || "",
    name: anEcommerceCartWithSubscription.items[0].name,
    position: 1,
    price: anEcommerceCartWithSubscription.items[0].price,
    quantity: 1,
    sku: aSubscriptionProduct.sku,
    url: "",
    variant: "",
  };
  const aSubscriptionWithoutProduct = {
    product_id: "",
    brand: "CITYROW",
    category: "",
    coupon: "",
    image_url: "",
    name: anEcommerceCartWithSubscription.items[0].name,
    position: 1,
    price: anEcommerceCartWithSubscription.items[0].price,
    quantity: 1,
    sku: "",
    url: "",
    variant: "",
  };
  const aSubscriptionCheckoutStartedRequest = {
    affiliation: "GO Website",
    cart_id: "someId",
    coupon: "someCoupon",
    currency: "USD",
    discount: 15,
    package: "Subscription",
    products: [aSubscription],
    shipping: 35,
    tax: 28,
  };
  const aSubscriptionWithoutProductCheckoutStartedRequest = {
    affiliation: "GO Website",
    cart_id: "someId",
    coupon: "",
    currency: "USD",
    discount: 0,
    package: "Subscription",
    products: [aSubscriptionWithoutProduct],
    shipping: 0,
    tax: 0,
  };
  const aMaxRower = {
    product_id: aMaxRowerProduct.id,
    brand: "CITYROW",
    category: aMaxRowerProduct.categories.join(", "),
    coupon: "",
    image_url: aMaxRowerProduct.images?.[0] || "",
    name: anEcommerceCartWithAMaxRower.items[1].name,
    position: 1,
    price: anEcommerceCartWithAMaxRower.items[1].price,
    quantity: 1,
    sku: aMaxRowerProduct.sku,
    url: "",
    variant: "",
  };
  const aClassicRower = {
    product_id: aClassicRowerProduct.id,
    brand: "CITYROW",
    category: aClassicRowerProduct.categories.join(", "),
    coupon: "",
    image_url: aClassicRowerProduct.images?.[0] || "",
    name: anEcommerceCartWithAClassicRower.items[1].name,
    position: 1,
    price: anEcommerceCartWithAClassicRower.items[1].price,
    quantity: 1,
    sku: aClassicRowerProduct.sku,
    url: "",
    variant: "",
  };
  const aComModule = {
    product_id: aComModuleProduct.id,
    brand: "CITYROW",
    category: aComModuleProduct.categories.join(", "),
    coupon: "",
    image_url: aComModuleProduct.images?.[0] || "",
    name: anEcommerceCartWithAComModule.items[1].name,
    position: 1,
    price: anEcommerceCartWithAComModule.items[1].price,
    quantity: 1,
    sku: aComModuleProduct.sku,
    url: "",
    variant: "",
  };
  const aMaxRowerCheckoutStartedRequest = {
    affiliation: "GO Website",
    cart_id: "someId",
    coupon: "",
    currency: "USD",
    discount: 0,
    package: "Max",
    products: [aSubscription, aMaxRower],
    shipping: 0,
    tax: 0,
  };
  const aClassicRowerCheckoutStartedRequest = {
    affiliation: "GO Website",
    cart_id: "someId",
    coupon: "",
    currency: "USD",
    discount: 0,
    package: "Classic",
    products: [aSubscription, aClassicRower],
    shipping: 0,
    tax: 0,
  };
  const aComModuleCheckoutStartedRequest = {
    affiliation: "GO Website",
    cart_id: "someId",
    coupon: "",
    currency: "USD",
    discount: 0,
    package: "ComMod",
    products: [aSubscription, aComModule],
    shipping: 0,
    tax: 0,
  };
});

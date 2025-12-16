import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { TrackAnalyticsOrderCompleted } from "./TrackAnalyticsOrderCompleted";
import { Cart } from "../../../domain/orders/Cart";
import { CartBuilder } from "../../../domain/orders/testing/CartBuilder";
import { ProductService } from "../../../domain/products/ProductService";
import { orderFixtures } from "../../../domain/orders/testing/OrderFixtures";
import { ecommerceCartItemFixtures } from "../../../domain/orders/testing/EcommerceCartItemFixtures";
import { productFixtures } from "../../../domain/products/testing/ProductFixtures";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsShipmentInfoEntered should", () => {
  it("track the shipment info entered event in the analytics service", async () => {
    when(productService.getFromSlugOrId(aMaxRowerItem.productId)).thenResolve(aMaxRowerProduct);
    when(productService.getFromSlugOrId(aSubscriptionItem.productId)).thenResolve(aSubscriptionProduct);
    cart.items = [aMaxRowerItem, aSubscriptionItem];
    cart.hasSubscriptionPackage = true;
    cart.hasSubscription = true;

    await trackAnalyticsShipmentInfoEntered().execute(anOrder);

    verify(trackAnalytics.execute("Order Completed", deepEqual(anOrderCompletedRequest))).called();
  });

  it("track the shipment info entered event in the analytics service with a failing product", async () => {
    when(productService.getFromSlugOrId(aMaxRowerItem.productId)).thenThrow(new Error());
    cart.items = [aMaxRowerItem];
    cart.hasSubscriptionPackage = true;

    await trackAnalyticsShipmentInfoEntered().execute(anOrder);

    verify(trackAnalytics.execute("Order Completed", deepEqual(anOrderCompletedRequestWithNoProduct))).called();
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    cart.reset();
    productService = mock<ProductService>();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsShipmentInfoEntered(): TrackAnalyticsOrderCompleted {
    return new TrackAnalyticsOrderCompleted(cart, instance(productService), instance(trackAnalytics));
  }

  let cart: Cart;
  let productService: ProductService;
  let trackAnalytics: TrackAnalytics;
  const aMaxRowerProduct = productFixtures.aMaxRower;
  const aSubscriptionProduct = productFixtures.aSubscriptionProduct;
  const aMaxRowerItem = ecommerceCartItemFixtures.aMaxRowerItem;
  const aSubscriptionItem = ecommerceCartItemFixtures.aMonthlySubscriptionItem;
  const anOrder = orderFixtures.anOrder;
  const anOrderCompletedRequest = {
    affiliation: "GO Website",
    coupon: "aCoupon",
    currency: "USD",
    discount: 50,
    order_id: "someId",
    package: "Max",
    products: [
      {
        product_id: "someId",
        brand: "CITYROW",
        category: "Rower",
        coupon: "",
        image_url: "someImages",
        name: "Max Rower",
        position: 1,
        price: 123,
        quantity: 1,
        revenueType: "Purchase",
        sku: "someSku",
        url: "",
        variant: "",
      },
      {
        product_id: "someId",
        brand: "CITYROW",
        category: "Subscription",
        coupon: "",
        image_url: "someImage",
        name: "Subscription",
        position: 1,
        price: 0,
        quantity: 1,
        revenueType: "Recurring",
        sku: "someSku",
        url: "",
        variant: "",
      },
    ],
    revenue: 1850,
    shipping: 100,
    shipping_method: "Parcel Delivery",
    tax: 200,
    total: 2150,
  };

  const anOrderCompletedRequestWithNoProduct = {
    affiliation: "GO Website",
    coupon: "aCoupon",
    currency: "USD",
    discount: 50,
    order_id: "someId",
    package: "Max",
    products: [
      {
        product_id: "",
        brand: "CITYROW",
        category: "",
        coupon: "",
        image_url: "",
        name: "Max Rower",
        position: 1,
        price: 123,
        quantity: 1,
        sku: "",
        url: "",
        variant: "",
      },
    ],
    revenue: 1850,
    shipping: 100,
    shipping_method: "Parcel Delivery",
    tax: 200,
    total: 2150,
  };
});

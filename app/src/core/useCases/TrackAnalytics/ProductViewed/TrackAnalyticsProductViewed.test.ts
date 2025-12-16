import { deepEqual, instance, mock, verify } from "ts-mockito";
import { TrackAnalyticsProductViewed } from "./TrackAnalyticsProductViewed";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsProductViewed should", () => {
  it("track the Product Viewed event in the analytics service with the user logged in", async () => {
    await trackAnalyticsProductViewed().execute(aTrackProductAnalyticsRequest);

    verify(trackAnalytics.execute("Product Viewed", deepEqual(aProductViewedRequest))).called();
  });

  beforeEach(() => {
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsProductViewed(): TrackAnalyticsProductViewed {
    return new TrackAnalyticsProductViewed(instance(trackAnalytics));
  }

  let trackAnalytics: TrackAnalytics;
  const aProductViewedRequest = {
    brand: "CITYROW",
    category: "product",
    coupon: "",
    currency: "usd",
    image_url: "https://cdn.schema.io/cityrow-staging/61255b39b923b03e7ec4bb0d/c07f6e4d8fae3132ed2946aafed63f6a",
    name: "CITYROW GO Max Rower",
    position: 1,
    price: 2195,
    product_id: "5fdced1d45d6383b535f1bf1",
    quantity: 1,
    sku: "wr-go-2",
    url: "http://localhost:8000/en-us/products/max-rower",
    value: 2195,
    variant: "",
  };
  const aTrackProductAnalyticsRequest = {
    imageUrl: "https://cdn.schema.io/cityrow-staging/61255b39b923b03e7ec4bb0d/c07f6e4d8fae3132ed2946aafed63f6a",
    name: "CITYROW GO Max Rower",
    price: 2195,
    productId: "5fdced1d45d6383b535f1bf1",
    sku: "wr-go-2",
    url: "http://localhost:8000/en-us/products/max-rower",
  };
});

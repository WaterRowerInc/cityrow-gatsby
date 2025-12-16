import { TrackAnalyticsProductViewedRequest } from "../../../domain/analytics/TrackAnalyticsProductViewedRequest";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsProductViewed {
  private readonly trackAnalytics: TrackAnalytics;

  constructor(trackAnalytics: TrackAnalytics) {
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (trackAnalyticsProductViewedRequest: TrackAnalyticsProductViewedRequest) =>
    this.trackAnalytics.execute("Product Viewed", this.parseOptions(trackAnalyticsProductViewedRequest));

  private parseOptions = ({ imageUrl, name, price, productId, sku, url }: TrackAnalyticsProductViewedRequest) => ({
    brand: "CITYROW",
    category: "product",
    coupon: "",
    currency: "usd",
    image_url: imageUrl,
    name,
    position: 1,
    price,
    product_id: productId,
    quantity: 1,
    sku,
    url,
    value: price,
    variant: "",
  });
}

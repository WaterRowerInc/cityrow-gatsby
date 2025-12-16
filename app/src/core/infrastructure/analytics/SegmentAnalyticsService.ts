import { Analytics, AnalyticsBrowser } from "@segment/analytics-next";
import { AnalyticsService } from "../../domain/analytics/AnalyticsService";
import { CTAClickedRequest } from "../../domain/analytics/CTAClickedRequest";
import { ProductAnalyticsRequest } from "../../domain/analytics/ProductAnalyticsRequest";
import { EmailSubmittedRequest } from "../../domain/analytics/EmailSubmittedRequest";
import { CheckoutStartedRequest } from "../../domain/analytics/CheckoutStartedRequest";
import { PaymentInfoEnteredRequest } from "../../domain/analytics/PaymentInfoEnteredRequest";
import { OrderCompletedRequest } from "../../domain/analytics/OrderCompletedRequest";
import { ProductRemovedRequest } from "../../domain/analytics/ProductRemovedRequest";
import { CouponRequest } from "../../domain/analytics/CouponRequest";
import { AccountCreatedRequest } from "../../domain/analytics/AccountCreatedRequest";
import { IdentifyTraits } from "../../domain/analytics/IdentifyTraits";

export class SegmentAnalyticsService implements AnalyticsService {
  private readonly publicKey: string;
  private analytics?: Analytics;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  identify = async (id?: string, traits?: IdentifyTraits) => {
    if (!this.analytics) await this.initializeAnalytics();
    if (!id) return await this.analytics!.identify(traits);
    return await this.analytics!.identify(id, traits);
  };

  reset = async () => {
    if (!this.analytics) await this.initializeAnalytics();
    this.analytics!.reset();
    this.analytics!.user().logout();
  };

  track = async (
    event: string,
    options?:
      | AccountCreatedRequest
      | CheckoutStartedRequest
      | CouponRequest
      | CTAClickedRequest
      | EmailSubmittedRequest
      | OrderCompletedRequest
      | PaymentInfoEnteredRequest
      | ProductAnalyticsRequest
      | ProductRemovedRequest
  ) => {
    if (!this.analytics) await this.initializeAnalytics();
    await this.analytics!.track(event, options);
  };

  trackPageView = async (page: string) => {
    if (!this.analytics) await this.initializeAnalytics();
    return await this.analytics!.page(page);
  };

  private initializeAnalytics = async () => {
    const analyticsBrowser = await AnalyticsBrowser.load({ writeKey: this.publicKey });
    this.analytics = analyticsBrowser[0];
  };
}

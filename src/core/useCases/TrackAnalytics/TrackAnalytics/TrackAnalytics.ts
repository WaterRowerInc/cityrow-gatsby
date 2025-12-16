import { DynamicFormRequest } from "../../../domain/analytics/DynamicFormRequest";
import { AccountCreatedRequest } from "../../../domain/analytics/AccountCreatedRequest";
import { CheckoutStartedRequest } from "../../../domain/analytics/CheckoutStartedRequest";
import { CouponRequest } from "../../../domain/analytics/CouponRequest";
import { CTAClickedRequest } from "../../../domain/analytics/CTAClickedRequest";
import { EmailSubmittedRequest } from "../../../domain/analytics/EmailSubmittedRequest";
import { OrderCompletedRequest } from "../../../domain/analytics/OrderCompletedRequest";
import { PaymentInfoEnteredRequest } from "../../../domain/analytics/PaymentInfoEnteredRequest";
import { ProductAnalyticsRequest } from "../../../domain/analytics/ProductAnalyticsRequest";
import { ProductRemovedRequest } from "../../../domain/analytics/ProductRemovedRequest";
import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";
import { UserStorage } from "../../../domain/user/UserStorage";

export class TrackAnalytics {
  private readonly analyticsService: AnalyticsService;
  private readonly httpAnalyticsService: HttpAnalyticsService;
  private readonly userStorage: UserStorage;

  constructor(
    analyticsService: AnalyticsService,
    httpAnalyticsService: HttpAnalyticsService,
    userStorage: UserStorage
  ) {
    this.analyticsService = analyticsService;
    this.httpAnalyticsService = httpAnalyticsService;
    this.userStorage = userStorage;
  }

  execute = async (
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
      | DynamicFormRequest
  ) => {
    try {
      await this.analyticsService.track(event, options);
    } catch (e) {
      const userId = await this.userStorage.getUserId();
      const anonymousId = this.userStorage.getAnonymousId();
      await this.httpAnalyticsService.track({ userId, anonymousId, event, properties: options });
    }
  };
}

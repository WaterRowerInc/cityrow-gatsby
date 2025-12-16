import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionInfo } from "../../domain/subscriptions/SubscriptionInfo";
import { PaymentInfoService } from "../../domain/subscriptions/PaymentInfoService";
import { TrackAnalyticsUserConverted } from "../TrackAnalytics/UserConverted/TrackAnalyticsUserConverted";

export class UpdatePaymentInfo {
  private readonly paymentInfoService: PaymentInfoService;
  private readonly trackAnalyticsUserConverted: TrackAnalyticsUserConverted;

  constructor(paymentInfoService: PaymentInfoService, trackAnalyticsUserConverted: TrackAnalyticsUserConverted) {
    this.paymentInfoService = paymentInfoService;
    this.trackAnalyticsUserConverted = trackAnalyticsUserConverted;
  }

  execute = async (creditCardToken: string, isInAppUser: boolean, coupon?: string): Promise<SubscriptionInfo> => {
    try {
      const subscriptionInfo = await this.paymentInfoService.updatePaymentInfo(creditCardToken, coupon);
      if (isInAppUser) await this.trackAnalyticsUserConverted.execute();
      return subscriptionInfo;
    } catch (error: any) {
      throw new NotExpectedError(error.message);
    }
  };
}

import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SubscriptionInfo } from "../../domain/subscriptions/SubscriptionInfo";

export class GetUserSubscriptionInfo {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  execute = async (): Promise<SubscriptionInfo> => {
    try {
      return this.subscriptionService.getUserSubscription();
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };
}

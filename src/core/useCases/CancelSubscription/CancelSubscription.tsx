import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SubscriptionInfo } from "../../domain/subscriptions/SubscriptionInfo";

export class CancelSubscription {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  execute = async (): Promise<SubscriptionInfo> => await this.subscriptionService.cancelSubscription();
}

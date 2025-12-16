import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class GetUserSubscriptionStatus {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  execute = async (): Promise<string> => {
    const subscriptionStatus = await this.subscriptionService.getSubscriptionStatus();
    if (!subscriptionStatus) throw new NotExpectedError("Subscription not found");
    return subscriptionStatus;
  };
}

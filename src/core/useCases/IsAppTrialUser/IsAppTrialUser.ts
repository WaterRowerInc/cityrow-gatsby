import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";

export class IsAppTrialUser {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  execute = async (): Promise<boolean> => {
    try {
      const subscription = await this.subscriptionService.getUserSubscription();
      return subscription.status === "trialing" && !subscription.paymentInfo.number;
    } catch (error: any) {
      throw new NotExpectedError(error.message);
    }
  };
}

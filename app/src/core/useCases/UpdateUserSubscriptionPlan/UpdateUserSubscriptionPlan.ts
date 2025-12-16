import { SubscriptionInfo } from "./../../domain/subscriptions/SubscriptionInfo";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class UpdateUserSubscriptionPlan {
  private readonly subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  execute = async (planId: string): Promise<SubscriptionInfo> => {
    try {
      return await this.subscriptionService.updateSubscriptionPlan(planId);
    } catch (error: any) {
      throw new NotExpectedError(error.message);
    }
  };
}

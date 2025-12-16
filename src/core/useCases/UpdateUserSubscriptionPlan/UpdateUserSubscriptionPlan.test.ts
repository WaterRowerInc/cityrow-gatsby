import { anything, instance, mock, verify, when } from "ts-mockito";
import { UpdateUserSubscriptionPlan } from "./UpdateUserSubscriptionPlan";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("UpdateUserSubscriptionPlan should", () => {
  it("update the user subscription plan", async () => {
    when(subscriptionService.updateSubscriptionPlan(anything())).thenResolve();

    await updateSubscriptionPlan().execute("aPlanId");

    verify(subscriptionService.updateSubscriptionPlan("aPlanId")).called();
  });

  it("fail if update subscription plan call throws an error", async () => {
    when(subscriptionService.updateSubscriptionPlan(anything())).thenThrow(new Error("An unexpected error"));

    await expectThrows(async () => {
      await updateSubscriptionPlan().execute(anything());
    }, NotExpectedError);
  });

  beforeEach(() => {
    subscriptionService = mock<SubscriptionService>();
  });

  function updateSubscriptionPlan(): UpdateUserSubscriptionPlan {
    return new UpdateUserSubscriptionPlan(instance(subscriptionService));
  }

  let subscriptionService: SubscriptionService;
});

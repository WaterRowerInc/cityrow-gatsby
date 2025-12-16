import { subscriptionFixtures } from "./../../domain/subscriptions/testing/SubscriptionFixtures";
import { instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { IsAppTrialUser } from "./IsAppTrialUser";

describe("IsAppTrialUser should", () => {
  it("return true if user is trialing and doesn't have a credit card", async () => {
    when(subscriptionService.getUserSubscription()).thenResolve(subscriptionFixtures.trialWithoutCreditCard);

    const status = await isAppTrialUser().execute();

    verify(subscriptionService.getUserSubscription()).called();
    expect(status).toBe(true);
  });

  it("return false if user is trialing but has credit card", async () => {
    when(subscriptionService.getUserSubscription()).thenResolve(subscriptionFixtures.trialWithCreditCard);

    const status = await isAppTrialUser().execute();

    verify(subscriptionService.getUserSubscription()).called();
    expect(status).toBe(false);
  });

  it("fail if user status call throws an error", async () => {
    when(subscriptionService.getUserSubscription()).thenThrow(new Error("an error"));

    await expectThrows(async () => {
      await isAppTrialUser().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    subscriptionService = mock<SubscriptionService>();
  });

  function isAppTrialUser(): IsAppTrialUser {
    return new IsAppTrialUser(instance(subscriptionService));
  }

  let subscriptionService: SubscriptionService;
});

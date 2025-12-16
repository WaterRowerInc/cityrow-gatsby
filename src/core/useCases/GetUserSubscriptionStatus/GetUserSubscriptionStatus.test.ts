import { instance, mock, verify, when } from "ts-mockito";
import { GetUserSubscriptionStatus } from "./GetUserSubscriptionStatus";
import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("GetUserSubscriptionStatus should", () => {
  it("get the subscription status for the logged in user", async () => {
    const aStatus = "active";
    when(subscriptionService.getSubscriptionStatus()).thenResolve(aStatus);

    const status = await getSubscriptionStatus().execute();

    verify(subscriptionService.getSubscriptionStatus()).called();
    expect(status).toBe(aStatus);
  });

  it("fail if subscription status call throws an error", async () => {
    when(subscriptionService.getSubscriptionStatus()).thenResolve(null);

    await expectThrows(async () => {
      await getSubscriptionStatus().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    subscriptionService = mock<SubscriptionService>();
  });

  function getSubscriptionStatus(): GetUserSubscriptionStatus {
    return new GetUserSubscriptionStatus(instance(subscriptionService));
  }

  let subscriptionService: SubscriptionService;
});

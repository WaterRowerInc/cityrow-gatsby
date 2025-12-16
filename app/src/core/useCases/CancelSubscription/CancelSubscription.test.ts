import { instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { HttpSubscriptionService } from "../../infrastructure/http/HttpSubscriptionService";
import { CancelSubscription } from "./CancelSubscription";

describe("CancelSubscription should", () => {
  it("cancel user's subscription", async () => {
    await cancelSubscription().execute();

    verify(httpSubscriptionService.cancelSubscription()).called();
  });

  it("fail if cancel subscription fails", async () => {
    when(httpSubscriptionService.cancelSubscription()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await cancelSubscription().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    httpSubscriptionService = mock<HttpSubscriptionService>();
  });

  function cancelSubscription(): CancelSubscription {
    return new CancelSubscription(instance(httpSubscriptionService));
  }

  let httpSubscriptionService: HttpSubscriptionService;
});

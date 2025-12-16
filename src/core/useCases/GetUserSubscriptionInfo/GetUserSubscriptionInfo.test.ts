import { instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { GetUserSubscriptionInfo } from "./GetUserSubscriptionInfo";
import { HttpSubscriptionService } from "../../infrastructure/http/HttpSubscriptionService";

describe("GetUserSubscriptionInfo should", () => {
  it("retrieve the user's subscription info", async () => {
    await getUserSubscriptionInfo().execute();

    verify(httpSubscriptionService.getUserSubscription()).called();
  });

  it("fail if get subscription info fails", async () => {
    when(httpSubscriptionService.getUserSubscription()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await getUserSubscriptionInfo().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    httpSubscriptionService = mock<HttpSubscriptionService>();
  });

  function getUserSubscriptionInfo(): GetUserSubscriptionInfo {
    return new GetUserSubscriptionInfo(instance(httpSubscriptionService));
  }

  let httpSubscriptionService: HttpSubscriptionService;
});

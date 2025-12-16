import { anything, instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { UpdatePaymentInfo } from "./UpdatePaymentInfo";
import { PaymentInfoService } from "../../domain/subscriptions/PaymentInfoService";
import { TrackAnalyticsUserConverted } from "../TrackAnalytics/UserConverted/TrackAnalyticsUserConverted";
import { subscriptionFixtures } from "../../domain/subscriptions/testing/SubscriptionFixtures";

describe("UpdatePaymentInfo should", () => {
  it("update the user's payment info without coupon", async () => {
    const someSubscriptionInfo = subscriptionFixtures.trialWithCreditCard;
    const someToken = "someToken";

    when(paymentInfoService.updatePaymentInfo(someToken, undefined)).thenResolve(someSubscriptionInfo);

    const newSubscriptionInfo = await updatePaymentInfo().execute(someToken, false);

    verify(trackAnalyticsUserConverted.execute()).never();
    expect(newSubscriptionInfo).toBe(someSubscriptionInfo);
  });

  it("update the user's payment info with a coupon", async () => {
    const someSubscriptionInfo = subscriptionFixtures.trialWithCreditCard;
    const someToken = "someToken";
    const someCoupon = "someCoupon";

    when(paymentInfoService.updatePaymentInfo(someToken, someCoupon)).thenResolve(someSubscriptionInfo);

    const newSubscriptionInfo = await updatePaymentInfo().execute(someToken, false, someCoupon);

    verify(trackAnalyticsUserConverted.execute()).never();
    expect(newSubscriptionInfo).toBe(someSubscriptionInfo);
  });

  it("execute the user converted event if it's an inAppUser", async () => {
    await updatePaymentInfo().execute("someToken", true, "someCoupon");

    verify(trackAnalyticsUserConverted.execute()).once();
  });

  it("fail if update payment info fails", async () => {
    when(paymentInfoService.updatePaymentInfo(anything(), anything())).thenThrow(
      new NotExpectedError("Not Expected Error")
    );

    await expectThrows(async () => {
      await updatePaymentInfo().execute(anything(), anything());
    }, NotExpectedError);
  });

  beforeEach(() => {
    paymentInfoService = mock<PaymentInfoService>();
    trackAnalyticsUserConverted = mock<TrackAnalyticsUserConverted>();
  });

  function updatePaymentInfo(): UpdatePaymentInfo {
    return new UpdatePaymentInfo(instance(paymentInfoService), instance(trackAnalyticsUserConverted));
  }

  let paymentInfoService: PaymentInfoService;
  let trackAnalyticsUserConverted: TrackAnalyticsUserConverted;
});

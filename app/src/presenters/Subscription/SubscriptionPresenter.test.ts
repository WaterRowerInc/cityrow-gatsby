import { anything, capture, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../core/domain/orders/NotExpectedError";
import { CancelSubscription } from "../../core/useCases/CancelSubscription/CancelSubscription";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetTransactionsHistory } from "../../core/useCases/GetTransactionsHistory/GetTransactionsHistory";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { GetUserSubscriptionInfo } from "../../core/useCases/GetUserSubscriptionInfo/GetUserSubscriptionInfo";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { UpdatePaymentInfo } from "../../core/useCases/UpdatePaymentInfo/UpdatePaymentInfo";
import { productFixtures } from "../../core/domain/products/testing/ProductFixtures";
import { PromoCode } from "../../core/domain/subscriptions/PromoCode";
import { subscriptionFixtures } from "../../core/domain/subscriptions/testing/SubscriptionFixtures";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";
import { CheckSubscriptionCoupon } from "../../core/useCases/CheckSubscriptionCoupon/CheckSubscriptionCoupon";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import { TrackAnalyticsPaymentInfoEntered } from "../../core/useCases/TrackAnalytics/PaymentInfoEntered/TrackAnalyticsPaymentInfoEntered";
import { UpdateUserSubscriptionPlan } from "../../core/useCases/UpdateUserSubscriptionPlan/UpdateUserSubscriptionPlan";
import { SubscriptionPresenter, SubscriptionView } from "./SubscriptionPresenter";

describe("SubscriptionPresenter should", () => {
  it("track analytics page view on start", async () => {
    when(trackAnalyticsPageView.execute("Subscription")).thenResolve();

    await presenter.start();

    verify(view.showLoader()).called();
    verify(trackAnalyticsPageView.execute("Subscription")).called();
    verify(view.hideLoader()).called();
  });

  it("show loader before fetching user payment info and user subscription info on start", async () => {
    await presenter.start();

    verify(view.showLoader()).calledBefore(getUserSubscriptionInfo.execute());
  });

  it("hide loader after fetching user payment info and user subscription info on start", async () => {
    await presenter.start();

    verify(view.hideLoader()).calledAfter(getUserSubscriptionInfo.execute());
  });

  it("fetch user info on start", async () => {
    await presenter.start();

    verify(getUser.execute()).called();
  });

  it("show user info on start", async () => {
    await presenter.start();

    verify(view.loadUserData(anything())).called();
  });

  it("show an error message if there's no user", async () => {
    when(getUser.execute()).thenThrow(new Error("Some message"));

    await presenter.start();

    verify(view.showErrorMessage(anything())).called();
  });

  it("fetch user subscription / payment info on start", async () => {
    await presenter.start();

    verify(getUserSubscriptionInfo.execute()).called();
  });

  it("show user subscription / payment info on start", async () => {
    when(getUserSubscriptionInfo.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);

    await presenter.start();

    verify(view.showSubscriptionInfo(anything())).called();
    verify(view.showPaymentInfo(anything())).called();
  });

  it("update selected subscription plan id on start", async () => {
    when(getUserSubscriptionInfo.execute()).thenResolve(anything());

    await presenter.start();

    verify(view.updateSelectedPlanId(anything())).called();
  });

  it("show available subscription plans on start", async () => {
    when(getUserSubscriptionInfo.execute()).thenResolve(subscriptionFixtures.trialWithoutCreditCard);
    when(getProduct.execute("all-access")).thenResolve(productFixtures.aSubscriptionProduct);

    await presenter.start();

    verify(view.showSubscriptionPlans(anything())).called();
  });

  it("show user transactions history on start", async () => {
    when(getTransactionsHistory.execute()).thenResolve([{ type: "", amount: 200, date: "" }]);

    await presenter.start();

    verify(view.showTransactionRecords(anything())).called();
  });

  it("redirect to login if user is not logged in", async () => {
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());

    await presenter.start();

    verify(view.navigateToNewPath("login")).called();
  });

  it("show an error message if there's an unexpected error on start", async () => {
    when(getUserSubscriptionInfo.execute()).thenThrow(new NotExpectedError(anything()));

    await presenter.start();

    verify(view.showPaymentInfo(anything())).never();
    verify(view.showSubscriptionInfo(anything())).never();
    verify(view.showErrorMessage(anything())).called();
  });

  it("show loader before cancelling the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(view.showLoader()).calledBefore(cancelSubscription.execute());
  });

  it("make a call to cancel the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(cancelSubscription.execute()).calledAfter(view.showLoader());
  });

  it("update view subscription info after canceling the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(view.showSubscriptionInfo(anything())).called();
  });

  it("show a success message after cancelling the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(cancelSubscription.execute()).calledAfter(view.showLoader());
  });

  it("hide loader after cancelling the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(view.hideLoader()).calledAfter(cancelSubscription.execute());
  });

  it("hide the cancel dialog after hiding the loader after cancelling the user's subscription", async () => {
    when(cancelSubscription.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    await presenter.cancelUserSubscription();

    verify(view.hideCancelDialog()).calledAfter(view.hideLoader());
  });

  it("show loader when the user updates the payment", async () => {
    await presenter.updatePayment(anything(), anything());

    verify(view.showLoader()).called();
  });

  it("show a loader, show subscription info, show payment info, show subscription plans and hide the loader when a user updates his payment", async () => {
    const someCreditCardToken = "someCreditCardToken";
    const someCoupon = "someCoupon";
    const subscriptionInfoVM = {
      active: subscriptionFixtures.trialWithCreditCard.active,
      cancelDate: "-",
      id: subscriptionFixtures.trialWithCreditCard.id,
      klarna: subscriptionFixtures.trialWithCreditCard.klarna,
      name: subscriptionFixtures.trialWithCreditCard.name,
      nextBillDate: subscriptionFixtures.trialWithCreditCard.nextBillDate,
      paymentInfo: subscriptionFixtures.trialWithCreditCard.paymentInfo,
      planType: subscriptionFixtures.trialWithCreditCard.planType,
      pricing: subscriptionFixtures.trialWithCreditCard.pricing,
      purchaseDate: subscriptionFixtures.trialWithCreditCard.purchaseDate,
      status: subscriptionFixtures.trialWithCreditCard.status,
    };
    when(getUserSubscriptionInfo.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    when(updatePaymentInfo.execute(someCreditCardToken, false, someCoupon)).thenResolve(
      subscriptionFixtures.trialWithCreditCard
    );
    await presenter.start();

    await presenter.updatePayment(someCreditCardToken, someCoupon);

    verify(view.showLoader()).twice();
    const [subscriptionInfo] = capture(view.showSubscriptionInfo).last();
    expect(subscriptionInfo).toStrictEqual(subscriptionInfoVM);
    verify(view.showPaymentInfo(deepEqual(subscriptionFixtures.trialWithCreditCard.paymentInfo))).called();
    verify(view.showSubscriptionPlans(deepEqual([]))).called();
    verify(view.hideLoader()).twice();
  });

  it("show a success message for in app users when an in app user updates his payment", async () => {
    const someCreditCardToken = "someCreditCardToken";
    const successMessage = "Welcome To The Crew! You Will Be Charged At The End Of Your Trial.";
    when(getProduct.execute("all-access")).thenResolve(productFixtures.aSubscriptionProduct);
    when(getTransactionsHistory.execute()).thenResolve([]);
    when(getUserSubscriptionInfo.execute()).thenResolve(subscriptionFixtures.trialWithoutCreditCard);
    when(updatePaymentInfo.execute(someCreditCardToken, true, undefined)).thenResolve(
      subscriptionFixtures.trialWithCreditCard
    );
    await presenter.start();

    await presenter.updatePayment(someCreditCardToken);

    verify(view.showSuccessMessage(successMessage)).called();
  });

  it("show a success message when a user updates his payment", async () => {
    const someCreditCardToken = "someCreditCardToken";
    const successMessage = "Payment Info Updated Successfully!";
    when(getUserSubscriptionInfo.execute()).thenResolve(subscriptionFixtures.trialWithCreditCard);
    when(updatePaymentInfo.execute(someCreditCardToken, false, undefined)).thenResolve(
      subscriptionFixtures.trialWithCreditCard
    );
    await presenter.start();

    await presenter.updatePayment(someCreditCardToken);

    verify(view.showSuccessMessage(successMessage)).called();
  });

  it("track analytics payment info entered", async () => {
    when(trackAnalyticsPaymentInfoEntered.execute("card")).thenResolve();

    await presenter.onPaymentInfoEntered();

    verify(trackAnalyticsPaymentInfoEntered.execute("card")).called();
  });

  it("show loader before updating the user's plan info", async () => {
    when(updateUserSubscriptionPlan.execute(anything())).thenResolve(subscriptionFixtures.trialWithCreditCard);

    await presenter.handlePlanSelect(anything());

    verify(view.showLoader()).called();
  });

  it("update view data after updating the user's plan info", async () => {
    when(updateUserSubscriptionPlan.execute(anything())).thenResolve(subscriptionFixtures.trialWithCreditCard);

    await presenter.handlePlanSelect(anything());

    verify(view.showSubscriptionInfo(anything())).calledAfter(view.showLoader());
    verify(view.updateSelectedPlanId(anything())).calledBefore(view.hideLoader());
  });

  it("hide loader after updating the user's plan info", async () => {
    when(updateUserSubscriptionPlan.execute(anything())).thenResolve(subscriptionFixtures.trialWithCreditCard);

    await presenter.handlePlanSelect(anything());

    verify(view.hideLoader()).called();
  });

  it("check if introduced code is valid", async () => {
    when(checkSubscriptionCoupon.execute("aValidCode", anything())).thenResolve({
      name: "promo code",
      id: "promoCode",
    } as PromoCode);

    await presenter.checkPromoCode("aValidCode", anything());

    verify(checkSubscriptionCoupon.execute("aValidCode", anything())).calledAfter(view.showLoader());
    verify(view.showValidPromoCode(anything())).calledAfter(checkSubscriptionCoupon.execute("aValidCode", anything()));
    verify(view.hideLoader()).called();
  });

  it("show an error message if introduced code is invalid", async () => {
    when(checkSubscriptionCoupon.execute("anInvalidCode", anything())).thenThrow(
      new NotExpectedError("Invalid promo code")
    );

    await presenter.checkPromoCode("anInvalidCode", anything());

    verify(checkSubscriptionCoupon.execute("anInvalidCode", anything())).calledAfter(view.showLoader());
    verify(view.hideLoader()).called();
    verify(view.showInvalidPromoCode(anything())).calledAfter(view.hideLoader());
  });

  beforeEach(() => {
    view = mock<SubscriptionView>();
    getLocalizationCode = mock<GetLocalizationCode>();
    cancelSubscription = mock<CancelSubscription>();
    checkSubscriptionCoupon = mock<CheckSubscriptionCoupon>();
    getProduct = mock<GetProduct>();
    getUser = mock<GetUser>();
    getUserSubscriptionInfo = mock<GetUserSubscriptionInfo>();
    getTransactionsHistory = mock<GetTransactionsHistory>();
    trackAnalyticsPageView = mock<TrackAnalyticsPageView>();
    trackAnalyticsPaymentInfoEntered = mock<TrackAnalyticsPaymentInfoEntered>();
    updatePaymentInfo = mock<UpdatePaymentInfo>();
    updateUserSubscriptionPlan = mock<UpdateUserSubscriptionPlan>();
    presenter = createPresenter();
  });

  function createPresenter(): SubscriptionPresenter {
    return new SubscriptionPresenter(
      instance(view),
      instance(getLocalizationCode),
      instance(cancelSubscription),
      instance(getUser),
      instance(getUserSubscriptionInfo),
      instance(trackAnalyticsPageView),
      instance(updatePaymentInfo),
      instance(getTransactionsHistory),
      instance(updateUserSubscriptionPlan),
      instance(getProduct),
      instance(checkSubscriptionCoupon),
      instance(trackAnalyticsPaymentInfoEntered)
    );
  }

  let presenter: SubscriptionPresenter;
  let view: SubscriptionView;
  let getLocalizationCode: GetLocalizationCode;
  let cancelSubscription: CancelSubscription;
  let checkSubscriptionCoupon: CheckSubscriptionCoupon;
  let getProduct: GetProduct;
  let getUser: GetUser;
  let getUserSubscriptionInfo: GetUserSubscriptionInfo;
  let getTransactionsHistory: GetTransactionsHistory;
  let trackAnalyticsPageView: TrackAnalyticsPageView;
  let trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered;
  let updatePaymentInfo: UpdatePaymentInfo;
  let updateUserSubscriptionPlan: UpdateUserSubscriptionPlan;
});

import { PaymentInfoVM } from "../../components/Subscription/PaymentInfoVM";
import { PromoCodeVM } from "../../components/Subscription/PromoCodeVM";
import { SubscriptionInfoVM } from "../../components/Subscription/SubscriptionInfoVM";
import { TransactionRecordVM } from "../../components/Subscription/TransactionRecordVM";
import { ProductOptionValues } from "../../core/domain/products/Product";
import { PromoCode } from "../../core/domain/subscriptions/PromoCode";
import { SubscriptionInfo } from "../../core/domain/subscriptions/SubscriptionInfo";
import { SubscriptionPlan } from "../../core/domain/subscriptions/SubscriptionPlan";
import { TransactionRecord } from "../../core/domain/subscriptions/TransactionRecord";
import { User } from "../../core/domain/user/User";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";
import { CancelSubscription } from "../../core/useCases/CancelSubscription/CancelSubscription";
import { CheckSubscriptionCoupon } from "../../core/useCases/CheckSubscriptionCoupon/CheckSubscriptionCoupon";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import { GetTransactionsHistory } from "../../core/useCases/GetTransactionsHistory/GetTransactionsHistory";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { GetUserSubscriptionInfo } from "../../core/useCases/GetUserSubscriptionInfo/GetUserSubscriptionInfo";
import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { TrackAnalyticsPaymentInfoEntered } from "../../core/useCases/TrackAnalytics/PaymentInfoEntered/TrackAnalyticsPaymentInfoEntered";
import { UpdatePaymentInfo } from "../../core/useCases/UpdatePaymentInfo/UpdatePaymentInfo";
import { UpdateUserSubscriptionPlan } from "../../core/useCases/UpdateUserSubscriptionPlan/UpdateUserSubscriptionPlan";
import { formatPriceWithCurrencyAndDecimals } from "../../utils/formatUtils";

export interface SubscriptionView {
  showLoader();

  hideCancelDialog();

  hideLoader();

  loadUserData(userData: User);

  navigateToNewPath(path: string);

  showErrorMessage(message: string);

  showInvalidPromoCode(message: string);

  showPaymentInfo(paymentInfo: PaymentInfoVM | undefined);

  showSubscriptionInfo(subscriptionInfo: SubscriptionInfoVM | undefined);

  showSubscriptionPlans(subscriptionPlans: SubscriptionPlan[]);

  showTransactionRecords(transactionRecords: TransactionRecordVM[]);

  showSuccessMessage(message: string);

  showValidPromoCode(promoCode: PromoCodeVM);

  setLocalizationCode(localizationCode: string);

  updateSelectedPlanId(planId: string);
}

export class SubscriptionPresenter {
  private view: SubscriptionView;
  private getLocalizationCode: GetLocalizationCode;
  private cancelSubscription: CancelSubscription;
  private getUser: GetUser;
  private getUserSubscriptionInfo: GetUserSubscriptionInfo;
  private trackAnalyticsPageView: TrackAnalyticsPageView;
  private updatePaymentInfo: UpdatePaymentInfo;
  private getTransactionsHistory: GetTransactionsHistory;
  private updateUserSubscriptionPlan: UpdateUserSubscriptionPlan;
  private getProduct: GetProduct;
  private checkSubscriptionCoupon: CheckSubscriptionCoupon;
  private trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered;
  private subscriptionInfo?: SubscriptionInfo;

  constructor(
    view: SubscriptionView,
    getLocalizationCode: GetLocalizationCode,
    cancelSubscription: CancelSubscription,
    getUser: GetUser,
    getUserSubscriptionInfo: GetUserSubscriptionInfo,
    trackAnalyticsPageView: TrackAnalyticsPageView,
    updatePaymentInfo: UpdatePaymentInfo,
    getTransactionsHistory: GetTransactionsHistory,
    updateUserSubscriptionPlan: UpdateUserSubscriptionPlan,
    getProduct: GetProduct,
    checkSubscriptionCoupon: CheckSubscriptionCoupon,
    trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered
  ) {
    this.view = view;
    this.getLocalizationCode = getLocalizationCode;
    this.cancelSubscription = cancelSubscription;
    this.getUser = getUser;
    this.getUserSubscriptionInfo = getUserSubscriptionInfo;
    this.trackAnalyticsPageView = trackAnalyticsPageView;
    this.updatePaymentInfo = updatePaymentInfo;
    this.getTransactionsHistory = getTransactionsHistory;
    this.updateUserSubscriptionPlan = updateUserSubscriptionPlan;
    this.getProduct = getProduct;
    this.checkSubscriptionCoupon = checkSubscriptionCoupon;
    this.trackAnalyticsPaymentInfoEntered = trackAnalyticsPaymentInfoEntered;
  }

  start = async () => {
    this.view.setLocalizationCode(this.getLocalizationCode.execute());
    this.view.showLoader();
    try {
      await this.trackAnalyticsPageView.execute("Subscription");
      await this.initializeUserData();
      await this.initializeSubscriptionInfo();
      await this.initializeTransactionHistory();
    } catch (e: any) {
      if (!(e instanceof UserNotLoggedInError)) this.view.showErrorMessage(e.message);
      this.view.navigateToNewPath("login");
    }
    this.view.hideLoader();
  };

  cancelUserSubscription = async () => {
    this.view.showLoader();
    this.subscriptionInfo = await this.cancelSubscription.execute();
    this.view.showSubscriptionInfo(this.subscriptionInfoToSubscriptionInfoVM());

    this.view.showSuccessMessage("Subscription Cancelled Successfully");
    this.view.hideLoader();
    this.view.hideCancelDialog();
  };

  updatePayment = async (creditCardToken: string, coupon?: string) => {
    try {
      this.view.showLoader();
      const isInAppUser = this.subscriptionInfo!.status === "trialing" && !this.subscriptionInfo!.paymentInfo.number;
      const successMessage = isInAppUser
        ? "Welcome To The Crew! You Will Be Charged At The End Of Your Trial."
        : "Payment Info Updated Successfully!";
      this.subscriptionInfo = await this.updatePaymentInfo.execute(creditCardToken, isInAppUser, coupon);
      this.view.showSubscriptionInfo(this.subscriptionInfoToSubscriptionInfoVM());
      this.view.showPaymentInfo(this.subscriptionInfo.paymentInfo);
      this.view.showSuccessMessage(successMessage);
      this.clearSubscriptionPlans();
      this.view.hideLoader();
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showErrorMessage(error.message);
    }
  };

  handlePlanSelect = async (planId: string) => {
    try {
      this.view.showLoader();
      this.subscriptionInfo = await this.updateUserSubscriptionPlan.execute(planId);
      this.view.showSubscriptionInfo(this.subscriptionInfoToSubscriptionInfoVM());
      this.view.updateSelectedPlanId(planId);
      this.view.hideLoader();
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showErrorMessage(error.message);
    }
  };

  checkPromoCode = async (code: string, planType: string) => {
    try {
      this.view.showLoader();
      const promoCode = await this.checkSubscriptionCoupon.execute(code, planType);
      this.view.showValidPromoCode(this.promoCodeToPromoCodeVM(promoCode, code));
      this.view.hideLoader();
    } catch (error: any) {
      this.view.hideLoader();
      this.view.showInvalidPromoCode(error.message);
    }
  };

  onPaymentInfoEntered = () => this.trackAnalyticsPaymentInfoEntered.execute("card");

  private isAppTrialUser = () =>
    this.subscriptionInfo!.status === "trialing" && !this.subscriptionInfo!.paymentInfo.number;

  private initializeSubscriptionInfo = async () => {
    this.subscriptionInfo = await this.getUserSubscriptionInfo.execute();
    if (!this.subscriptionInfo) return;

    this.view.showSubscriptionInfo(this.subscriptionInfoToSubscriptionInfoVM());
    this.view.updateSelectedPlanId(this.subscriptionInfo.id);
    if (this.subscriptionInfo.paymentInfo.number) this.view.showPaymentInfo(this.subscriptionInfo.paymentInfo);
    if (this.isAppTrialUser()) await this.initializeSubscriptionPlans();
  };

  private initializeSubscriptionPlans = async () => {
    const subscription = await this.getProduct.execute("all-access");
    const plans = subscription.options.find((option) => ["Plan", "Subscription"].includes(option.name!))?.values;
    this.view.showSubscriptionPlans(plans?.map(this.productOptionValueToSubscriptionPlan) || []);
  };

  private initializeTransactionHistory = async () => {
    const transactionsHistory = await this.getTransactionsHistory.execute();
    this.view.showTransactionRecords(transactionsHistory.map(this.transactionRecordToTransactionRecordVM));
  };

  private initializeUserData = async () => this.view.loadUserData(await this.getUser.execute());

  private clearSubscriptionPlans = () => this.view.showSubscriptionPlans([]);

  private dateToStringFormat = (date: Date) =>
    `${date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${
      date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
    }/${date.getFullYear()}`;

  private promoCodeToPromoCodeVM = (promoCode: PromoCode, code: string): PromoCodeVM => ({
    id: promoCode.id,
    code,
    name: promoCode.name,
    discount: formatPriceWithCurrencyAndDecimals(promoCode.discount || 0, "us-EN"),
    total: formatPriceWithCurrencyAndDecimals(promoCode.total || 0, "us-EN"),
  });

  private subscriptionInfoToSubscriptionInfoVM = (): SubscriptionInfoVM => ({
    active: this.subscriptionInfo!.active,
    cancelDate: !this.subscriptionInfo!.cancelDate
      ? "-"
      : this.dateToStringFormat(new Date(this.subscriptionInfo!.cancelDate || "")),
    id: this.subscriptionInfo!.id,
    klarna: this.subscriptionInfo!.klarna,
    name: this.subscriptionInfo!.name,
    nextBillDate:
      this.subscriptionInfo!.nextBillDate === "-"
        ? "-"
        : this.dateToStringFormat(new Date(this.subscriptionInfo!.nextBillDate || "")),
    purchaseDate: !this.subscriptionInfo!.purchaseDate
      ? "-"
      : this.dateToStringFormat(new Date(this.subscriptionInfo!.purchaseDate || "")),
    pricing: this.subscriptionInfo!.pricing,
    status: this.parseSubscriptionStatus(),
    planType: this.subscriptionInfo!.planType,
    paymentInfo: this.subscriptionInfo!.paymentInfo,
  });

  private transactionRecordToTransactionRecordVM = (record: TransactionRecord): TransactionRecordVM => ({
    type: record.type,
    amount: formatPriceWithCurrencyAndDecimals(record.amount, "us-EN"),
    date: this.dateToStringFormat(new Date(record.date)),
  });

  private productOptionValueToSubscriptionPlan = (productOptionValue: ProductOptionValues): SubscriptionPlan => ({
    id: productOptionValue.stripePlanId!,
    name: productOptionValue.name,
    description: productOptionValue.description,
    price: formatPriceWithCurrencyAndDecimals(productOptionValue.price, "us-EN"),
    isPopular: productOptionValue.name.toLowerCase().includes("yearly"),
  });

  private parseSubscriptionStatus = (): string => {
    if (this.subscriptionInfo!.status === "incomplete_expired") return "canceled";
    if (this.subscriptionInfo!.status === "past_due") return "payment failed";
    return this.subscriptionInfo!.status;
  };
}

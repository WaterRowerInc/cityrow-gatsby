// noinspection JSUnusedGlobalSymbols

import { navigate } from "gatsby";
import React from "react";
import DialogModal from "../components/DialogModal/DialogModal";
import FlashMessage, { FlashMessageVM } from "../components/FlashMessage/FlashMessage";
import Impact from "../components/Impact/Impact";
import Loader from "../components/Loader/Loader";
import ProfileTopBar from "../components/Profile/ProfileTopBar";
import { PaymentInfoVM } from "../components/Subscription/PaymentInfoVM";
import { PromoCodeVM } from "../components/Subscription/PromoCodeVM";
import { SubscriptionInfoSection } from "../components/Subscription/SubscriptionInfoSection";
import { SubscriptionInfoVM } from "../components/Subscription/SubscriptionInfoVM";
import SubscriptionManager from "../components/Subscription/SubscriptionManager";
import "../components/Subscription/SubscriptionPage.scss";
import { TransactionHistorySection } from "../components/Subscription/TransactionHistorySection";
import { TransactionRecordVM } from "../components/Subscription/TransactionRecordVM";
import { Card } from "../core/domain/payment/Card";
import { SubscriptionPlan } from "../core/domain/subscriptions/SubscriptionPlan";
import { User } from "../core/domain/user/User";
import { PresenterFactory } from "../presenters/PresenterFactory";
import { SubscriptionPresenter, SubscriptionView } from "../presenters/Subscription/SubscriptionPresenter";

const SECONDS_TO_RELOAD_PAGE = 4000;

class SubscriptionPage extends React.Component<State> implements SubscriptionView {
  state: State = {
    flashMessage: {
      message: "",
      type: "none",
    },
    invalidPromoCodeText: "",
    isCancelDialogVisible: false,
    isLoading: false,
    isUpdatePaymentFormVisible: false,
    resubscribeUrl: "",
    transactionRecords: [],
    localizationCode: "",
    selectedPlanId: "",
    subscriptionPlans: [],
  };
  presenter: SubscriptionPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.subscription(this);
  }

  componentDidMount = async () => {
    await this.presenter.start();
    this.setState({
      resubscribeUrl: `/${this.state.localizationCode}/products/app`,
    });
  };

  cancelSubscription = async () => await this.presenter.cancelUserSubscription();

  checkPromoCode = async (code) => {
    const { subscriptionInfo } = this.state;

    await this.presenter.checkPromoCode(code, subscriptionInfo!.planType);
  };

  clearPromoCode = () => this.setState({ promoCode: null });

  handlePlanSelect = async (planId: string) => {
    await this.presenter.handlePlanSelect(planId);

    const { promoCode, subscriptionInfo } = this.state;
    if (promoCode) await this.presenter.checkPromoCode(promoCode.code, subscriptionInfo!.planType);
  };

  hideCancelDialog = () => this.setState({ isCancelDialogVisible: false });

  hideLoader = () => this.setState({ isLoading: false });

  loadUserData = (userData: User) => this.setState({ userData });

  navigateToNewPath = (path: string) => navigate(`/${this.state.localizationCode}/${path}`);

  showCancelDialog = () => this.setState({ isCancelDialogVisible: true });

  showErrorMessage = (message: string) => this.setState({ flashMessage: { message, type: "error" } });

  showInvalidPromoCode = (message: string) => this.setState({ invalidPromoCodeText: message, promoCode: null });

  showLoader = () => this.setState({ isLoading: true });

  setCreditCardInfo = (creditCardInfo: Card) => {
    this.presenter.onPaymentInfoEntered();
    this.setState({ creditCardInfo });
  };

  clearCreditCardInfo = () => this.setState({ creditCardInfo: null });

  showPaymentInfo = (paymentInfo: PaymentInfoVM) => this.setState({ paymentInfo });

  showSubscriptionInfo = (subscriptionInfo: SubscriptionInfoVM) => this.setState({ subscriptionInfo });

  showSubscriptionPlans = (subscriptionPlans: SubscriptionPlan[]) => this.setState({ subscriptionPlans });

  showValidPromoCode = (promoCode: PromoCodeVM) => this.setState({ invalidPromoCodeText: "", promoCode });

  setLocalizationCode = (localizationCode: string) => this.setState({ localizationCode });

  showTransactionRecords = (transactionRecords: TransactionRecordVM[]) => {
    this.setState({ transactionRecords });
  };

  showSuccessMessage = (message: string) =>
    this.setState(
      {
        flashMessage: {
          message,
          type: "none",
        },
        isUpdatePaymentFormVisible: false,
      },
      () => {
        this.setState({ flashMessage: { message, type: "success" } });
        setTimeout(() => {
          this.setState({ flashMessage: { message: "", type: "none" } });
        }, SECONDS_TO_RELOAD_PAGE);
      }
    );

  toggleUpdatePaymentForm = () => this.setState({ isUpdatePaymentFormVisible: !this.state.isUpdatePaymentFormVisible });

  updatePaymentInfo = async () => {
    const { creditCardInfo, promoCode } = this.state;
    if (!creditCardInfo) return;
    await this.presenter.updatePayment(creditCardInfo?.token, promoCode?.id);
    this.setState({ creditCardInfo: null, promoCode: null });
  };

  updateSelectedPlanId = async (selectedPlanId: string) => this.setState({ selectedPlanId });

  render = () => {
    const {
      creditCardInfo,
      flashMessage,
      isCancelDialogVisible,
      isLoading,
      invalidPromoCodeText,
      isUpdatePaymentFormVisible,
      paymentInfo,
      promoCode,
      localizationCode,
      resubscribeUrl,
      selectedPlanId,
      subscriptionInfo,
      userData,
      subscriptionPlans,
      transactionRecords,
    } = this.state;
    return (
      <div className='subscription-page__'>
        <Loader visible={isLoading} />
        <ProfileTopBar
          localizationCode={localizationCode}
          name={`${userData?.firstName} ${userData?.lastName}`}
          dateJoined={userData?.dateJoined || ""}
          page='subscription'
        />
        <FlashMessage message={flashMessage.message} type={flashMessage.type} hasSubNav />
        {isCancelDialogVisible && (
          <DialogModal
            onDismiss={this.hideCancelDialog}
            onConfirm={this.cancelSubscription}
            title='Cancel Subscription'
            dismissText='GO BACK'
            confirmText='CONFIRM CANCEL'
            subtitle='Are you sure you want to cancel your subscription?'
          />
        )}
        <div className='subscription-page__container__'>
          <div className='subscription-page__container__content-box__'>
            <SubscriptionManager
              checkPromoCode={this.checkPromoCode}
              clearPromoCode={this.clearPromoCode}
              creditCardInfo={creditCardInfo}
              selectedPlanId={selectedPlanId}
              subscriptionPlans={subscriptionPlans}
              invalidPromoCodeText={invalidPromoCodeText}
              isUpdatePaymentFormVisible={isUpdatePaymentFormVisible}
              onPlanSelect={this.handlePlanSelect}
              onClearPaymentMethod={this.clearCreditCardInfo}
              onCreditCardError={(error) => this.showErrorMessage(error)}
              paymentInfo={paymentInfo}
              promoCode={promoCode}
              setCreditCardInfo={this.setCreditCardInfo}
              toggleUpdatePaymentForm={this.toggleUpdatePaymentForm}
              updatePaymentInfo={this.updatePaymentInfo}
            />
            <h1 className='subscription-page__container__content-box__title'>My Subscriptions</h1>
            <div className='subscription-page__container__content-box__title-border'>.</div>
            <SubscriptionInfoSection
              resubscribeUrl={resubscribeUrl}
              cancelSubscriptionAction={this.showCancelDialog}
              info={subscriptionInfo}
            />
            {subscriptionInfo?.status !== "trialing" && (
              <TransactionHistorySection transactionRecords={transactionRecords} />
            )}
          </div>
        </div>
        <Impact />
      </div>
    );
  };
}

// noinspection JSUnusedGlobalSymbols
export default SubscriptionPage;

interface State {
  creditCardInfo?: Card;
  flashMessage: FlashMessageVM;
  invalidPromoCodeText: string;
  isCancelDialogVisible: boolean;
  isLoading: boolean;
  isUpdatePaymentFormVisible: boolean;
  paymentInfo?: PaymentInfoVM;
  promoCode?: PromoCodeVM;
  resubscribeUrl: string;
  subscriptionInfo?: SubscriptionInfoVM;
  userData?: User;
  transactionRecords?: TransactionRecordVM[];
  localizationCode: string;
  selectedPlanId: string;
  subscriptionPlans: SubscriptionPlan[];
}

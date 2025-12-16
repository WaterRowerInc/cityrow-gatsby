import React from "react";
import Loader from "../components/Loader/Loader";
import "../components/Checkout/CheckoutPage.scss";
import { CartVM } from "../components/Cart/CartVM";
import { CheckoutPresenter, CheckoutView } from "../presenters/Checkout/CheckoutPresenter";
import { PresenterFactory } from "../presenters/PresenterFactory";
import FlashMessage, { FlashMessageVM } from "../components/FlashMessage/FlashMessage";
import PaymentForm from "../components/Checkout/PaymentForm/PaymentForm";
import AddressForm from "../components/Checkout/AddressForm/AddressForm";
import AccountForm from "../components/Checkout/AccountForm/AccountForm";
import DeliveryForm from "../components/Checkout/DeliveryForm/DeliveryForm";
import { ShippingOption } from "../core/domain/orders/ShippingOption";
import { ShippingOptionVM } from "../components/Checkout/DeliveryForm/ShippingOptionVM";
import Country from "../core/domain/localization/Country";
import OrderSummary from "../components/Checkout/OrderSummary/OrderSummary";
import StateVM from "../core/domain/localization/StateVM";
import KlarnaWidget from "../components/Checkout/PaymentForm/KlarnaWidget";
import { KlarnaSession } from "../core/domain/payment/KlarnaSession";
import { Card } from "../core/domain/payment/Card";
import { AddressVM } from "../components/Checkout/AddressForm/AddressVM";
import DialogModal from "../components/DialogModal/DialogModal";
import Impact from "../components/Impact/Impact";

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    Klarna: any;
  }
}

class CheckoutPage extends React.Component<State> implements CheckoutView {
  state: State = {
    accountFormVisible: true,
    address: "",
    apartment: "",
    city: "",
    checkoutButtonText: "COMPLETE CHECKOUT",
    confirmPassword: "",
    country: {
      key: "",
      value: "",
      text: "",
    },
    deliveryOption: "",
    firstName: "",
    flashMessage: {
      message: "",
      type: "none",
    },
    isAccountFormOk: false,
    isAddressFormOk: false,
    isCardNotCompleted: false,
    isKlarnaPaymentMethodVisible: true,
    isLegalCopyVisible: true,
    isLoadingShippingOptions: false,
    isLoading: false,
    isPaymentOk: false,
    isPurchaseInvalid: false,
    isSubscriptionPurchaseNotAllowed: false,
    isSubscriptionOnlyPurchase: false,
    isSummarySticky: false,
    isUserRegisteredModalVisible: false,
    klarnaTotalPrice: "$0",
    lastName: "",
    paymentMethod: "card",
    phone: "",
    place: null,
    postalCode: "",
    shippingOptions: [],
    showKlarnaWidget: false,
    showDelivery: false,
    state: {
      key: "",
      value: "",
      text: "",
    },
    stateList: [],
    submitted: false,
    totalPrice: "",
    userEmail: "",
  };
  accountEmailRef: any;
  userEmailRef: any;
  cardElementRef: any;
  presenter: CheckoutPresenter;

  constructor(props) {
    super(props);
    const presenters = new PresenterFactory();
    this.presenter = presenters.checkout(this);
    this.userEmailRef = React.createRef();
    this.accountEmailRef = React.createRef();
    this.cardElementRef = React.createRef();
  }

  componentDidMount = async () => {
    await this.presenter.start();
    window.Klarna = window.Klarna || [];
    window.KlarnaOnsiteService = window.KlarnaOnsiteService || [];
    window.KlarnaOnsiteService.push({ eventName: "refresh-placements" });
    window.addEventListener("scroll", this.handleScroll);
    window.scrollTo(0, 0);
  };

  checkout = async () => {
    const {
      accountFormVisible,
      isCardNotCompleted,
      isAccountFormOk,
      isAddressFormOk,
      isPaymentOk,
      isSubscriptionOnlyPurchase,
      paymentMethod,
      submitted,
    } = this.state;

    if (!submitted) this.setState({ submitted: true });
    if (paymentMethod !== "klarna" && !isPaymentOk) return this.setState({ isCardNotCompleted: true });
    const canCheckout =
      (isAddressFormOk || isSubscriptionOnlyPurchase) &&
      (isAccountFormOk || !accountFormVisible) &&
      (isPaymentOk || paymentMethod === "klarna");
    if (!canCheckout) return;
    if (isCardNotCompleted) this.setState({ isCardNotCompleted: false });
    const checkoutForm = isSubscriptionOnlyPurchase ? this.getCheckoutFormWithoutAddress() : this.getCheckoutForm();
    await this.presenter.checkout(checkoutForm);
  };

  private handleScroll = () => {
    const { discountsPositionFromTop, isSummarySticky } = this.state;
    if (!discountsPositionFromTop) {
      const summaryContainer = document.getElementById("checkout-summary-desktop")?.getBoundingClientRect().top;
      const discountsContainer = document.getElementById("checkout-summary-discounts")?.getBoundingClientRect().top;
      const distance = (discountsContainer || 0) - (summaryContainer || 0) - 60;
      if (distance > 0) {
        this.setState({
          discountsPositionFromTop: (discountsContainer || 0) - (summaryContainer || 0) - 60,
        });
      }
      return;
    }
    if (isSummarySticky !== window.scrollY > discountsPositionFromTop)
      this.setState({ isSummarySticky: window.scrollY > discountsPositionFromTop });
  };

  hideKlarnaPaymentMethod = () => this.setState({ isKlarnaPaymentMethodVisible: false });

  hideLegalCopy = () => this.setState({ isLegalCopyVisible: false });

  hideLoader = () => this.setState({ isLoading: false });

  hideUpgradePlanMessage = () => this.setState({ upgradePlanMessageVisible: false });

  hideShippingLoader = () => this.setState({ isLoadingShippingOptions: false });

  hideDeliveryForm = () => this.setState({ showDelivery: false });

  navigateToNewPath = async (path: string, replace: string) =>
    (window.location.href = `${window.location.href.split(replace)?.[0]}${path}`);

  setAccountFormVisible = (accountFormVisible: boolean) => this.setState({ accountFormVisible });

  setIsPurchaseInvalid = (isPurchaseInvalid: boolean) => this.setState({ isPurchaseInvalid });

  setIsSubscriptionPurchaseNotAllowed = (isSubscriptionPurchaseNotAllowed: boolean) =>
    this.setState({ isSubscriptionPurchaseNotAllowed });

  showCountry = (country: Country) => this.setState({ country });

  showDeliveryForm = () => this.setState({ showDelivery: true });

  showErrorMessage = (message: string) =>
    this.updateFormValue("flashMessage", {
      message,
      type: "error",
    });

  showKlarnaWidget = (klarnaSession: KlarnaSession) => {
    window.Klarna.Payments.init({ client_token: klarnaSession.token });
    window.Klarna.Payments.load(
      { container: "#klarna-payments-container", payment_method_category: klarnaSession.paymentMethods },
      (response) => {
        if (response.show_form)
          return this.setState({
            showKlarnaWidget: true,
            isLoading: false,
            klarnaSession: klarnaSession,
          });

        this.hideLoader();
        this.showErrorMessage("Payment Method not available");
      }
    );
  };

  setKlarnaTotalPrice = (klarnaTotalPrice: string) => this.setState({ klarnaTotalPrice });

  showLoader = () => this.setState({ isLoading: true });

  resetCardInfo = () => {
    this.cardElementRef.current.clear();
    this.updateFormValue("isPaymentOk", false);
  };

  showShippingLoader = () => this.setState({ isLoadingShippingOptions: true });

  showStateOptions = (stateList: StateVM[]) => this.setState({ stateList });

  showSuccessMessage = (message: string) =>
    this.setState(
      {
        flashMessage: {
          message,
          type: "none",
        },
      },
      () =>
        this.updateFormValue("flashMessage", {
          message,
          type: "success",
        })
    );

  showUpgradePlanMessage = () => this.setState({ upgradePlanMessageVisible: true });

  showUserRegisteredModal = () => this.setState({ isUserRegisteredModalVisible: true });

  setIsSubscriptionOnlyPurchase = () => this.setState({ isSubscriptionOnlyPurchase: true });

  updateCheckoutButtonText = (checkoutButtonText: string) => this.setState({ checkoutButtonText });

  updateShippingOptions = (shippingOptions: ShippingOptionVM[]) =>
    this.setState(
      { shippingOptions },
      () => shippingOptions.length && this.handleSelectShippingOption(shippingOptions[0].id)
    );

  updateTotalPrice(totalPrice: string) {
    this.setState({ totalPrice });
  }

  private authorizePayment = () => {
    const { klarnaSession } = this.state;
    window.Klarna.Payments.authorize({ payment_method_category: klarnaSession!.paymentMethods }, async (response) => {
      if (!response.approved) return;
      this.presenter.onPaymentInfoEntered("klarna").then();
      await this.presenter.submitOrder({
        ...this.getCheckoutForm(),
        authorizationToken: response.authorization_token,
        klarnaSession,
      });
    });
  };

  private getCheckoutForm = () => ({
    address: this.state.address,
    apartment: this.state.apartment,
    accountEmail: this.state.userEmail,
    card: this.state.card,
    city: this.state.city,
    contactMe: this.state.contactMe,
    country: this.state.country.key,
    firstName: this.state.firstName,
    lastName: this.state.lastName,
    password: this.state.password,
    paymentMethod: this.state.paymentMethod,
    phone: this.state.phone,
    postalCode: this.state.postalCode,
    state: this.state.state.key,
    userEmail: this.state.userEmail,
  });

  private getCheckoutFormWithoutAddress = () => ({
    accountEmail: this.state.userEmail,
    card: this.state.card,
    contactMe: this.state.contactMe,
    firstName: this.state.firstName,
    lastName: this.state.lastName,
    password: this.state.password,
    paymentMethod: this.state.paymentMethod,
    phone: this.state.phone,
    userEmail: this.state.userEmail,
  });

  private hideUserRegisteredModal = () => this.setState({ isUserRegisteredModalVisible: false });

  private onAddressUpdate = async (address: AddressVM) => {
    await this.presenter.onUpdateAddress(address);
    this.presenter.onShipmentInfoEntered(this.state.paymentMethod).then();
  };

  private replicateEmailValues = (key, value) => {
    if (value?.length) {
      this.userEmailRef.current.value = value;
      if (this.state.accountFormVisible) this.accountEmailRef.current.value = value;
    }
  };

  private handleSelectShippingOption = async (shippingOptionId: string | null) => {
    this.updateFormValue("deliveryOption", shippingOptionId);
    await this.presenter.onUpdateShippingOption({ id: shippingOptionId });
    this.presenter.onShipmentInfoEntered(this.state.paymentMethod).then();
  };

  private updateFormValue = (key, value, callback?) => this.setState({ [key]: value }, callback);

  render = () => {
    const {
      accountFormVisible,
      city,
      checkoutButtonText,
      confirmPassword,
      country,
      discountsPositionFromTop,
      flashMessage,
      isCardNotCompleted,
      isKlarnaPaymentMethodVisible,
      isLegalCopyVisible,
      isLoading,
      isLoadingShippingOptions,
      isPurchaseInvalid,
      isSubscriptionPurchaseNotAllowed,
      isSubscriptionOnlyPurchase,
      isSummarySticky,
      klarnaTotalPrice,
      isUserRegisteredModalVisible,
      password,
      paymentMethod,
      place,
      postalCode,
      shippingOptions,
      showKlarnaWidget,
      showDelivery,
      state,
      submitted,
      stateList,
      totalPrice,
      upgradePlanMessageVisible,
    } = this.state;
    const { userEmailRef, accountEmailRef } = this;
    return (
      <div className={"checkout-page__"}>
        {isUserRegisteredModalVisible && (
          <DialogModal
            title=''
            onDismiss={this.hideUserRegisteredModal}
            dismissText='GOT IT'
            confirmText='LOGIN'
            onConfirm={() => this.navigateToNewPath("login", "checkout")}
            subtitle='You already have a subscription under this email. To register for a new account, please use a different email address.'
          />
        )}
        {isPurchaseInvalid && (
          <DialogModal
            title=''
            subtitle={
              "You must have a subscription to use with you CITYROW rower. Choose your subscription or log into your CITYROW account."
            }
            dismissText={"LOGIN"}
            confirmText={"CONTINUE"}
            onDismiss={() => this.navigateToNewPath("/login", "/checkout")}
            onConfirm={() => this.navigateToNewPath("/products/app", "/checkout")}
          />
        )}
        {isSubscriptionPurchaseNotAllowed && (
          <DialogModal
            title=''
            subtitle={"You cannot have more than one subscription associated with one email account."}
            dismissText={"CONTINUE"}
            onDismiss={() => this.setIsSubscriptionPurchaseNotAllowed(false)}
          />
        )}
        <FlashMessage message={flashMessage.message} type={flashMessage.type} />
        <div className='checkout-page__container__'>
          <div className='checkout-page__container__flow-container__'>
            <AddressForm
              isSubscriptionOnlyPurchase={isSubscriptionOnlyPurchase}
              submitted={submitted}
              city={city}
              country={country}
              countryOptions={[country]}
              place={place}
              postalCode={postalCode}
              replicateEmailValues={this.replicateEmailValues}
              state={state}
              stateOptions={stateList}
              updateEmail={this.presenter.onUpdateEmail}
              updateFormValue={this.updateFormValue}
              updateShippingOptions={this.onAddressUpdate}
              userEmailRef={userEmailRef}
            />
            {showDelivery && (
              <DeliveryForm
                isLoading={isLoadingShippingOptions}
                shippingOptions={shippingOptions}
                onSelectShippingOption={this.handleSelectShippingOption}
              />
            )}
            <AccountForm
              accountEmailRef={accountEmailRef}
              password={password}
              confirmPassword={confirmPassword}
              updateFormValue={this.updateFormValue}
              visible={accountFormVisible}
            />
            <PaymentForm
              defaultPaymentMethod={paymentMethod}
              isCardNotCompleted={isCardNotCompleted}
              onCreditCardError={(error) => this.showErrorMessage(error)}
              onCreditCardInputReady={(cardElement) => (this.cardElementRef.current = cardElement)}
              klarnaTotalPrice={klarnaTotalPrice}
              isKlarnaPaymentMethodVisible={false}
              onSelect={this.presenter.onPaymentMethodChange}
              onCreditCardComplete={() => this.presenter.onPaymentInfoEntered("card")}
              updateFormValue={this.updateFormValue}
              upgradePlanMessageVisible={!!upgradePlanMessageVisible}
            />
            <KlarnaWidget
              onContinue={this.authorizePayment}
              visible={false}
              onClose={() => this.setState({ showKlarnaWidget: false })}
            />
          </div>
          <OrderSummary
            checkout={this.checkout}
            checkoutButtonText={checkoutButtonText}
            isKlarnaPayment={paymentMethod === "klarna"}
            isLegalCopyVisible={isLegalCopyVisible}
            isSticky={isSummarySticky}
            positionFromTop={discountsPositionFromTop}
            totalPrice={paymentMethod === "klarna" ? klarnaTotalPrice : totalPrice}
          />
        </div>
        <Loader visible={isLoading} />
        <div className='checkout-page__footer-waves' />
        <Impact />
      </div>
    );
  };
}

// noinspection JSUnusedGlobalSymbols
export default CheckoutPage;

interface State {
  accountEmail?: string;
  accountFormVisible: boolean;
  address: string;
  apartment: string;
  card?: Card;
  cart?: CartVM;
  checkoutButtonText: string;
  city: string;
  confirmPassword: string;
  contactMe?: boolean;
  country: Country;
  discountsPositionFromTop?: number;
  deliveryOption: string;
  firstName: string;
  flashMessage: FlashMessageVM;
  isAccountFormOk: boolean;
  isAddressFormOk: boolean;
  isCardNotCompleted: boolean;
  isKlarnaPaymentMethodVisible: boolean;
  isLegalCopyVisible: boolean;
  isLoadingShippingOptions: boolean;
  isLoading: boolean;
  isPaymentOk: boolean;
  isPurchaseInvalid: boolean;
  isSubscriptionPurchaseNotAllowed: boolean;
  isSubscriptionOnlyPurchase: boolean;
  isSummarySticky: boolean;
  isUserRegisteredModalVisible: boolean;
  klarnaSession?: KlarnaSession;
  klarnaTotalPrice: string;
  lastName: string;
  password?: string;
  paymentMethod: string;
  phone: string;
  place: any;
  postalCode: string;
  shippingOptions: ShippingOption[];
  showKlarnaWidget: boolean;
  showDelivery: boolean;
  state: StateVM;
  stateList: StateVM[];
  submitted: boolean;
  totalPrice: string;
  userEmail: string;
  upgradePlanMessageVisible?: boolean;
}

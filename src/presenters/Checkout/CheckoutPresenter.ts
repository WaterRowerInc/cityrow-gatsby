import { AddressVM } from "../../components/Checkout/AddressForm/AddressVM";
import { CheckoutFormVM } from "../../components/Checkout/CheckoutFormVM";
import { ShippingOptionVM } from "../../components/Checkout/DeliveryForm/ShippingOptionVM";
import { EmailAlreadyRegisteredError } from "../../core/domain/auth/EmailAlreadyRegisteredError";
import Country from "../../core/domain/localization/Country";
import StateVM from "../../core/domain/localization/StateVM";
import { Cart } from "../../core/domain/orders/Cart";
import { CartItem, Discount } from "../../core/domain/orders/EcommerceCart";
import { ShippingOption } from "../../core/domain/orders/ShippingOption";
import { UpdateCartRequest } from "../../core/domain/orders/UpdateCartRequest";
import { CreateCardPaymentRequest } from "../../core/domain/payment/CreateCardPaymentRequest";
import { KlarnaSession } from "../../core/domain/payment/KlarnaSession";
import { KlarnaItemsRequest, KlarnaSessionRequest } from "../../core/domain/payment/KlarnaSessionRequest";
import { User } from "../../core/domain/user/User";
import { UserNotLoggedInError } from "../../core/domain/user/UserNotLoggedInError";
import { CreateCardPayment } from "../../core/useCases/CreateCardPayment/CreateCardPayment";
import { CreateKlarnaSession } from "../../core/useCases/CreateKlarnaToken/CreateKlarnaSession";
import { CreateOrder } from "../../core/useCases/CreateOrder/CreateOrder";
import { FindCountryByCode } from "../../core/useCases/FindCountryByCode/FindCountryByCode";
import { GetAllStatesByCountry } from "../../core/useCases/GetAllStatesByCountry/GetAllStatesByCountry";
import { GetCart } from "../../core/useCases/GetCart/GetCart";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetShippingOptions } from "../../core/useCases/GetShippingServices/GetShippingOptions";
import { GetUser } from "../../core/useCases/GetUser/GetUser";
import { GetUserSubscriptionInfo } from "../../core/useCases/GetUserSubscriptionInfo/GetUserSubscriptionInfo";
import { LogIn } from "../../core/useCases/LogIn/LogIn";
import { UpdateCartSubscriptionPlan } from "../../core/useCases/ReplaceMonthlySubscriptionForAnnual/UpdateCartSubscriptionPlan";
import { TrackAnalyticsCheckoutStarted } from "../../core/useCases/TrackAnalytics/CheckoutStarted/TrackAnalyticsCheckoutStarted";
import { TrackAnalyticsPaymentInfoEntered } from "../../core/useCases/TrackAnalytics/PaymentInfoEntered/TrackAnalyticsPaymentInfoEntered";
import { TrackAnalyticsShipmentInfoEntered } from "../../core/useCases/TrackAnalytics/ShipmentInfoEntered/TrackAnalyticsShipmentInfoEntered";
import { UpdateCart } from "../../core/useCases/UpdateCart/UpdateCart";
import { UpdateLocale } from "../../core/useCases/UpdateLocale/UpdateLocale";
import { formatPriceWithCurrency, formatPriceWithCurrencyAndDecimals } from "../../utils/formatUtils";

export interface CheckoutView {
  setAccountFormVisible(isVisible: boolean);

  hideDeliveryForm();

  hideKlarnaPaymentMethod();

  hideLegalCopy();

  hideLoader();

  hideShippingLoader();

  hideUpgradePlanMessage();

  navigateToNewPath(path: string, replace: string);

  resetCardInfo();

  setIsPurchaseInvalid(isPurchaseInvalid: boolean);

  setIsSubscriptionPurchaseNotAllowed(isSubscriptionPurchaseNotAllowed: boolean);

  showCountry(country: Country);

  showDeliveryForm();

  showErrorMessage(message: string);

  showLoader();

  showKlarnaWidget(klarnaSession: KlarnaSession);

  setKlarnaTotalPrice(klarnaTotalPrice: string);

  showShippingLoader();

  showStateOptions(states: StateVM[]);

  showSuccessMessage(message: string);

  showUpgradePlanMessage();

  showUserRegisteredModal();

  setIsSubscriptionOnlyPurchase();

  updateCheckoutButtonText(string: string);

  updateShippingOptions(shippingOptions: ShippingOptionVM[]);

  updateTotalPrice(totalPrice: string);
}

export class CheckoutPresenter {
  private view: CheckoutView;
  private createCardPayment: CreateCardPayment;
  private createKlarnaSession: CreateKlarnaSession;
  private createOrder: CreateOrder;
  private findCountryByCode: FindCountryByCode;
  private getAllStatesForCountry: GetAllStatesByCountry;
  private getCart: GetCart;
  private getLocalizationCode: GetLocalizationCode;
  private getShippingOptions: GetShippingOptions;
  private getUserSubscriptionInfo: GetUserSubscriptionInfo;
  private getUser: GetUser;
  private logIn: LogIn;
  private trackAnalyticsCheckoutStarted: TrackAnalyticsCheckoutStarted;
  private trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered;
  private trackAnalyticsShipmentInfoEntered: TrackAnalyticsShipmentInfoEntered;
  private updateCart: UpdateCart;
  private updateLocale: UpdateLocale;
  private updateCartSubscriptionPlan: UpdateCartSubscriptionPlan;
  private cart?: Cart;
  private hasSubscriptionForcedToChange?: boolean;
  private klarnaSession?: KlarnaSession;
  private locale: string;
  private path: string;
  private user: User | null;
  private cartItems: number;
  private oldSubscriptionPlan?: string;

  constructor(
    view: CheckoutView,
    createCardPayment: CreateCardPayment,
    createKlarnaSession: CreateKlarnaSession,
    createOrder: CreateOrder,
    findCountryByCode: FindCountryByCode,
    getAllStatesForCountry: GetAllStatesByCountry,
    getCart: GetCart,
    getLocalizationCode: GetLocalizationCode,
    getShippingServices: GetShippingOptions,
    getUser: GetUser,
    getUserSubscriptionInfo: GetUserSubscriptionInfo,
    logIn: LogIn,
    trackAnalyticsCheckoutStarted: TrackAnalyticsCheckoutStarted,
    trackAnalyticsPaymentInfoEntered: TrackAnalyticsPaymentInfoEntered,
    trackAnalyticsShipmentInfoEntered: TrackAnalyticsShipmentInfoEntered,
    updateCart: UpdateCart,
    updateLocale: UpdateLocale,
    updateCartSubscriptionPlan: UpdateCartSubscriptionPlan
  ) {
    this.view = view;
    this.createCardPayment = createCardPayment;
    this.createKlarnaSession = createKlarnaSession;
    this.createOrder = createOrder;
    this.findCountryByCode = findCountryByCode;
    this.getAllStatesForCountry = getAllStatesForCountry;
    this.getCart = getCart;
    this.getLocalizationCode = getLocalizationCode;
    this.getShippingOptions = getShippingServices;
    this.getUser = getUser;
    this.getUserSubscriptionInfo = getUserSubscriptionInfo;
    this.logIn = logIn;
    this.trackAnalyticsCheckoutStarted = trackAnalyticsCheckoutStarted;
    this.trackAnalyticsPaymentInfoEntered = trackAnalyticsPaymentInfoEntered;
    this.trackAnalyticsShipmentInfoEntered = trackAnalyticsShipmentInfoEntered;
    this.updateCart = updateCart;
    this.updateLocale = updateLocale;
    this.updateCartSubscriptionPlan = updateCartSubscriptionPlan;
    this.path = "";
    this.locale = "";
    this.user = null;
    this.cartItems = 0;
  }

  start = async () => {
    this.view.showLoader();
    await this.initializeCart();
    await this.clearSelectedShippingOption();
    this.locale = this.getLocalizationCode.execute();
    const currentCountry =
      this.findCountryByCode.execute(this.locale.split("-")[1]) || this.findCountryByCode.execute("us");
    const states = this.getAllStatesForCountry.execute(currentCountry?.key?.toUpperCase() || "");
    this.view.showStateOptions(states);
    currentCountry && this.view.showCountry(currentCountry);
    await this.initializeUserSession();
    await this.updateSubscriptionPlan();
    this.trackAnalyticsCheckoutStarted.execute().then();
    this.view.hideLoader();
  };

  onUpdateEmail = async (email: string) => {
    await this.updateCart.execute({ account: { email } });
  };

  onUpdateAddress = async (address: AddressVM) => {
    try {
      this.view.showShippingLoader();
      await this.updateCart.execute(address);
      await this.updateShippingOptions();
      this.view.hideShippingLoader();
    } catch (e: any) {
      this.view.showErrorMessage(e.message);
      this.view.hideShippingLoader();
    }
  };

  onUpdateShippingOption = async (shippingOption: ShippingOptionVM) => {
    try {
      this.view.showShippingLoader();
      this.cart = await this.updateCart.execute(this.shippingOptionToUpdateCartRequest(shippingOption));
      this.view.hideShippingLoader();
    } catch (e: any) {
      this.view.showErrorMessage(e.message);
      this.view.hideShippingLoader();
    }
  };

  onShipmentInfoEntered = (paymentMethod: string) => this.trackAnalyticsShipmentInfoEntered.execute(paymentMethod);

  onPaymentInfoEntered = (paymentMethod: string) => this.trackAnalyticsPaymentInfoEntered.execute(paymentMethod);

  onPaymentMethodChange = async (paymentMethod: string) => {
    this.view.updateCheckoutButtonText(paymentMethod === "klarna" ? "PURCHASE WITH KLARNA" : "COMPLETE PURCHASE");
    if (paymentMethod === "klarna") {
      await this.updateSubscriptionPlan(true);
      if (!this.hasSubscriptionForcedToChange) return;
      return this.view.showUpgradePlanMessage();
    }
    if (!this.hasSubscriptionForcedToChange) return;
    await this.updateSubscriptionPlan();
    await this.view.hideUpgradePlanMessage();
  };

  checkout = async (checkoutForm: CheckoutFormVM) => {
    if (this.user?.pk?.length) {
      const subscriptionInfo = await this.getUserSubscriptionInfo.execute();
      if (
        subscriptionInfo?.status &&
        !["canceled", "incomplete_expired"].includes(subscriptionInfo?.status) &&
        this.cart?.hasSubscription
      ) {
        return this.view.setIsSubscriptionPurchaseNotAllowed(true);
      }
    } else {
      if (this.cart?.hasSubscriptionPackage && !this.cart?.hasSubscription) {
        return this.view.setIsPurchaseInvalid(true);
      } else {
        this.view.setIsPurchaseInvalid(false);
      }
    }

    if (this.cart?.needsSubscription && !this.cart?.hasSubscription) {
      return this.view.setIsPurchaseInvalid(true);
    } else {
      this.view.setIsPurchaseInvalid(false);
    }

    if (checkoutForm.paymentMethod === "klarna") return await this.initKlarnaCheckout(checkoutForm);
    await this.initCardCheckout(checkoutForm);
  };

  submitOrder = async (checkoutForm: CheckoutFormVM, paymentIntent?: string) => {
    try {
      const redirectRoute = this.getCheckoutRoute();
      this.view.showLoader();
      await this.createOrder.execute(this.checkoutFormVMToUpdateCartRequest(checkoutForm, paymentIntent));
      this.view.showSuccessMessage("Order placed successfully!");
      if (!this.user && checkoutForm.password) {
        await this.logIn.execute(checkoutForm.accountEmail!, checkoutForm.password);
      }
      this.view.hideLoader();
      this.view.navigateToNewPath(`${this.locale}/${redirectRoute}`, this.locale);
    } catch (e: any) {
      if (e instanceof EmailAlreadyRegisteredError) {
        this.view.showUserRegisteredModal();
      } else {
        this.view.showErrorMessage(e.message);
      }
      if (checkoutForm.paymentMethod === "card") this.view.resetCardInfo();
      this.view.hideLoader();
    }
  };

  private clearSelectedShippingOption = async () => {
    return Promise.all([
      await this.onUpdateAddress({ city: "", country: "", postalCode: "", state: "" }),
      await this.onUpdateShippingOption({ id: null }),
    ]);
  };

  private initializeCart = async () => {
    this.getCart.subscribe(async (cart) => {
      if (cart.items.length !== this.cartItems) this.updateShippingOptions().then();
      this.cartItems = cart.items.length;
      this.cart = cart;
      this.view.setKlarnaTotalPrice(formatPriceWithCurrency(cart.totalPrice, "us-EN"));
      this.view.updateTotalPrice(formatPriceWithCurrencyAndDecimals(cart.displayTotal, "us-EN"));
      this.view.setAccountFormVisible(!this.user && this.cart.hasSubscription);
      if (this.cart.hasSubscription && this.cart.items.length === 1) this.view.setIsSubscriptionOnlyPurchase();
      if ((process.env.GATSBY_ENVIRONMENT_KEY === "prod" && !this.hasCartRowerItem()) || !this.cart.totalPrice)
        this.view.hideKlarnaPaymentMethod();
    });
  };

  private hasCartRowerItem = () => !!this.cart?.items?.find((item) => item?.name?.toLowerCase().includes("rower") || item?.name?.toLowerCase().includes("upgrade kit"));

  private getCheckoutRoute = () => {
    if (this.cart!.totalPrice === 0) return "checkout/confirmation";
    if (this.cart?.hasSubscriptionPackage) return "checkout/confirmation-rower";
    if (this.cart?.hasSubscription) return "checkout/confirmation-subscription";
    return "checkout/confirmation-accessories";
  };

  private initializeUserSession = async () => {
    try {
      this.user = await this.getUser.execute();
      this.getUser.subscribe((user) => {
        this.user = user;
        this.view.setAccountFormVisible(!user && !!this.cart?.hasSubscription);
      });
      this.view.hideLegalCopy();
    } catch (e: any) {
      if (e instanceof UserNotLoggedInError) return;
      this.view.showErrorMessage(e.message);
    }
  };

  private initKlarnaCheckout = async (checkoutForm: CheckoutFormVM) => {
    try {
      this.view.showLoader();
      this.klarnaSession = await this.createKlarnaSession.execute(this.parseKlarnaTokenRequest(checkoutForm));
      this.view.showKlarnaWidget(this.klarnaSession);
    } catch (e: any) {
      this.view.showErrorMessage(e.message);
      this.view.hideLoader();
    }
  };

  private initCardCheckout = async (checkoutForm: CheckoutFormVM) => {
    try {
      this.view.showLoader();

      if (this.cart!.totalPrice === 0) return await this.submitOrder(checkoutForm);
      const paymentIntent = await this.createCardPayment.execute(this.parseCreateCardPaymentRequest(checkoutForm));
      await this.submitOrder(checkoutForm, paymentIntent);
    } catch (e: any) {
      this.view.showErrorMessage(e.message);
      this.view.hideLoader();
    }
  };

  private updateShippingOptions = async () => {
    const shippingOptions = await this.getShippingOptions.execute();
    const itemsShippingOptions = this.cart?.items.flatMap((item) => item.shippingOptions);
    const viewShippingOptions = shippingOptions
      .filter((option) => itemsShippingOptions?.includes(option.name!))
      .map(this.shippingOptionsToVM);
    if (viewShippingOptions.length === 1) viewShippingOptions[0].disabled = true;
    const allowParcelShipping = this.cart?.items?.some(
      (item) => item.hasSubscriptionPackage && item.allowParcelShipping
    );
    if (
      (this.cart?.hasSubscriptionPackage && viewShippingOptions.length) ||
      allowParcelShipping ||
      (!this.cart?.hasSubscriptionPackage &&
        this.cart?.items.length &&
        (this.cart?.items.length > 1 || !this.cart.hasSubscription))
    )
      this.view.showDeliveryForm();
    else this.view.hideDeliveryForm();

    this.view.updateShippingOptions(viewShippingOptions);
  };

  private shippingOptionsToVM = ({ id, description, name, price }: ShippingOption): ShippingOptionVM => ({
    id,
    description,
    name,
    price: formatPriceWithCurrency(price || 0, "us-EN"),
    disabled: false,
  });

  private parseKlarnaTokenRequest = (checkoutFormVM: CheckoutFormVM): KlarnaSessionRequest => ({
    address: checkoutFormVM.address,
    amount: Math.round(this.cart!.totalPrice * 100),
    apartment: checkoutFormVM.apartment,
    city: checkoutFormVM.city,
    country: checkoutFormVM.country,
    currency: "usd",
    email: checkoutFormVM.accountEmail || this.user!.email,
    items: [
      ...this.cart!.items.map((item) => this.cartItemsToKlarnaRequest(item)),
      this.shippingToKlarnaItem(),
      ...this.cart!.discountsList?.filter((discount) => discount.type.toLowerCase() === "coupon").map((coupon) =>
        this.couponToKlarnaItem(coupon)
      ),
      ...this.cart!.discountsList?.filter((discount) => discount.type.toLowerCase().includes("promo")).map((promo) =>
        this.promoToKlarnaItem(promo)
      ),
      this.taxesToKlarnaItem(),
    ],
    firstName: checkoutFormVM.firstName,
    lastName: checkoutFormVM.lastName,
    locale: this.locale,
    phone: checkoutFormVM.phone,
    postalCode: checkoutFormVM.postalCode,
    state: checkoutFormVM.state,
  });

  private parseCreateCardPaymentRequest = (checkoutForm: CheckoutFormVM): CreateCardPaymentRequest => {
    return {
      amount: `${Math.round(this.cart!.totalPrice * 100)}`,
      currency: "usd",
      paymentMethod: checkoutForm.card!.token,
    };
  };

  private cartItemsToKlarnaRequest = (item: CartItem): KlarnaItemsRequest => ({
    amount: Math.round(item.price * 100) - Math.round(item.discount * 100),
    currency: "usd",
    description: item.name,
    quantity: item.quantity,
  });

  private shippingToKlarnaItem = (): KlarnaItemsRequest => ({
    amount: Math.round(this.cart!.shippingPrice * 100),
    currency: "usd",
    description: "Shipping",
    quantity: 1,
  });

  private couponToKlarnaItem = (coupon: Discount): KlarnaItemsRequest => ({
    amount: Math.round(coupon.amount * -100),
    currency: "usd",
    description: "Coupon",
    quantity: 1,
  });

  private promoToKlarnaItem = (promo: Discount): KlarnaItemsRequest => ({
    amount: Math.round(promo.amount * -100),
    currency: "usd",
    description: "Promo",
    quantity: 1,
  });

  private taxesToKlarnaItem = (): KlarnaItemsRequest => ({
    amount: Math.round(this.cart!.tax * 100),
    currency: "usd",
    description: "Taxes",
    quantity: 1,
  });

  private checkoutFormVMToUpdateCartRequest = (
    checkoutForm: CheckoutFormVM,
    paymentIntent?: string
  ): UpdateCartRequest => {
    const updateCartRequest: UpdateCartRequest = {
      address: `${checkoutForm.address} ${checkoutForm.apartment}`,
      amount: Math.round(this.cart!.totalPrice * 100),
      authorizationToken: checkoutForm.authorizationToken,
      card: checkoutForm.card,
      city: checkoutForm.city,
      currency: "usd",
      firstName: checkoutForm.firstName,
      klarnaSession: checkoutForm.klarnaSession,
      lastName: checkoutForm.lastName,
      state: checkoutForm.state,
      paymentIntent: paymentIntent,
      paymentMethod: checkoutForm.paymentMethod,
      postalCode: checkoutForm.postalCode,
      country: checkoutForm.country,
      phone: checkoutForm.phone,
    };
    if (checkoutForm.accountEmail)
      updateCartRequest.account = {
        email: checkoutForm.accountEmail,
        contactMe: checkoutForm.contactMe!,
        password: checkoutForm.password!,
      };
    return updateCartRequest;
  };

  private shippingOptionToUpdateCartRequest = (shippingOption: ShippingOptionVM): UpdateCartRequest => ({
    shipping: {
      service: shippingOption.id,
    },
  });

  private updateSubscriptionPlan = async (shouldChargeSubscription?: boolean) => {
    const subscriptionItem = this.getSubscriptionWithPlanFromCart();
    if (!subscriptionItem) return;
    this.view.showLoader();
    const plan = subscriptionItem.options.find((o) => ["Plan", "Subscription"].includes(o.name))!.value;
    const newPlan = shouldChargeSubscription ? "Yearly" : this.oldSubscriptionPlan ?? plan;
    this.oldSubscriptionPlan = plan;
    await this.updateCartSubscriptionPlan.execute(subscriptionItem, newPlan, shouldChargeSubscription);
    this.hasSubscriptionForcedToChange = plan !== newPlan;
    this.view.hideLoader();
  };

  private getSubscriptionWithPlanFromCart = () => this.cart?.items.find((item) => item.isSubscription);
}

import { Provider } from "../core/Provider";
import { AccessoryPresenter, AccessoryView } from "./Accessory/AccessoryPresenter";
import { ApparelPresenter, ApparelView } from "./Apparel/ApparelPresenter";
import { CartPresenter, CartView } from "./Cart/CartPresenter";
import { CheckoutPresenter, CheckoutView } from "./Checkout/CheckoutPresenter";
import { CommonPagePresenter, CommonPageView } from "./CommonPage/CommonPagePresenter";
import {
  ComponentWithProductDetailsPresenter,
  ComponentWithProductDetailsView,
} from "./ComponentWithProductDetails/ComponentWithProductDetailsPresenter";
import { CTAPresenter, CTAView } from "./CTA/CTAPresenter";
import { DynamicFormPresenter, DynamicFormView } from "./DynamicForm/DynamicFormPresenter";
import { FooterPresenter, FooterView } from "./FooterPresenter";
import { ForgotPasswordPresenter, ForgotPasswordView } from "./ForgotPassword/ForgotPasswordPresenter";
import { HeaderPresenter, HeaderView } from "./Header/HeaderPresenter";
import { ImpactPresenter, ImpactView } from "./Impact/ImpactPresenter";
import { LoginPresenter, LoginView } from "./Login/LoginPresenter";
import { NewsletterModalPresenter, NewsletterModalView } from "./NewsletterModal/NewsletterModalPresenter";
import { PageLayoutPresenter, PageLayoutView } from "./PageLayoutPresenter";
import { ProductPresenter, ProductView } from "./Product/ProductPresenter";
import { ProfilePresenter, ProfileView } from "./Profile/ProfilePresenter";
import {
  PurchaseConfirmationPresenter,
  PurchaseConfirmationView,
} from "./PurchaseConfirmation/PurchaseConfirmationPresenter";
import { SetPasswordPresenter, SetPasswordView } from "./SetPassword/SetPasswordPresenter";
import { SubscriptionPresenter, SubscriptionView } from "./Subscription/SubscriptionPresenter";
import {
  SubscriptionPlanSelectorModalPresenter,
  SubscriptionPlanSelectorModalView,
} from "./SubscriptionPlanSelectorModal/SubscriptionPlanSelectorModalPresenter";
import { SwellProductListPresenter, SwellProductListView } from "./SwellProductListPresenter";
import { UpSellsPresenter, UpSellsView } from "./UpSellsPresenter";

export class PresenterFactory {
  accessoryPage = (view: AccessoryView): AccessoryPresenter =>
    new AccessoryPresenter(view, Provider.getProductsByCategory(), Provider.getBundleProducts());

  apparelPage = (view: ApparelView): ApparelPresenter => new ApparelPresenter(view, Provider.getProductsByCategory());

  cta = (view: CTAView): CTAPresenter =>
    new CTAPresenter(view, Provider.getLocalizationCode(), Provider.trackAnalyticsCTAClicked());

  checkout = (view: CheckoutView): CheckoutPresenter =>
    new CheckoutPresenter(
      view,
      Provider.createCardPayment(),
      Provider.createKlarnaSession(),
      Provider.createOrder(),
      Provider.findCountryByCode(),
      Provider.getAllStatesByCountry(),
      Provider.getCart(),
      Provider.getLocalizationCode(),
      Provider.getShippingOptions(),
      Provider.getUser(),
      Provider.getUserSubscriptionInfo(),
      Provider.logIn(),
      Provider.trackAnalyticsCheckoutStarted(),
      Provider.trackAnalyticsPaymentInfoEntered(),
      Provider.trackAnalyticsShipmentInfoEntered(),
      Provider.updateCart(),
      Provider.updateLocale(),
      Provider.updateCartSubscriptionPlan()
    );
  z;

  cart = (view: CartView): CartPresenter =>
    new CartPresenter(
      view,
      Provider.getCart(),
      Provider.applyCouponToCart(),
      Provider.removeCouponsFromCart(),
      Provider.removeItemFromCart(),
      Provider.updateCart(),
      Provider.isUserLoggedIn(),
      Provider.getLocalizationCode()
    );

  commonPage = (view: CommonPageView): CommonPagePresenter =>
    new CommonPagePresenter(view, Provider.trackAnalyticsPageView());

  componentWithProductDetails = (view: ComponentWithProductDetailsView): ComponentWithProductDetailsPresenter =>
    new ComponentWithProductDetailsPresenter(view, Provider.getProduct());

  footer = (view: FooterView): FooterPresenter =>
    new FooterPresenter(
      view,
      Provider.getLocalizationCode(),
      Provider.getAllCountries(),
      Provider.findCountryByCode(),
      Provider.findCountryByName(),
      Provider.trackAnalyticsEmailSubmitted(),
      Provider.updateLocale(),
      Provider.getUser(),
      Provider.logOut()
    );

  dynamicForm = (view: DynamicFormView): DynamicFormPresenter =>
    new DynamicFormPresenter(view, Provider.trackAnalytics());

  forgotPasswordPage = (view: ForgotPasswordView): ForgotPasswordPresenter =>
    new ForgotPasswordPresenter(view, Provider.resetPassword());

  header = (view: HeaderView): HeaderPresenter =>
    new HeaderPresenter(view, Provider.getLocalizationCode(), Provider.getUser(), Provider.logOut());

  impact = (view: ImpactView): ImpactPresenter => new ImpactPresenter(view, Provider.getUser());

  loginPage = (view: LoginView): LoginPresenter =>
    new LoginPresenter(
      view,
      Provider.logIn(),
      Provider.getLocalizationCode(),
      Provider.trackAnalyticsPageView(),
      Provider.isAppTrialUser()
    );

  newsLetter = (view: NewsletterModalView): NewsletterModalPresenter =>
    new NewsletterModalPresenter(view, Provider.trackAnalyticsEmailSubmitted(), Provider.identifyAnalyticsUser());

  setPasswordPage = (view: SetPasswordView): SetPasswordPresenter =>
    new SetPasswordPresenter(view, Provider.setPassword());

  profilePage = (view: ProfileView): ProfilePresenter =>
    new ProfilePresenter(
      view,
      Provider.getLocalizationCode(),
      Provider.changePassword(),
      Provider.editUser(),
      Provider.getAllEquipments(),
      Provider.getUser(),
      Provider.trackAnalyticsPageView()
    );

  subscriptionPlanSelectorModal = (view: SubscriptionPlanSelectorModalView): SubscriptionPlanSelectorModalPresenter =>
    new SubscriptionPlanSelectorModalPresenter(view, Provider.isUserLoggedIn(), Provider.getLocalizationCode());

  pageLayout = (view: PageLayoutView): PageLayoutPresenter =>
    new PageLayoutPresenter(
      view,
      Provider.getCart(),
      Provider.getSlugWithLocalizationCode(),
      Provider.identifyAnalyticsUser()
    );

  product = (view: ProductView): ProductPresenter =>
    new ProductPresenter(
      view,
      Provider.addToCart(),
      Provider.applyCouponToCart(),
      Provider.isUserLoggedIn(),
      Provider.getCart(),
      Provider.getLocalizationCode(),
      Provider.getProduct(),
      Provider.getReviewsSummary(),
      Provider.getUserSubscriptionStatus(),
      Provider.trackAnalyticsProductAdded(),
      Provider.trackAnalyticsProductViewed()
    );

  subscription = (view: SubscriptionView): SubscriptionPresenter =>
    new SubscriptionPresenter(
      view,
      Provider.getLocalizationCode(),
      Provider.cancelSubscription(),
      Provider.getUser(),
      Provider.getUserSubscriptionInfo(),
      Provider.trackAnalyticsPageView(),
      Provider.updatePaymentInfo(),
      Provider.getTransactionsHistory(),
      Provider.updateUserSubscriptionPlan(),
      Provider.getProduct(),
      Provider.checkSubscriptionCoupon(),
      Provider.trackAnalyticsPaymentInfoEntered()
    );
  purchaseConfirmation = (view: PurchaseConfirmationView): PurchaseConfirmationPresenter =>
    new PurchaseConfirmationPresenter(view, Provider.getOrder());

  swellProductsListPage = (view: SwellProductListView): SwellProductListPresenter =>
    new SwellProductListPresenter(view, Provider.findAllProducts());

  upSellsPage = (view: UpSellsView): UpSellsPresenter =>
    new UpSellsPresenter(view, Provider.getProduct(), Provider.trackAnalyticsPageView());
}

import { Cart } from "./domain/orders/Cart";
import { ProductsDiscountsApplierService } from "./domain/products/ProductsDiscountsApplierService";
import { SegmentAnalyticsService } from "./infrastructure/analytics/SegmentAnalyticsService";
import { EcommerceCartService } from "./infrastructure/ecommerce/EcommerceCartService";
import { EcommerceClient } from "./infrastructure/ecommerce/EcommerceClient";
import { EcommerceCouponService } from "./infrastructure/ecommerce/EcommerceCouponService";
import { EcommerceOrderService } from "./infrastructure/ecommerce/EcommerceOrderService";
import { EcommercePaymentService } from "./infrastructure/ecommerce/EcommercePaymentService";
import { EcommerceProductService } from "./infrastructure/ecommerce/EcommerceProductService";
import { HttpAnalyticsService } from "./infrastructure/http/HttpAnalyticsService";
import { HttpAuthService } from "./infrastructure/http/HttpAuthService";
import { HttpClient } from "./infrastructure/http/HttpClient";
import { HttpEquipmentsService } from "./infrastructure/http/HttpEquipmentsService";
import { HttpLambdaClient } from "./infrastructure/http/HttpLambdaClient";
import { HttpPaymentInfoService } from "./infrastructure/http/HttpPaymentInfoService";
import { HttpSubscriptionService } from "./infrastructure/http/HttpSubscriptionService";
import { HttpTransactionsService } from "./infrastructure/http/HttpTransactionsService";
import { InMemoryCountriesRepository } from "./infrastructure/inMemory/InMemoryCountriesRepository";
import { InMemoryStatesRepository } from "./infrastructure/inMemory/InMemoryStatesRepository";
import { LocalSessionStorage } from "./infrastructure/localStorage/LocalSessionStorage";
import { LocalStorageLocalizationService } from "./infrastructure/localStorage/LocalStorageLocalizationService";
import { LocalUserStorage } from "./infrastructure/localStorage/LocalUserStorage";
import { GetAllStatesByCountry } from "./useCases/GetAllStatesByCountry/GetAllStatesByCountry";
import { AddToCart } from "./useCases/AddToCart/AddToCart";
import { ApplyCouponToCart } from "./useCases/ApplyCouponToCart/ApplyCouponToCart";
import { CancelSubscription } from "./useCases/CancelSubscription/CancelSubscription";
import { ChangePassword } from "./useCases/ChangePassword/ChangePassword";
import { CheckSubscriptionCoupon } from "./useCases/CheckSubscriptionCoupon/CheckSubscriptionCoupon";
import { CreateCardPayment } from "./useCases/CreateCardPayment/CreateCardPayment";
import { CreateKlarnaSession } from "./useCases/CreateKlarnaToken/CreateKlarnaSession";
import { CreateOrder } from "./useCases/CreateOrder/CreateOrder";
import { CreateSubscription } from "./useCases/CreateSubscription/CreateSubscription";
import { DeleteUser } from "./useCases/DeleteUser/DeleteUser";
import { FindAllProducts } from "./useCases/FindAllProducts/FindAllProducts";
import { FindCountryByCode } from "./useCases/FindCountryByCode/FindCountryByCode";
import { FindCountryByName } from "./useCases/FindCountryByName/FindCountryByName";
import { GetAllCountries } from "./useCases/GetAllCountries/GetAllCountries";
import { GetAllEquipments } from "./useCases/GetAllEquipments/GetAllEquipments";
import { GetBundleProducts } from "./useCases/GetBundleProducts/GetBundleProducts";
import { GetCart } from "./useCases/GetCart/GetCart";
import { GetLocalizationCode } from "./useCases/GetLocalizationCode/GetLocalizationCode";
import { GetOrder } from "./useCases/GetOrder/GetOrder";
import { GetProduct } from "./useCases/GetProduct/GetProduct";
import { GetProductsByCategory } from "./useCases/GetProductsByCategory/GetProductsByCategory";
import { GetShippingOptions } from "./useCases/GetShippingServices/GetShippingOptions";
import { GetSlugWithLocalizationCode } from "./useCases/GetSlugWithLocalizationCode/GetSlugWithLocalizationCode";
import { GetTransactionsHistory } from "./useCases/GetTransactionsHistory/GetTransactionsHistory";
import { GetUser } from "./useCases/GetUser/GetUser";
import { GetUserSubscriptionInfo } from "./useCases/GetUserSubscriptionInfo/GetUserSubscriptionInfo";
import { GetUserSubscriptionStatus } from "./useCases/GetUserSubscriptionStatus/GetUserSubscriptionStatus";
import { IsAppTrialUser } from "./useCases/IsAppTrialUser/IsAppTrialUser";
import { IsUserLoggedIn } from "./useCases/IsUserLoggedIn/IsUserLoggedIn";
import { LogIn } from "./useCases/LogIn/LogIn";
import { LogOut } from "./useCases/LogOut/LogOut";
import { RegisterUser } from "./useCases/RegisterUser/RegisterUser";
import { RemoveCouponsFromCart } from "./useCases/RemoveCouponsFromCart/RemoveCouponsFromCart";
import { RemoveItemFromCart } from "./useCases/RemoveItemFromCart/RemoveItemFromCart";
import { UpdateCartSubscriptionPlan } from "./useCases/ReplaceMonthlySubscriptionForAnnual/UpdateCartSubscriptionPlan";
import { ResetPassword } from "./useCases/ResetPassword/ResetPassword";
import { SetPassword } from "./useCases/SetPassword/SetPassword";
import { TrackAnalyticsCheckoutStarted } from "./useCases/TrackAnalytics/CheckoutStarted/TrackAnalyticsCheckoutStarted";
import { TrackAnalyticsCTAClicked } from "./useCases/TrackAnalytics/CTAClicked/TrackAnalyticsCTAClicked";
import { TrackAnalyticsEmailSubmitted } from "./useCases/TrackAnalytics/EmailSubmitted/TrackAnalyticsEmailSubmitted";
import { IdentifyAnalyticsUser } from "./useCases/TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { TrackAnalyticsOrderCompleted } from "./useCases/TrackAnalytics/OrderCompleted/TrackAnalyticsOrderCompleted";
import { TrackAnalyticsPageView } from "./useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { TrackAnalyticsPaymentInfoEntered } from "./useCases/TrackAnalytics/PaymentInfoEntered/TrackAnalyticsPaymentInfoEntered";
import { TrackAnalyticsProductAdded } from "./useCases/TrackAnalytics/ProductAdded/TrackAnalyticsProductAdded";
import { TrackAnalyticsProductViewed } from "./useCases/TrackAnalytics/ProductViewed/TrackAnalyticsProductViewed";
import { TrackAnalyticsShipmentInfoEntered } from "./useCases/TrackAnalytics/ShipmentInfoEntered/TrackAnalyticsShipmentInfoEntered";
import { TrackAnalytics } from "./useCases/TrackAnalytics/TrackAnalytics/TrackAnalytics";
import { UpdateCart } from "./useCases/UpdateCart/UpdateCart";
import { UpdateLocale } from "./useCases/UpdateLocale/UpdateLocale";
import { UpdatePaymentInfo } from "./useCases/UpdatePaymentInfo/UpdatePaymentInfo";
import { UpdateUser } from "./useCases/UpdateUser/UpdateUser";
import { UpdateUserSubscriptionPlan } from "./useCases/UpdateUserSubscriptionPlan/UpdateUserSubscriptionPlan";
import { GetReviewsSummary } from "./useCases/GetReviewsSummary/GetReviewsSummary";
import { HttpReviewsService } from "./infrastructure/http/HttpReviewsService";
import { TrackAnalyticsUserConverted } from "./useCases/TrackAnalytics/UserConverted/TrackAnalyticsUserConverted";

export class Provider {
  static addToCart = () => new AddToCart(D.cart(), D.cartService(), D.subscriptionService(), D.sessionStorage());
  static applyCouponToCart = () =>
    new ApplyCouponToCart(D.cart(), D.cartService(), D.couponService(), this.trackAnalytics());
  static changePassword = () => new ChangePassword(D.authService(), this.getUser());
  static createCardPayment = () => new CreateCardPayment(D.paymentService());
  static createKlarnaSession = () => new CreateKlarnaSession(D.paymentService());
  static createOrder = () =>
    new CreateOrder(
      D.cart(),
      D.cartService(),
      this.createSubscription(),
      this.deleteUser(),
      this.identifyAnalyticsUser(),
      D.orderService(),
      this.registerUser(),
      D.sessionStorage(),
      this.trackAnalyticsOrderCompleted(),
      this.trackAnalyticsUserConverted()
    );
  static createSubscription = () => new CreateSubscription(D.cart(), D.paymentService(), D.subscriptionService());
  static editUser = () => new UpdateUser(D.authService(), this.getUser(), D.userStorage());
  static deleteUser = () => new DeleteUser(D.authService(), D.userStorage(), D.sessionStorage());
  static findAllProducts = () => new FindAllProducts(D.productService());
  static findCountryByCode = () => new FindCountryByCode(D.countriesRepository());
  static findCountryByName = () => new FindCountryByName(D.countriesRepository());
  static getAllCountries = () => new GetAllCountries(D.countriesRepository());
  static getAllEquipments = () => new GetAllEquipments(D.equipmentService());
  static getAllStatesByCountry = () => new GetAllStatesByCountry(D.statesRepository());
  static getBundleProducts = () => new GetBundleProducts(D.productService());
  static getCart = () => new GetCart(D.cart(), D.cartService(), D.productService());
  static getLocalizationCode = () => new GetLocalizationCode(D.localizationService());
  static getOrder = () => new GetOrder(D.orderService());
  static getProduct = () => new GetProduct(D.productService());
  static getReviewsSummary = () => new GetReviewsSummary(D.reviewsService());
  static getProductsByCategory = () => new GetProductsByCategory(D.productService());
  static getShippingOptions = () => new GetShippingOptions(D.cartService());
  static getSlugWithLocalizationCode = () => new GetSlugWithLocalizationCode(D.localizationService());
  static getUser = () => new GetUser(D.userStorage(), D.authService(), D.sessionStorage());
  static getUserSubscriptionStatus = () => new GetUserSubscriptionStatus(D.subscriptionService());
  static identifyAnalyticsUser = () =>
    new IdentifyAnalyticsUser(D.analyticsService(), D.httpAnalyticsService(), D.userStorage());
  static isAppTrialUser = () => new IsAppTrialUser(D.subscriptionService());
  static isUserLoggedIn = () => new IsUserLoggedIn(D.sessionStorage());
  static logIn = () =>
    new LogIn(
      D.authService(),
      D.cart(),
      D.cartService(),
      this.identifyAnalyticsUser(),
      D.sessionStorage(),
      D.subscriptionService(),
      this.trackAnalytics(),
      D.userStorage()
    );
  static logOut = () =>
    new LogOut(
      D.analyticsService(),
      this.identifyAnalyticsUser(),
      D.sessionStorage(),
      this.trackAnalytics(),
      D.userStorage()
    );
  static registerUser = () =>
    new RegisterUser(
      D.authService(),
      this.identifyAnalyticsUser(),
      D.sessionStorage(),
      this.trackAnalytics(),
      D.userStorage()
    );
  static resetPassword = () => new ResetPassword(D.authService());
  static removeCouponsFromCart = () => new RemoveCouponsFromCart(D.cart(), D.cartService());
  static removeItemFromCart = () =>
    new RemoveItemFromCart(D.cart(), D.cartService(), D.productService(), this.trackAnalytics());
  static setPassword = () => new SetPassword(D.authService());
  static trackAnalytics = () => new TrackAnalytics(D.analyticsService(), D.httpAnalyticsService(), D.userStorage());
  static trackAnalyticsCheckoutStarted = () =>
    new TrackAnalyticsCheckoutStarted(D.cart(), D.productService(), this.trackAnalytics());
  static trackAnalyticsCTAClicked = () => new TrackAnalyticsCTAClicked(this.trackAnalytics());
  static trackAnalyticsEmailSubmitted = () =>
    new TrackAnalyticsEmailSubmitted(
      D.countriesRepository(),
      this.identifyAnalyticsUser(),
      this.trackAnalytics(),
      D.userStorage()
    );
  static trackAnalyticsOrderCompleted = () =>
    new TrackAnalyticsOrderCompleted(D.cart(), D.productService(), this.trackAnalytics());
  static trackAnalyticsPageView = () =>
    new TrackAnalyticsPageView(D.analyticsService(), D.httpAnalyticsService(), D.userStorage());
  static trackAnalyticsPaymentInfoEntered = () => new TrackAnalyticsPaymentInfoEntered(D.cart(), this.trackAnalytics());
  static trackAnalyticsProductAdded = () =>
    new TrackAnalyticsProductAdded(D.cart(), D.productService(), this.trackAnalytics());
  static trackAnalyticsProductViewed = () => new TrackAnalyticsProductViewed(this.trackAnalytics());
  static trackAnalyticsShipmentInfoEntered = () =>
    new TrackAnalyticsShipmentInfoEntered(D.cart(), this.trackAnalytics());
  static trackAnalyticsUserConverted = () => new TrackAnalyticsUserConverted(this.trackAnalytics());
  static updateCart = () => new UpdateCart(D.cart(), D.cartService());
  static updateCartSubscriptionPlan = () => new UpdateCartSubscriptionPlan(D.cart(), D.cartService());
  static updateLocale = () => new UpdateLocale(D.localizationService());
  static updateUserSubscriptionPlan = () => new UpdateUserSubscriptionPlan(D.subscriptionService());
  static cancelSubscription = () => new CancelSubscription(D.subscriptionService());
  static checkSubscriptionCoupon = () => new CheckSubscriptionCoupon(D.subscriptionService(), D.couponService());
  static getUserSubscriptionInfo = () => new GetUserSubscriptionInfo(D.subscriptionService());
  static updatePaymentInfo = () => new UpdatePaymentInfo(D.paymentInfoService(), this.trackAnalyticsUserConverted());
  static getTransactionsHistory = () => new GetTransactionsHistory(D.transactionsService());
}

class Dependencies {
  static analyticsService = () =>
    this.singleton("analyticsService", () => new SegmentAnalyticsService(process.env.GATSBY_SEGMENT_KEY!));

  static httpAnalyticsService = () =>
    this.singleton("httpAnalyticsService", () => new HttpAnalyticsService(this.httpLambdaClient()));

  static authService = () => this.singleton("authService", () => new HttpAuthService(this.httpBackendClient()));

  static cart() {
    return this.singleton("cart", () => new Cart());
  }

  static cartService = () =>
    this.singleton(
      "cartService",
      () =>
        new EcommerceCartService(
          this.ecommerceClient(),
          this.cart(),
          this.productsDiscountsApplierService(),
          this.httpBackendClient()
        )
    );

  static countriesRepository = () => this.singleton("countriesRepository", () => new InMemoryCountriesRepository());

  static couponService = () =>
    this.singleton("couponService", () => new EcommerceCouponService(this.ecommerceClient()));

  static ecommerceClient = () =>
    this.singleton(
      "ecommerceClient",
      () => new EcommerceClient(process.env.GATSBY_STORE_ID!, process.env.GATSBY_STORE_PUBLIC_KEY!)
    );

  static equipmentService = () =>
    this.singleton("equipmentService", () => new HttpEquipmentsService(this.httpBackendClient()));

  static httpLambdaClient = () => new HttpLambdaClient(process.env.GATSBY_LAMBDA_URL!);

  static httpBackendClient = () => new HttpClient(process.env.GATSBY_BACKEND_URL!, this.sessionStorage());

  static localizationService = () => this.singleton("localizationService", () => new LocalStorageLocalizationService());

  static productsDiscountsApplierService = () =>
    this.singleton("productsDiscountsApplierService", () => new ProductsDiscountsApplierService());

  static orderService = () =>
    this.singleton(
      "orderService",
      () => new EcommerceOrderService(this.ecommerceClient(), this.productsDiscountsApplierService())
    );

  static paymentService = () =>
    this.singleton("paymentService", () => new EcommercePaymentService(this.ecommerceClient()));

  static productService = () =>
    this.singleton("productService", () => new EcommerceProductService(this.ecommerceClient()));

  static paymentInfoService = () =>
    this.singleton("paymentInfoService", () => new HttpPaymentInfoService(this.httpBackendClient()));

  static reviewsService = () =>
    this.singleton("reviewsService", () => new HttpReviewsService(this.httpBackendClient()));

  static transactionsService = () =>
    this.singleton("transactionsService", () => new HttpTransactionsService(this.httpBackendClient()));

  static sessionStorage() {
    return this.singleton("sessionStorage", () => new LocalSessionStorage());
  }

  static statesRepository = () => this.singleton("statesRepository", () => new InMemoryStatesRepository());

  static userStorage() {
    return this.singleton("userStorage", () => new LocalUserStorage());
  }

  static subscriptionService = () =>
    this.singleton("subscriptionService", () => new HttpSubscriptionService(this.httpBackendClient()));

  static singleton<T>(name: string, build: () => T): T {
    if (!this._singleInstances[name]) {
      this._singleInstances[name] = build();
    }
    return this._singleInstances[name];
  }

  static _singleInstances = {};
}

const D = Dependencies;

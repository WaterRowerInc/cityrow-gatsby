import { anything, capture, instance, mock, verify, when } from "ts-mockito";
import { ProductVM, VariantVM } from "../../builderComponents/Product/ProductVM";
import { CartBuilder } from "../../core/domain/orders/testing/CartBuilder";
import { reviewsFixtures } from "../../core/domain/orders/testing/ReviewsFixtures";
import { Product } from "../../core/domain/products/Product";
import { productFixtures } from "../../core/domain/products/testing/ProductFixtures";
import { ReviewsSummary } from "../../core/domain/reviews/ReviewsSummary";
import { AddToCart } from "../../core/useCases/AddToCart/AddToCart";
import { GetCart } from "../../core/useCases/GetCart/GetCart";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import { GetReviewsSummary } from "../../core/useCases/GetReviewsSummary/GetReviewsSummary";
import { GetUserSubscriptionStatus } from "../../core/useCases/GetUserSubscriptionStatus/GetUserSubscriptionStatus";
import { IsUserLoggedIn } from "../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";
import { TrackAnalyticsProductAdded } from "../../core/useCases/TrackAnalytics/ProductAdded/TrackAnalyticsProductAdded";
import { TrackAnalyticsProductViewed } from "../../core/useCases/TrackAnalytics/ProductViewed/TrackAnalyticsProductViewed";
import { ProductPresenter, ProductView } from "./ProductPresenter";
import { ApplyCouponToCart } from "../../core/useCases/ApplyCouponToCart/ApplyCouponToCart";

describe("ProductPresenter should", () => {
  it("show loader when starts loading the product", () => {
    when(getProduct.execute(aProduct.slug)).thenResolve(aProduct);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    presenter.start(aProduct.slug);

    verify(view.showLoader()).calledBefore(getProduct.execute(aProduct.slug));
  });

  it("update total price when selecting multiple variants of an item", async () => {
    when(getProduct.execute(anything())).thenResolve(aDumbbell);
    await presenter.start(aDumbbell.slug);

    presenter.onMultipleVariantsSelect(dumbbellVariantsVM);

    const [totalUpdated] = capture(view.showTotalPrice).last();
    expect(totalUpdated).toBe("$150");
  });

  it("show original price and sale price if product is on sale", async () => {
    when(getProduct.execute(anything())).thenResolve({ ...aProduct, priceWithoutSale: 150 });
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);

    verify(view.showTotalPrice(anything(), anything())).called();
    const [salePrice, originalPrice] = capture(view.showTotalPrice).last();
    expect(salePrice).toBe("$123");
    expect(originalPrice).toBe("$150");
  });

  it("not show a sale price if product is not on sale", async () => {
    when(getProduct.execute(anything())).thenResolve(aProduct);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    await presenter.start(aProduct.slug);

    const [price, originalPrice] = capture(view.showTotalPrice).last();
    expect(price).toBe("$123");
    expect(originalPrice).toBe(undefined);
  });

  it("render a product without showing 'plus tax and subscription' next to the price if product isn't rower ", async () => {
    when(getProduct.execute(anything())).thenResolve(aProduct);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    await presenter.start(aDumbbell.slug);

    const [product] = capture(view.showProduct).last();
    expect(product.isRower).toBe(false);
  });

  it("render a product showing 'plus tax and subscription' next to the price if product is rower", async () => {
    when(getProduct.execute(anything())).thenResolve({ ...aProduct, categories: ["rowers"] });
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    await presenter.start(aProduct.slug);

    const [product] = capture(view.showProduct).last();
    expect(product.isRower).toBe(true);
  });

  it("when selecting a subscription, if user is logged in check there's not an existing subscription on the cart and account", async () => {
    when(getCart.execute()).thenResolve(new CartBuilder().build());
    when(isUserLoggedIn.execute()).thenResolve(true);
    when(getUserSubscriptionStatus.execute()).thenResolve("canceled");

    await presenter.onSelectSubscription(aSubscriptionProduct);

    verify(view.showLoader()).called();
    verify(isUserLoggedIn.execute()).called();
    verify(getUserSubscriptionStatus.execute()).called();
    verify(view.hideLoader()).called();
    const [subscription] = capture(view.selectSubscription).last();
    expect(subscription).toBe(aSubscriptionProduct);
    verify(view.showSelectSubscriptionPlan()).called();
  });

  it("when selecting a subscription, if user is not logged in check there's not an existing subscription on the cart only", async () => {
    when(getCart.execute()).thenResolve(new CartBuilder().build());
    when(isUserLoggedIn.execute()).thenResolve(false);

    await presenter.onSelectSubscription(aSubscriptionProduct);

    verify(view.showLoader()).called();
    verify(isUserLoggedIn.execute()).called();
    verify(getUserSubscriptionStatus.execute()).never();
    verify(view.hideLoader()).called();
    const [subscription] = capture(view.selectSubscription).last();
    expect(subscription).toBe(aSubscriptionProduct);
    verify(view.showSelectSubscriptionPlan()).called();
  });

  it("when selecting a subscription, throw duplicate subscription error if there's a subscription on the cart", async () => {
    when(getCart.execute()).thenResolve(new CartBuilder().withHasSubscription(true).build());

    await presenter.onSelectSubscription(aSubscriptionProduct);

    verify(view.showLoader()).called();
    verify(isUserLoggedIn.execute()).never();
    verify(getUserSubscriptionStatus.execute()).never();
    verify(view.showError(anything())).called();
    verify(view.hideLoader()).called();
    verify(view.selectSubscription(anything())).never();
    verify(view.showSelectSubscriptionPlan()).never();
  });

  it("when selecting a subscription, throw duplicate subscription error if logged user has a subscription", async () => {
    when(getCart.execute()).thenResolve(new CartBuilder().build());
    when(isUserLoggedIn.execute()).thenResolve(true);
    when(getUserSubscriptionStatus.execute()).thenResolve("active");

    await presenter.onSelectSubscription(aSubscriptionProduct);

    verify(view.showLoader()).called();
    verify(isUserLoggedIn.execute()).called();
    verify(getUserSubscriptionStatus.execute()).called();
    verify(view.showError(anything())).called();
    verify(view.hideLoader()).called();
    verify(view.selectSubscription(anything())).never();
    verify(view.showSelectSubscriptionPlan()).never();
  });

  it("navigate to the checkout after adding to the cart if product has no related products", async () => {
    when(getProduct.execute(anything())).thenResolve({ ...aProduct, categories: ["rowers"] });
    when(getLocalizationCode.execute()).thenReturn("en-us");
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);

    await presenter.addToCart();

    verify(view.navigateToCheckout("en-us")).calledAfter(view.hideLoader());
  });

  it("apply coupon to the cart if the product has a promoCode", async () => {
    when(getProduct.execute(anything())).thenResolve({ ...aProduct, categories: ["rowers"], promoCode: "aPromoCode" });
    when(getLocalizationCode.execute()).thenReturn("en-us");
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);

    await presenter.addToCart();

    verify(applyCouponToCart.execute("aPromoCode")).called();
  });

  it("not apply coupon to the cart if the product doesn't have a promoCode", async () => {
    when(getProduct.execute(anything())).thenResolve({ ...aProduct, categories: ["rowers"]});
    when(getLocalizationCode.execute()).thenReturn("en-us");
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);

    await presenter.addToCart();

    verify(applyCouponToCart.execute("aPromoCode")).never();
  });

  it("not initialize selected variant if product doesnt have variants", async () => {
    when(getProduct.execute(anything())).thenResolve(aProduct);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    await presenter.start(aProduct.slug);

    verify(view.updateSelectedVariants(anything())).never();
  });

  it("initialize selected variant if product have variants", async () => {
    when(getProduct.execute(anything())).thenResolve(aProductWithVariants);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);

    await presenter.start(aProduct.slug);

    verify(view.updateSelectedVariants(anything())).called();
  });

  it("update selected variants when adding a variant", async () => {
    when(getProduct.execute(anything())).thenResolve(aProductWithVariants);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);

    await presenter.addVariant();

    const [selectedVariants] = capture(view.updateSelectedVariants).last();
    verify(view.updateSelectedVariants(anything())).twice();
    expect(selectedVariants.length).toBeGreaterThan(1);
  });

  it("update selected variants when removing a variant", async () => {
    when(getProduct.execute(anything())).thenResolve(aProductWithVariants);
    when(getReviewsSummary.execute()).thenResolve(aReviewsSummary);
    await presenter.start(aProduct.slug);
    await presenter.addVariant();

    await presenter.removeVariant(0);

    const [selectedVariants] = capture(view.updateSelectedVariants).last();
    verify(view.updateSelectedVariants(anything())).thrice();
    expect(selectedVariants.length).toBe(1);
  });

  it("should hide subscription plan on select plan", async () => {
    const anyPlan = {
      id: "Yearly",
      name: "Yearly",
      description: "yearly",
      price: "$120",
      subscriptionInterval: "yearly",
      subscriptionTrialDays: 14,
    };

    await presenter.onSelectPlan(anyPlan);

    verify(view.hideSelectSubscriptionPlan()).called();
  });

  it("should hide subscription plan on select plan", async () => {
    const yearlyPlan = {
      id: "Yearly",
      name: "Yearly",
      description: "yearly",
      price: "$120",
      subscriptionInterval: "yearly",
      subscriptionTrialDays: 14,
    };

    await presenter.onSelectPlan(yearlyPlan);

    verify(view.hideSelectSubscriptionPlan()).called();
  });

  beforeEach(() => {
    view = mock<ProductView>();
    addToCart = mock<AddToCart>();
    applyCouponToCart = mock<ApplyCouponToCart>();
    isUserLoggedIn = mock<IsUserLoggedIn>();
    getCart = mock<GetCart>();
    getLocalizationCode = mock<GetLocalizationCode>();
    getProduct = mock<GetProduct>();
    getReviewsSummary = mock<GetReviewsSummary>();
    getUserSubscriptionStatus = mock<GetUserSubscriptionStatus>();
    trackAnalyticsProductAdded = mock<TrackAnalyticsProductAdded>();
    trackAnalyticsProductViewed = mock<TrackAnalyticsProductViewed>();
    presenter = createPresenter();
  });

  function createPresenter(): ProductPresenter {
    return new ProductPresenter(
      instance(view),
      instance(addToCart),
      instance(applyCouponToCart),
      instance(isUserLoggedIn),
      instance(getCart),
      instance(getLocalizationCode),
      instance(getProduct),
      instance(getReviewsSummary),
      instance(getUserSubscriptionStatus),
      instance(trackAnalyticsProductAdded),
      instance(trackAnalyticsProductViewed)
    );
  }

  let view: ProductView;
  let presenter: ProductPresenter;
  let addToCart: AddToCart;
  let applyCouponToCart: ApplyCouponToCart;
  let isUserLoggedIn: IsUserLoggedIn;
  let getCart: GetCart;
  let getLocalizationCode: GetLocalizationCode;
  let getProduct: GetProduct;
  let getReviewsSummary: GetReviewsSummary;
  let getUserSubscriptionStatus: GetUserSubscriptionStatus;
  let trackAnalyticsProductAdded: TrackAnalyticsProductAdded;
  let trackAnalyticsProductViewed: TrackAnalyticsProductViewed;

  const aDumbbell: Product = productFixtures.aDumbBell;
  const aProduct: Product = productFixtures.aProduct;
  const aProductWithVariants: Product = productFixtures.aProductWithVariants;
  const aReviewsSummary: ReviewsSummary = reviewsFixtures.someReviewsSummary;
  const aSubscriptionProduct: ProductVM = { ...productFixtures.aSubscriptionProduct, quantity: 1, price: "0" };
  const dumbbellVariantsVM: VariantVM[] = productFixtures.dumbBellVariantsVM;
});

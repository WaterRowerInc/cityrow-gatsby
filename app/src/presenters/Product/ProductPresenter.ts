import { ItemVM } from "../../builderComponents/Product/ItemVM";
import { ProductOptionValueVM, ProductOptionVM, ProductVM, VariantVM } from "../../builderComponents/Product/ProductVM";
import { ReviewsSummaryVM } from "../../builderComponents/Product/ReviewsSummaryVM";
import { Item } from "../../core/domain/orders/Item";
import { Product, ProductOption, ProductOptionValues, Variant } from "../../core/domain/products/Product";
import { ReviewsSummary } from "../../core/domain/reviews/ReviewsSummary";
import { ActiveTrialSubscriptionError } from "../../core/domain/subscriptions/ActiveTrialSubscriptionError";
import { NoSubscriptionPlan } from "../../core/domain/subscriptions/NoSubscriptionPlan";
import { TwoActiveSubscriptionsError } from "../../core/domain/subscriptions/TwoActiveSubscriptionsError";
import { AddToCart } from "../../core/useCases/AddToCart/AddToCart";
import { GetCart } from "../../core/useCases/GetCart/GetCart";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import { GetReviewsSummary } from "../../core/useCases/GetReviewsSummary/GetReviewsSummary";
import { GetUserSubscriptionStatus } from "../../core/useCases/GetUserSubscriptionStatus/GetUserSubscriptionStatus";
import { IsUserLoggedIn } from "../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";
import { TrackAnalyticsProductAdded } from "../../core/useCases/TrackAnalytics/ProductAdded/TrackAnalyticsProductAdded";
import { TrackAnalyticsProductViewed } from "../../core/useCases/TrackAnalytics/ProductViewed/TrackAnalyticsProductViewed";
import { formatPriceWithCurrency } from "../../utils/formatUtils";
import { ApplyCouponToCart } from "../../core/useCases/ApplyCouponToCart/ApplyCouponToCart";

export interface ProductView {
  showCrossSellProducts(crossSellProducts: ProductVM[]);

  showSubscriptions(subscriptionProducts: ProductVM[]);

  showProduct(productToVM: ProductVM);

  showLoader();

  hideLoader();

  selectSubscription(subscription: ProductVM);

  setUserLoggedIn(isLoggedIn: boolean);

  showSelectSubscriptionPlan();

  hideSelectSubscriptionPlan();

  navigateToAccessories(locale: string, productId: string);

  navigateToCheckout(locale: string);

  navigateToSubscriptionPage(locale: string);

  showReviewsSummary(reviewsSummary: ReviewsSummaryVM);

  showTotalPrice(price: string, priceWithoutSale?: string);

  updateSelectedVariants(selectedVariants: VariantVM[]);

  showError(message: string);
}

export class ProductPresenter {
  private view: ProductView;
  private addToCartUseCase: AddToCart;
  private applyCouponToCart: ApplyCouponToCart;
  private isUserLoggedIn: IsUserLoggedIn;
  private getCart: GetCart;
  private getLocalizationCode: GetLocalizationCode;
  private getProduct: GetProduct;
  private getReviewsSummary: GetReviewsSummary;
  private getUserSubscriptionStatus: GetUserSubscriptionStatus;
  private trackAnalyticsProductAdded: TrackAnalyticsProductAdded;
  private trackAnalyticsProductViewed: TrackAnalyticsProductViewed;
  private crossSellProducts: Product[];
  private product: Product | null;
  private reviewsSummary: ReviewsSummary | null;
  private selectedCrossSellItems: ItemVM[];
  private selectedMultipleItems: ItemVM[];
  private selectedSubscription: ItemVM | null;
  private selectedVariants: Variant[];
  private subscriptions: Product[];

  constructor(
    view: ProductView,
    addToCartUseCase: AddToCart,
    applyCouponToCart: ApplyCouponToCart,
    isUserLoggedIn: IsUserLoggedIn,
    getCart: GetCart,
    getLocalizationCode: GetLocalizationCode,
    getProduct: GetProduct,
    getReviewsSummary: GetReviewsSummary,
    getUserSubscriptionStatus: GetUserSubscriptionStatus,
    trackAnalyticsProductAdded: TrackAnalyticsProductAdded,
    trackAnalyticsProductViewed: TrackAnalyticsProductViewed
  ) {
    this.view = view;
    this.addToCartUseCase = addToCartUseCase;
    this.applyCouponToCart = applyCouponToCart;
    this.isUserLoggedIn = isUserLoggedIn;
    this.getLocalizationCode = getLocalizationCode;
    this.getCart = getCart;
    this.getProduct = getProduct;
    this.getReviewsSummary = getReviewsSummary;
    this.getUserSubscriptionStatus = getUserSubscriptionStatus;
    this.trackAnalyticsProductAdded = trackAnalyticsProductAdded;
    this.trackAnalyticsProductViewed = trackAnalyticsProductViewed;
    this.crossSellProducts = [];
    this.product = null;
    this.reviewsSummary = null;
    this.selectedCrossSellItems = [];
    this.selectedMultipleItems = [];
    this.selectedSubscription = null;
    this.selectedVariants = [];
    this.subscriptions = [];
  }

  start = async (slug: string) => {
    try {
      this.view.showLoader();
      await this.initializeProduct(slug);
      if (!this.product?.isSubscription) await this.initializeReviews();
      this.initializeSelectedVariants();
      await this.initializeUser();
      this.updateTotalPrice();
      await this.initializeCrossSellProducts(this.product!.crossSellProducts);
      await this.initializeSubscriptions(this.product!.subscriptions);
      this.trackAnalyticsProductViewed.execute(this.parseTrackAnalyticsProductViewedRequest()).then();
      this.view.hideLoader();
    } catch (e: any) {
      this.view.hideLoader();
      this.view.showError(e.message);
    }
  };

  onVariantUpdate = (variantVM: VariantVM, index: number) => {
    this.selectedVariants.splice(index, 1, {
      ...this.getVariantFromProductVariant(variantVM, this.product!),
      notShowOnCarousel: variantVM.notShowOnCarousel,
      quantity: variantVM.quantity || 1,
    });
    this.updateSelectedVariants();
  };

  onMultipleVariantsSelect = (variantsVM: VariantVM[]) => {
    this.selectedMultipleItems = variantsVM.map((variant: VariantVM) => ({
      productId: this.product!.id,
      quantity: variant?.quantity || 1,
      options: this.getItemOptionsFromVariantVM(variant),
      price: parseFloat(variant.price.replace("$", "")),
    }));
    this.updateTotalPrice();
  };

  onCrossSellProductsSelect = (product: ProductVM) => {
    if (this.isCrossSellProductSelected(product)) return;
    this.selectedCrossSellItems.push({ productId: product.id, quantity: 1 });
    this.updateTotalPrice();
  };

  onCrossSellProductsRemove = (product: ProductVM) => {
    if (!this.isCrossSellProductSelected(product)) return;
    this.selectedCrossSellItems = this.selectedCrossSellItems.filter(
      (selectedItems) => selectedItems.productId !== product.id
    );
    this.updateTotalPrice();
  };

  onCrossSellVariantsSelect = (variants: VariantVM[]) => {
    this.selectedCrossSellItems = variants.map((variant) => ({
      productId: this.getCrossSellProductIdFromVariant(variant),
      quantity: 1,
      variantId: variant.id,
    }));
    this.updateTotalPrice();
  };

  onSelectSubscription = async (subscription: ProductVM | null) => {
    try {
      this.view.showLoader();
      const cart = await this.getCart.execute();
      if (cart.hasSubscription || (await this.userHasActiveSubscription())) {
        if (!this.product?.isSubscription) return await this.addToCart();
        await this.checkNoActiveTrialSubscription();
        throw new TwoActiveSubscriptionsError();
      }
      if (!subscription) throw new NoSubscriptionPlan();
      await this.selectSubscription(subscription);
    } catch (e: any) {
      if (e instanceof ActiveTrialSubscriptionError) {
        const locale = this.getLocalizationCode.execute();
        return this.view.navigateToSubscriptionPage(locale);
      }
      this.view.showError(e.message);
      this.view.hideLoader();
    }
  };

  addToCart = async () => {
    this.view.showLoader();
    try {
      await this.addItemsToCart();
      try {
        if (this.product?.promoCode) await this.applyCouponToCart.execute(this.product.promoCode);
      } catch (error) {
        // DO NOTHING
      }
      const locale = this.getLocalizationCode.execute();
      if (this.hasUpSellsOrRelatedProducts() && !this.isProductRower(this.product!))
        return this.view.navigateToAccessories(locale, this.product!.id);
      this.view.hideLoader();
      this.view.navigateToCheckout(locale);
    } catch (e: any) {
      this.view.hideLoader();
      this.view.showError(e.message);
    }
  };

  onSelectPlan = async (plan: ProductOptionValueVM): Promise<void> => {
    this.selectedSubscription = { ...this.selectedSubscription!, options: [{ name: "Plan", value: plan.name }] };
    this.view.hideSelectSubscriptionPlan();
    await this.addToCart();
  };

  onCloseSelectPlan = () => {
    this.view.hideSelectSubscriptionPlan();
  };

  addVariant = () => {
    this.initializeSelectedVariants();
  };

  removeVariant = (index: number) => {
    this.selectedVariants.splice(index, 1);
    this.updateSelectedVariants();
  };

  private initializeUser = async () => {
    const isLoggedIn = await this.isUserLoggedIn.execute();

    this.view.setUserLoggedIn(isLoggedIn);
  };

  private initializeProduct = async (slug: string) => {
    const product = await this.getProduct.execute(slug);
    this.product = product;
    this.view.showProduct(this.productToVM(product));
  };

  private initializeReviews = async () => {
    try {
      const locale = this.getLocalizationCode.execute();
      const reviewsSummary = await this.getReviewsSummary.execute();
      reviewsSummary.link = `/${locale}/reviews`;
      this.reviewsSummary = reviewsSummary;
      this.view.showReviewsSummary(this.reviewsSummaryToReviewsSummaryVM(reviewsSummary));
    } catch (error) {
      return;
    }
  };

  private productToVM = (product: Product): ProductVM => ({
    bundleItems: product.bundleItems.map((product) => this.productToVM(product)),
    categories: product.categories,
    description: product.description,
    id: product.id,
    images: product.images,
    acceptsMultipleVariants: product.acceptsMultipleVariants,
    hideAddMultiple: product.hideAddMultiple,
    isRower: this.isProductRower(product),
    isSubscription: product.isSubscription,
    mainCrossSellProductId: product.mainCrossSellProductId,
    name: product.name,
    options: product.options.map((option) => this.optionToOptionVM(option)),
    priceWithoutSale: product.priceWithoutSale ? formatPriceWithCurrency(product.priceWithoutSale, "us-EN") : undefined,
    price: formatPriceWithCurrency(product.price, "us-EN"),
    hasSubscriptionPackage: product.hasSubscriptionPackage,
    quantity: product.quantity || 0,
    slug: product.slug,
    specs: product.specs,
    stock: product.stock,
    stockTracking: product.stockTracking,
    canBuyWithoutStock: product.canBuyWithoutStock,
    upSellProducts: product.upSellProducts,
    variants: product.variants.map((variant) => this.variantToVariantVM(variant)),
  });

  private isProductRower = (product: Product): boolean =>
    product.categories?.some((name) => name === "rowers") || product.name.toLowerCase().includes("rower");

  private optionToOptionVM = ({ attributeId, name, values }: ProductOption): ProductOptionVM => ({
    attributeId: attributeId,
    name: name,
    values: values.map(
      ({
        id,
        name,
        description,
        price,
        subscriptionInterval,
        subscriptionTrialDays,
      }: ProductOptionValues): ProductOptionValueVM => ({
        id,
        name,
        description,
        price: formatPriceWithCurrency(price, "us-EN"),
        subscriptionInterval: subscriptionInterval,
        subscriptionTrialDays: subscriptionTrialDays,
      })
    ),
  });

  private variantToVariantVM = ({
    id,
    name,
    price,
    priceWithoutSale,
    description,
    images,
    optionsIds,
    stock,
    notShowOnCarousel,
  }: Variant): VariantVM => ({
    description,
    id,
    images,
    name,
    optionsIds,
    price: formatPriceWithCurrency(price, "us-EN"),
    priceWithoutSale: priceWithoutSale ? formatPriceWithCurrency(priceWithoutSale, "us-EN") : undefined,
    stock,
    notShowOnCarousel,
  });

  private initializeSelectedVariants = () => {
    const productOptionValues = this.product?.options?.flatMap((o) => o.values.map((v) => v.id));
    const availableVariants = this.product?.variants?.filter(
      (v) => productOptionValues?.includes(v.optionsIds[0]) && !this.selectedVariants.some((sv) => sv.id === v.id)
    );

    if (!availableVariants?.length) return;

    const index = availableVariants.findIndex((v) => v.stock > 0);

    this.selectedVariants.push(availableVariants[index > 0 ? index : 0]);
    this.updateSelectedVariants();
  };

  private updateTotalPrice = () => {
    const price = this.getProductPrice() + this.getSelectedCrossSellVariantsTotalPrice();
    const priceWithoutSale = this.getProductPriceWithoutSale() + this.getSelectedCrossSellVariantsTotalPrice();
    const priceWithoutSaleFormatted =
      priceWithoutSale && priceWithoutSale > price ? formatPriceWithCurrency(priceWithoutSale, "us-EN") : undefined;
    this.view.showTotalPrice(formatPriceWithCurrency(price, "us-EN"), priceWithoutSaleFormatted);
  };

  private getSelectedCrossSellVariantsTotalPrice = () =>
    this.selectedCrossSellItems.length
      ? this.selectedCrossSellItems
          .map((item) => item.price || 0)
          .reduce((lastPrice, currentPrice) => lastPrice + currentPrice, 0)
      : 0;

  private getSelectedMultipleItemsTotalPrice = (): number => {
    return this.selectedMultipleItems.length
      ? this.selectedMultipleItems
          .map((item) => item.price || 0)
          .reduce((lastPrice, currentPrice) => lastPrice + currentPrice, 0)
      : 0;
  };

  private getProductPrice = () => {
    if (this.product?.acceptsMultipleVariants)
      return this.getSelectedMultipleItemsTotalPrice() || this.product?.price || 0;

    if (!this.selectedVariants.length) return this.product?.price || 0;

    return this.selectedVariants
      ?.map((item) => item.price * (item.quantity || 1))
      ?.reduce((lastPrice, currentPrice) => lastPrice + currentPrice, 0);
  };

  private getProductPriceWithoutSale = () => {
    if (this.product?.acceptsMultipleVariants)
      return this.getSelectedMultipleItemsTotalPrice() || this.product?.priceWithoutSale || 0;

    if (!this.selectedVariants.length) return this.product?.priceWithoutSale || 0;

    return this.selectedVariants
      ?.map((item) => (item.priceWithoutSale || 0) * (item.quantity || 1))
      ?.reduce((lastPrice, currentPrice) => lastPrice + currentPrice, 0);
  };

  private initializeCrossSellProducts = async (products: string[]) => {
    this.crossSellProducts = [];
    if (!products?.length) return;
    const crossSellProductsNull = await Promise.all(
      products.map(async (productId) => {
        try {
          return await this.getProduct.execute(productId);
        } catch (error) {
          return null;
        }
      })
    );
    crossSellProductsNull.map((product) => {
      if (product !== null && product !== undefined) this.crossSellProducts.push(product);
    });
    this.view.showCrossSellProducts(this.crossSellProducts?.map((product) => this.productToVM(product)) || []);
  };

  private initializeSubscriptions = async (subscriptions: string[]) => {
    if (!subscriptions?.length) return;
    this.subscriptions = await Promise.all(
      subscriptions.map((subscriptionId) => this.getProduct.execute(subscriptionId))
    );
    this.view.showSubscriptions(this.subscriptions?.map((product) => this.productToVM(product)) || []);
    if (subscriptions?.length) this.view.selectSubscription(this.productToVM(this.subscriptions[0]));
  };

  private getVariantFromProductVariant = (variantVM: VariantVM, product: Product) =>
    product.variants.find((variant) => variant.id === variantVM.id)!;

  private updateSelectedVariants = () => {
    this.view.updateSelectedVariants(this.selectedVariants!.map((v) => this.variantToVariantVM(v)));
    this.updateTotalPrice();
  };

  private getItemOptionsFromVariantVM = (variant: VariantVM) => {
    return variant.optionsIds.map((optionId) => {
      const optionFoundFromVariant = this.product!.options.find((option) =>
        option.values.find((optionValue) => optionValue.id === optionId)
      );
      return {
        name: optionFoundFromVariant!.name!,
        value: optionFoundFromVariant!.values.find((optionValue) => optionValue.id === optionId)!.name,
      };
    });
  };

  private getCrossSellProductIdFromVariant = (variant: VariantVM) =>
    this.crossSellProducts.find((product) =>
      product.variants.find((productVariant) => productVariant.id === variant.id)
    )!.id;

  private isCrossSellProductSelected = (product: ProductVM) =>
    this.selectedCrossSellItems.find((selectedItems) => selectedItems.productId === product.id);

  private addItemsToCart = async () => {
    const selectedItems = this.getSelectedItems();
    const items = [...selectedItems, ...this.selectedCrossSellItems];
    if (this.selectedSubscription) items.push(this.selectedSubscription);
    await this.addToCartUseCase.execute(items.map((item) => this.itemVMToItem(item)));
    items.forEach((item) => this.trackAnalyticsProductAdded.execute(item.productId));
  };

  private itemVMToItem = ({ isSubscription, productId, quantity, options, variantId, bundleItems }: ItemVM): Item => ({
    productId,
    quantity,
    options: options?.map((option) => this.itemVMOptionsToItemOptions(option)),
    bundleItems,
    variantId,
    isSubscription,
    hasSubscriptionPackage: this.product?.hasSubscriptionPackage,
  });

  private itemVMOptionsToItemOptions = ({ name, value }: { name: string; value: string }) => ({ name, value });

  private getSelectedItems = () => {
    if (this.product?.isSubscription) return [];
    if (this.product?.acceptsMultipleVariants) return this.selectedMultipleItems.map((item) => this.itemVMToItem(item));

    if (!this.selectedVariants?.length)
      return [
        this.itemVMToItem({
          productId: this.product!.id,
          quantity: 1,
          bundleItems: [],
        }),
      ];

    return this.selectedVariants?.map((variant) =>
      this.itemVMToItem({
        productId: this.product!.id,
        quantity: variant.quantity || 1,
        bundleItems: [],
        variantId: variant.id,
      })
    );
  };

  private hasUpSellsOrRelatedProducts = (): boolean =>
    !!this.product?.upSellProducts?.length || !!this.product?.relatedProducts?.length;

  private reviewsSummaryToReviewsSummaryVM = (reviewsSummary: ReviewsSummary): ReviewsSummaryVM => ({
    link: reviewsSummary.link,
    score: reviewsSummary.score,
  });

  private userHasActiveSubscription = async (): Promise<boolean> => {
    try {
      if (!(await this.isUserLoggedIn.execute())) return false;

      const subscriptionStatus = await this.getUserSubscriptionStatus.execute();
      return subscriptionStatus !== "canceled";
    } catch (e) {
      return false;
    }
  };

  private checkNoActiveTrialSubscription = async () => {
    if (!(await this.isUserLoggedIn.execute())) return;

    const subscriptionStatus = await this.getUserSubscriptionStatus.execute();
    if (subscriptionStatus === "trialing") throw new ActiveTrialSubscriptionError();
  };

  private selectSubscription = async (subscription: ProductVM) => {
    this.selectedSubscription = { productId: subscription!.id, quantity: 1, isSubscription: true };
    if (subscription!.variants.length === 1) return await this.onSelectPlan(subscription.options[0].values[0]);
    this.view.hideLoader();
    this.view.selectSubscription(subscription!);
    this.view.showSelectSubscriptionPlan();
  };

  private parseTrackAnalyticsProductViewedRequest = () => {
    const { images, name, price, id, sku, slug } = this.product!;
    return { imageUrl: images[0], name, price, productId: id, sku: sku || slug, url: window.location.href };
  };
}

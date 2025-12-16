import { ProductOptionValueVM, ProductOptionVM, ProductVM, VariantVM } from "../builderComponents/Product/ProductVM";
import { Product, ProductOption, ProductOptionValues, Variant } from "../core/domain/products/Product";
import { GetProduct } from "../core/useCases/GetProduct/GetProduct";
import { TrackAnalyticsPageView } from "../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";

export interface UpSellsView {
  showLoader();

  hideLoader();

  showUpSells(upSells: ProductVM[]);

  showRelatedProducts(relatedProducts: ProductVM[]);
}

export class UpSellsPresenter {
  private view: UpSellsView;
  private getProduct: GetProduct;
  private trackAnalyticsPageView: TrackAnalyticsPageView;

  constructor(view: UpSellsView, getProduct: GetProduct, trackAnalyticsPageView: TrackAnalyticsPageView) {
    this.view = view;
    this.getProduct = getProduct;
    this.trackAnalyticsPageView = trackAnalyticsPageView;
  }

  start = async (productId: string) => {
    this.view.showLoader();
    await this.trackAnalyticsPageView.execute("UpSells");
    const product = await this.getProduct.execute(productId);
    await this.initializeUpSells(product!.upSellProducts);
    await this.initializeRelatedProducts(product!.relatedProducts);
    this.view.hideLoader();
  };

  private initializeUpSells = async (products: string[]) => {
    if (!products?.length) return;
    const upSells = await Promise.all(products.map((productId) => this.getProduct.execute(productId)));
    this.view.showUpSells(upSells?.map((product) => this.productToVM(product)) || []);
  };

  private initializeRelatedProducts = async (products: string[]) => {
    if (!products?.length) return;
    const relatedProducts = await Promise.all(products.map((productId) => this.getProduct.execute(productId)));
    this.view.showRelatedProducts(relatedProducts?.map((product) => this.productToVM(product)) || []);
  };

  private productToVM = (product: Product): ProductVM => ({
    acceptsMultipleVariants: product.acceptsMultipleVariants,
    bundleItems: product.bundleItems.map((product) => this.productToVM(product)),
    categories: product.categories,
    canBuyWithoutStock: product.canBuyWithoutStock,
    description: product.description,
    id: product.id,
    images: product.images,
    isSubscription: product.isSubscription,
    mainCrossSellProductId: product.mainCrossSellProductId,
    name: product.name,
    options: product.options.map((option) => this.optionToOptionVM(option)),
    price: `$${new Intl.NumberFormat("us-EN").format(product.price) || 0}`,
    quantity: product.quantity || 0,
    hasSubscriptionPackage: product.hasSubscriptionPackage,
    slug: product.slug,
    specs: product.specs,
    stock: product.stock,
    stockTracking: product.stockTracking,
    upSellProducts: product.upSellProducts,
    variants: product.variants.map((variant) => this.variantToVariantVM(variant)),
  });

  private variantToVariantVM = ({ id, name, price, description, images, optionsIds, stock }: Variant): VariantVM => ({
    id,
    name,
    price: `$${new Intl.NumberFormat("us-EN").format(price) || 0}`,
    description,
    images,
    optionsIds,
    stock,
  });

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
        price: `$${new Intl.NumberFormat("us-EN").format(price) || 0}`,
        subscriptionInterval: subscriptionInterval,
        subscriptionTrialDays: subscriptionTrialDays,
      })
    ),
  });
}

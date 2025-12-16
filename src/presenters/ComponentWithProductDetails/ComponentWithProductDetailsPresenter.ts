import { ProductOptionValueVM, ProductOptionVM, ProductVM, VariantVM } from "../../builderComponents/Product/ProductVM";
import { Product, ProductOption, ProductOptionValues, Variant } from "../../core/domain/products/Product";
import { GetProduct } from "../../core/useCases/GetProduct/GetProduct";
import { formatPriceWithCurrency } from "../../utils/formatUtils";

export interface ComponentWithProductDetailsView {
  clearProduct();
  setProduct(product: ProductVM);
}

export class ComponentWithProductDetailsPresenter {
  private view: ComponentWithProductDetailsView;
  private getProduct: GetProduct;

  constructor(view: ComponentWithProductDetailsView, getProduct: GetProduct) {
    this.view = view;
    this.getProduct = getProduct;
  }

  start = async (slug: string) => {
    if (!slug) return;

    try {
      const product = await this.getProduct.execute(slug);

      this.view.setProduct(this.productToVM(product));
    } catch (error) {
      this.view.clearProduct();
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

  private variantToVariantVM = ({ id, name, price, description, images, optionsIds, stock }: Variant): VariantVM => ({
    id,
    name,
    price: formatPriceWithCurrency(price, "us-EN"),
    description,
    images,
    optionsIds,
    stock,
  });
}

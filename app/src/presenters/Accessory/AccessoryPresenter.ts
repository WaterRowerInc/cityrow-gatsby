import { AccessoryVM } from "../../builderComponents/AccessoriesCatalog/AccessoryItem/AccessoryVM";
import { BundleVM } from "../../builderComponents/AccessoriesCatalog/BundleItem/BundleVM";
import { ProductOptionValueVM, ProductOptionVM, VariantVM } from "../../builderComponents/Product/ProductVM";
import { Product, ProductOption, ProductOptionValues, Variant } from "../../core/domain/products/Product";
import { GetBundleProducts } from "../../core/useCases/GetBundleProducts/GetBundleProducts";
import { GetProductsByCategory } from "../../core/useCases/GetProductsByCategory/GetProductsByCategory";
import { formatPriceWithCurrency } from "../../utils/formatUtils";

export interface AccessoryView {
  showLoader();

  hideLoader();

  showAccessoryProducts(accessoryProducts: AccessoryVM[]);

  showBundleProducts(bundleProducts: BundleVM[]);

  showCheckoutButton(): void;
}

export class AccessoryPresenter {
  private view: AccessoryView;
  private getProductsByCategory: GetProductsByCategory;
  private getBundleProducts: GetBundleProducts;

  constructor(view: AccessoryView, getProductsByCategory: GetProductsByCategory, getBundleProducts: GetBundleProducts) {
    this.view = view;
    this.getProductsByCategory = getProductsByCategory;
    this.getBundleProducts = getBundleProducts;
  }

  start = async (queryParamsSearch?: string) => {
    this.view.showLoader();
    const accessoryProducts = await this.getProductsByCategory.execute("accessories");
    this.view.showAccessoryProducts(
      accessoryProducts.map((accessoryProduct) => this.productToAccessoryVM(accessoryProduct))
    );
    if (this.shouldShowCheckoutButton(queryParamsSearch)) this.view.showCheckoutButton();
    const bundleProducts = await this.getBundleProducts.execute();
    this.view.showBundleProducts(bundleProducts.map((bundleProduct) => this.productToBundleVM(bundleProduct)));
    this.view.hideLoader();
  };

  private shouldShowCheckoutButton = (queryParamsSearch?: string) => {
    if (!queryParamsSearch) return false;
    const queryParams = new URLSearchParams(queryParamsSearch);
    return queryParams.get("referrer") === "pdp";
  };

  private productToBundleVM = (product: Product): BundleVM => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    images: product.images,
    description: product.description,
    items: product.bundleItems?.map((item) => item.name) || [],
    price: formatPriceWithCurrency(product.price, "us-EN"),
    priceClarification: product.priceClarification,
    options: product.options.map((option) => this.optionToOptionVM(option)),
  });

  private productToAccessoryVM = (product: Product): AccessoryVM => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle,
    categories: product.categories,
    images: product.images,
    price: formatPriceWithCurrency(product.price, "us-EN"),
    priceWithoutSale: product.priceWithoutSale? formatPriceWithCurrency(product.priceWithoutSale, "us-EN") : undefined,
    options: product.options.map((option) => this.optionToOptionVM(option)),
    variants: product.variants.map((variant) => this.variantToVariantVM(variant)),
    priceRange: product.variants.length
      ? this.getPriceRange(product.variants, product.price)
      : formatPriceWithCurrency(product.price, "us-EN"),
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

  private variantToVariantVM = ({ id, name, price, description, images, optionsIds, stock }: Variant): VariantVM => ({
    id,
    name,
    price: formatPriceWithCurrency(price, "us-EN"),
    description,
    images,
    optionsIds,
    stock,
  });

  private getMinPrice = (previous, current) => (current.price < previous ? current.price : previous);

  private getMaxPrice = (previous, current) => (current.price > previous ? current.price : previous);

  private getPriceRange = (variants: Variant[], price: number): string => {
    const min = variants.reduce(this.getMinPrice, price);
    const max = variants.reduce(this.getMaxPrice, min);
    return min === max
      ? formatPriceWithCurrency(max, "us-EN")
      : `${formatPriceWithCurrency(min, "us-EN")} -
     ${formatPriceWithCurrency(max, "us-EN")}`;
  };
}

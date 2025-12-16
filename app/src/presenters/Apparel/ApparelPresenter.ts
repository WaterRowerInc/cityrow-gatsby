import { ApparelVM } from "../../builderComponents/ApparelCatalog/ApparelVM";
import { ProductOptionValueVM, ProductOptionVM } from "../../builderComponents/Product/ProductVM";
import { Product, ProductOption, ProductOptionValues } from "../../core/domain/products/Product";
import { GetProductsByCategory } from "../../core/useCases/GetProductsByCategory/GetProductsByCategory";
import { formatPriceWithCurrency } from "../../utils/formatUtils";

export interface ApparelView {
  showLoader();

  hideLoader();

  showProducts(products: ApparelVM[]);
}

export class ApparelPresenter {
  private view: ApparelView;
  private getProductsByCategory: GetProductsByCategory;

  constructor(view: ApparelView, getProductsByCategory: GetProductsByCategory) {
    this.view = view;
    this.getProductsByCategory = getProductsByCategory;
  }

  start = async () => {
    this.view.showLoader();
    const products = await this.getProductsByCategory.execute("apparel");
    this.view.showProducts(products?.map(this.productToApparelVM));
    this.view.hideLoader();
  };

  private productToApparelVM = (product: Product): ApparelVM => {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      categories: product.categories,
      images: product.images,
      price: formatPriceWithCurrency(product.price, "us-EN"),
      priceWithoutSale: product.priceWithoutSale
        ? formatPriceWithCurrency(product.priceWithoutSale, "us-EN")
        : undefined,
      options: product.options.map(this.optionToOptionVM),
    };
  };

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

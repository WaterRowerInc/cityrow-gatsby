import { FindAllProducts } from "../core/useCases/FindAllProducts/FindAllProducts";
import { Product } from "../core/domain/products/Product";
import { formatPriceWithCurrency } from "../utils/formatUtils";
import { SwellProductInfoVM } from "../components/SwellProductInfo/SwellProductInfoVM";

export interface SwellProductListView {
  showLoader();

  hideLoader();

  showProducts(products: SwellProductInfoVM[]);
}

export class SwellProductListPresenter {
  private view: SwellProductListView;
  private findAllProducts: FindAllProducts;

  constructor(view: SwellProductListView, FindAllProducts: FindAllProducts) {
    this.view = view;
    this.findAllProducts = FindAllProducts;
  }

  start = async () => {
    this.view.showLoader();
    const products = await this.findAllProducts.execute();
    this.view.showProducts(products.map((product) => this.productToSwellProductInfoVM(product)));
    this.view.hideLoader();
  };

  private productToSwellProductInfoVM = (product: Product): SwellProductInfoVM => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    images: product.images,
    price: formatPriceWithCurrency(product.price, "us-EN"),
  });
}

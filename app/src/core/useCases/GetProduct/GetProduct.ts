import { Product } from "../../domain/products/Product";
import { ProductDoesNotHaveSubscriptionsNeededError } from "../../domain/products/ProductDoesNotHaveSubscriptionsNeededError";
import { ProductService } from "../../domain/products/ProductService";

export class GetProduct {
  private readonly productsService: ProductService;

  constructor(productsService: ProductService) {
    this.productsService = productsService;
  }

  execute = async (slug: string): Promise<Product> => {
    const product = await this.productsService.getFromSlugOrId(slug);
    if (product.hasSubscriptionPackage && !product.subscriptions.length)
      throw new ProductDoesNotHaveSubscriptionsNeededError();
    return product;
  };
}

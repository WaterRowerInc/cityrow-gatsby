import { Product } from "../../domain/products/Product";
import { ProductService } from "../../domain/products/ProductService";

export class GetBundleProducts {
  private readonly productsService: ProductService;

  constructor(productsService: ProductService) {
    this.productsService = productsService;
  }

  execute = async (): Promise<Product[]> => await this.productsService.findBundleProducts();
}

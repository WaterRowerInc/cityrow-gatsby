import { ProductService } from "../../domain/products/ProductService";
import { Product } from "../../domain/products/Product";

export class GetProductsByCategory {
  private readonly productsService: ProductService;

  constructor(productsService: ProductService) {
    this.productsService = productsService;
  }

  execute = async (category: string): Promise<Product[]> =>
    await this.productsService.findPhysicalProductsByCategory(category);
}

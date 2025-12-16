import { ProductService } from "../../domain/products/ProductService";
import { Product } from "../../domain/products/Product";

export class FindAllProducts {
  private readonly productsService: ProductService;

  constructor(productsService: ProductService) {
    this.productsService = productsService;
  }

  execute = async (): Promise<Product[]> => await this.productsService.findAllProducts();
}

import { Product } from "./Product";

export interface ProductService {
  getFromSlugOrId(slugOrId: string): Promise<Product>;

  findPhysicalProductsByCategory(category: string): Promise<Product[]>;

  findAllProducts(): Promise<Product[]>;

  findBundleProducts(): Promise<Product[]>;
}

import { ProductOptionVM } from "../Product/ProductVM";

export interface ApparelVM {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  categories: string[];
  images: string[];
  price: string;
  priceWithoutSale?: string;
  options: ProductOptionVM[];
}

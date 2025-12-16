import { ProductOptionVM, VariantVM } from "../../Product/ProductVM";

export interface AccessoryVM {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  categories: string[];
  images: string[];
  price: string;
  priceWithoutSale?: string;
  priceRange: string;
  options: ProductOptionVM[];
  variants: VariantVM[];
}

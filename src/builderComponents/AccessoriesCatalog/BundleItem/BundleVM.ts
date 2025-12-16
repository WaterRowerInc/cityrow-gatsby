import { ProductOptionVM } from "../../Product/ProductVM";

export interface BundleVM {
  id: string;
  slug: string;
  name: string;
  description: string;
  subtitle: string;
  images: string[];
  price: string;
  priceClarification: string;
  options: ProductOptionVM[];
  items: string[];
}

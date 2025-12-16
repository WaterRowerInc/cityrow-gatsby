import { BuilderImageModel } from "../../../../components/BuilderImage/BuilderImage.type";
import { ItemIncludedType } from "../ItemIncluded/ItemIncludedType";

export default interface ShopAllItemProps {
  imageModel?: BuilderImageModel;
  name: string;
  slug: string;
  priceClarification: string;
  priceDetail: string;
  description: string;
  includes: ItemIncludedType[];
  link: string;
}

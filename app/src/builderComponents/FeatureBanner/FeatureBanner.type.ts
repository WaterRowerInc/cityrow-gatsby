import { FeatureBannerItemType } from "./FeatureBannerItem/FeatureBannerItemType";

export interface FeatureBannerType {
  title: string;
  description: string;
  features: FeatureBannerItemType[];
  theme: string;
}

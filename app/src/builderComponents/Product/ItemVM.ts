export interface ItemVM {
  bundleItems?: ItemVM[];
  bundleItemIndex?: number;
  isSubscription?: boolean;
  options?: { name: string; value: string }[];
  price?: number;
  productId: string;
  quantity: number;
  variantId?: string;
}

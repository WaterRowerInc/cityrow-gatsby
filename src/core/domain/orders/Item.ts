export interface Item {
  bundleItems?: Item[];
  hasSubscriptionPackage?: boolean;
  isSubscription?: boolean;
  options?: { name: string; value: string }[];
  productId: string;
  quantity: number;
  variantId?: string;
}

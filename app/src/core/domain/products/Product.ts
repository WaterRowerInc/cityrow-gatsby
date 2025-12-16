export interface Product {
  acceptsMultipleVariants?: boolean;
  bundleItems: Product[];
  canBuyWithoutStock: boolean;
  categories: string[];
  crossSellProducts: string[];
  description: string;
  hideAddMultiple?: boolean;
  id: string;
  images: string[];
  isSubscription: boolean;
  mainCrossSellProductId?: string;
  name: string;
  options: ProductOption[];
  promoCode?: string;
  price: number;
  priceWithoutSale?: number;
  priceClarification: string;
  quantity?: number;
  relatedProducts: string[];
  hasSubscriptionPackage: boolean;
  sku: string;
  slug: string;
  specs?: string;
  stock: number;
  stockTracking: boolean;
  subscriptions: string[];
  subtitle: string;
  upSellProducts: string[];
  variants: Variant[];
}

export interface ProductOption {
  attributeId: string;
  name?: string;
  values: ProductOptionValues[];
}

export interface ProductOptionValues {
  id: string;
  name: string;
  description: string;
  price: number;
  subscriptionInterval?: string;
  subscriptionTrialDays?: number;
  stripePlanId?: string;
}

export interface Variant {
  id: string;
  name: string;
  optionsIds: string[];
  images: string[];
  stock: number;
  price: number;
  priceWithoutSale?: number;
  description: any;
  quantity?: number;
  notShowOnCarousel?: boolean;
}

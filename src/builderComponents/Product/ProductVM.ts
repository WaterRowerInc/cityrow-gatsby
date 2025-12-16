export interface ProductVM {
  acceptsMultipleVariants?: boolean;
  bundleItems: ProductVM[];
  canBuyWithoutStock: boolean;
  categories: string[];
  description: string;
  hasSubscriptionPackage: boolean;
  hideAddMultiple?: boolean;
  id: string;
  images: string[];
  isRower?: boolean;
  isSubscription: boolean;
  mainCrossSellProductId?: string;
  name: string;
  options: ProductOptionVM[];
  price: string;
  priceWithoutSale?: string;
  quantity: number;
  slug: string;
  specs?: string;
  stock: number;
  stockTracking: boolean;
  upSellProducts: string[];
  variants: VariantVM[];
}

export interface ProductOptionVM {
  attributeId: string;
  name?: string;
  values: ProductOptionValueVM[];
}

export interface ProductOptionValueVM {
  id: string;
  name: string;
  description: string;
  price: string;
  subscriptionInterval?: string;
  subscriptionTrialDays?: number;
}

export interface VariantVM {
  description: string;
  id: string;
  images: string[];
  name: string;
  optionsIds: string[];
  price: string;
  priceWithoutSale?: string;
  quantity?: number;
  stock: number;
  notShowOnCarousel?: boolean;
}

export interface OrderVM {
  account: {
    firstName: string;
  };
  accountId: string;
  cardToken: string;
  currency: string;
  coupon: string;
  delivery: string;
  discounts: string;
  id: string;
  items: OrderItemVM[];
  number: string;
  paymentMethod: "klarna" | "card";
  shipmentTotal: number;
  shipping: {
    name: string;
    street: string;
    city: string;
    zip: string;
    state: string;
    deliveryType: string;
  };
  subTotal: string;
  taxes: string;
  total: string;
}

export interface OrderItemVM {
  discount: number;
  discountEach: number;
  hasSalePrice: boolean;
  name: string;
  options: OrderItemOptionVM[];
  originalPrice: string;
  product: OrderItemProductVM;
  price: string;
  quantity: number;
}

export interface OrderItemOptionVM {
  id: string;
  name?: string;
  value: string;
}

export interface OrderItemProductVM {
  discountTitle?: string;
  id: string;
  name: string;
  options: OrderItemProductOptionVM[];
  sku: string;
  isSubscription: boolean;
}

export interface OrderItemProductOptionVM {
  attributeId: string;
  values: OrderItemProductOptionValueVM[];
}

export interface OrderItemProductOptionValueVM {
  name: string;
  paymentPlanId: string;
}

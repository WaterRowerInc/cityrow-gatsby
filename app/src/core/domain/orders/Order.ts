export interface Order {
  account: {
    firstName: string;
  };
  accountId: string;
  cardToken: string;
  coupon: string;
  currency: string;
  discounts: number;
  id: string;
  items: OrderItem[];
  number: string;
  paymentMethod: "klarna" | "card";
  shipmentTotal: number;
  shipping: {
    city: string;
    country: string;
    deliveryType: string;
    name: string;
    state: string;
    street: string;
    zip: string;
  };
  subTotal: number;
  taxes: number;
  total: number;
}

export interface OrderItem {
  discount: number;
  discountEach: number;
  hasSalePrice: boolean;
  name: string;
  options: OrderItemOption[];
  originalPrice: number;
  product: OrderItemProduct;
  price: number;
  quantity: number;
}

export interface OrderItemOption {
  id: string;
  name?: string;
  value: string;
}

export interface OrderItemProduct {
  discountTitle?: string;
  id: string;
  isSubscription: boolean;
  name: string;
  options: OrderItemProductOption[];
  sku: string;
}

export interface OrderItemProductOption {
  attributeId: string;
  values: OrderItemProductOptionValue[];
}

export interface OrderItemProductOptionValue {
  name: string;
  paymentPlanId: string;
}

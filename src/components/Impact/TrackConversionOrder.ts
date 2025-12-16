export interface TrackConversionOrder {
  currencyCode: string;
  customerCountry: string;
  customerEmail: string;
  customerId: string;
  customerStatus: string;
  items: TrackConversionOrderItem[];
  orderId: string;
  orderDiscount: number;
  orderPromoCode: string;
  orderShippingCost: number;
  orderTax: number;
  promotionalCode: string;
  subTotal: number;
}

export interface TrackConversionOrderItem {
  category: string;
  discount: number;
  totalDiscount: number;
  name: string;
  quantity: number;
  sku: string;
  subTotal: number;
}

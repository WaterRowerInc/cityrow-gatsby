export interface KlarnaSessionRequest {
  address?: string;
  amount: number;
  apartment?: string;
  city?: string;
  country?: string;
  currency: string;
  email: string;
  firstName: string;
  items: KlarnaItemsRequest[];
  lastName: string;
  locale: string;
  phone: string;
  postalCode?: string;
  state?: string;
}

export interface KlarnaItemsRequest {
  amount?: number;
  currency: string;
  description: string;
  quantity: number;
}

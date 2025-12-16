import { KlarnaSession } from "../payment/KlarnaSession";
import { Card } from "../payment/Card";

export interface UpdateCartRequest {
  account?: {
    email: string;
    contactMe?: boolean;
    password?: string;
  };
  address?: string;
  amount?: number;
  authorizationToken?: string;
  card?: Card;
  city?: string;
  country?: string;
  currency?: string;
  firstName?: string;
  klarnaSession?: KlarnaSession;
  lastName?: string;
  paymentIntent?: string;
  paymentMethod?: string;
  phone?: string;
  postalCode?: string;
  shipping?: {
    service: string | null;
  };
  state?: string;
}

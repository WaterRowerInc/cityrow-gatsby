import { KlarnaSession } from "../../core/domain/payment/KlarnaSession";
import { Card } from "../../core/domain/payment/Card";

export interface CheckoutFormVM {
  accountEmail?: string;
  address?: string;
  apartment?: string;
  authorizationToken?: string;
  card?: Card;
  city?: string;
  contactMe?: boolean;
  country?: string;
  firstName: string;
  klarnaSession?: KlarnaSession;
  lastName: string;
  password?: string;
  paymentMethod: string;
  phone: string;
  postalCode?: string;
  state?: string;
  userEmail: string;
}

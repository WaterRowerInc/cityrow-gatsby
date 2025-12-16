export interface Card {
  token: string;
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  addressCheck: boolean | null;
  cvcCheck: boolean | null;
  zipCheck: boolean | null;
}

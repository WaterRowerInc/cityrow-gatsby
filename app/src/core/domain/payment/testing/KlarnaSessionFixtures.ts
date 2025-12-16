import { shippingFixtures } from "../../orders/testing/ShippingFixtures";

export const klarnaSessionFixtures = {
  aKlarnaSession: {
    id: "aSessionId",
    paymentMethods: "pay_over_time",
    token: "aToken",
  },
  aKlarnaSessionRequest: {
    address: "Olive Drive",
    amount: 4000,
    apartment: "560",
    city: "Ellinwood",
    country: "US",
    currency: "usd",
    email: "test@test.com",
    firstName: "Test",
    items: [
      { amount: 2000, currency: "usd", description: "an item", quantity: 2 },
      { amount: 0, currency: "usd", description: "Shipping", quantity: 1 },
    ],
    lastName: "User",
    locale: shippingFixtures.aLocalizationCode,
    phone: "620-564-3737",
    postalCode: "67526",
    state: "KS",
  },

  aKlarnaSessionRequestWithDiscountsAndTaxes: {
    address: "Olive Drive",
    amount: 4010,
    apartment: "560",
    city: "Ellinwood",
    country: "US",
    currency: "usd",
    email: "test@test.com",
    firstName: "Test",
    items: [
      { amount: 2000, currency: "usd", description: "an item", quantity: 2 },
      { amount: 750, currency: "usd", description: "Shipping", quantity: 1 },
      { amount: -550, currency: "usd", description: "Coupon", quantity: 1 },
      { amount: -750, currency: "usd", description: "Promo", quantity: 1 },
      { amount: 560, currency: "usd", description: "Taxes", quantity: 1 },
    ],
    lastName: "User",
    locale: shippingFixtures.aLocalizationCode,
    phone: "620-564-3737",
    postalCode: "67526",
    state: "KS",
  },
};

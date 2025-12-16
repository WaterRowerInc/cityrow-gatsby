import { PaymentInfoEnteredRequest } from "../../../domain/analytics/PaymentInfoEnteredRequest";
import { Cart } from "../../../domain/orders/Cart";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsPaymentInfoEntered {
  private readonly cart: Cart;
  private readonly trackAnalytics: TrackAnalytics;

  constructor(cart: Cart, trackAnalytics: TrackAnalytics) {
    this.cart = cart;
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (paymentMethod: string) =>
    this.trackAnalytics.execute("Payment Info Entered", this.parseOptions(paymentMethod));

  private parseOptions = (paymentMethod: string): PaymentInfoEnteredRequest => ({
    cart_id: this.cart.id,
    payment_method: paymentMethod,
    shipping_method: this.cart.shippingMethod,
  });
}

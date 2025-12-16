import { deepEqual, instance, mock, verify } from "ts-mockito";
import { TrackAnalyticsPaymentInfoEntered } from "./TrackAnalyticsPaymentInfoEntered";
import { Cart } from "../../../domain/orders/Cart";
import { CartBuilder } from "../../../domain/orders/testing/CartBuilder";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsPaymentInfoEntered should", () => {
  it("track the payment info entered event in the analytics service with the user logged in", async () => {
    cart.id = "someCartId";
    cart.shippingMethod = "aShippingMethod";
    const aPaymentInfoEnteredRequest = {
      cart_id: cart.id,
      payment_method: aPaymentMethod,
      shipping_method: cart.shippingMethod,
    };

    await trackAnalyticsPaymentInfoEntered().execute(aPaymentMethod);

    verify(trackAnalytics.execute("Payment Info Entered", deepEqual(aPaymentInfoEnteredRequest))).called();
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    cart.reset();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsPaymentInfoEntered(): TrackAnalyticsPaymentInfoEntered {
    return new TrackAnalyticsPaymentInfoEntered(cart, instance(trackAnalytics));
  }

  let cart: Cart;
  let trackAnalytics: TrackAnalytics;
  const aPaymentMethod = "aPaymentMethod";
});

import { deepEqual, instance, mock, verify } from "ts-mockito";
import { TrackAnalyticsShipmentInfoEntered } from "./TrackAnalyticsShipmentInfoEntered";
import { Cart } from "../../../domain/orders/Cart";
import { CartBuilder } from "../../../domain/orders/testing/CartBuilder";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsShipmentInfoEntered should", () => {
  it("track the shipment info entered event in the analytics service with the user logged in", async () => {
    cart.id = "someCartId";
    cart.shippingMethod = "aShippingMethod";
    const aShipmentInfoEnteredRequest = {
      cart_id: cart.id,
      payment_method: aPaymentMethod,
      shipping_method: cart.shippingMethod,
    };

    await trackAnalyticsShipmentInfoEntered().execute(aPaymentMethod);

    verify(trackAnalytics.execute("Shipment Info Entered", deepEqual(aShipmentInfoEnteredRequest))).called();
  });

  beforeEach(() => {
    cart = new CartBuilder().build();
    cart.reset();
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsShipmentInfoEntered(): TrackAnalyticsShipmentInfoEntered {
    return new TrackAnalyticsShipmentInfoEntered(cart, instance(trackAnalytics));
  }

  let cart: Cart;
  let trackAnalytics: TrackAnalytics;
  const aPaymentMethod = "aPaymentMethod";
});

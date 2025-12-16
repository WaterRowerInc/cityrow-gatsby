import { SubscriptionService } from "../../domain/subscriptions/SubscriptionService";
import { SubscriptionRequest } from "../../domain/subscriptions/SubscriptionRequest";
import { PaymentService } from "../../domain/payment/PaymentService";
import { Cart } from "../../domain/orders/Cart";
import { Order } from "../../domain/orders/Order";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

export class CreateSubscription {
  private readonly cart: Cart;
  private readonly paymentService: PaymentService;
  private readonly subscriptionService: SubscriptionService;

  constructor(cart: Cart, paymentService: PaymentService, subscriptionService: SubscriptionService) {
    this.cart = cart;
    this.paymentService = paymentService;
    this.subscriptionService = subscriptionService;
  }

  execute = async (order: Order) => {
    try {
      const paymentPlanId = await this.getPaymentPlanId(order);
      const subscriptionRequest = this.createSubscriptionRequest(paymentPlanId, order);
      if (order.paymentMethod === "klarna")
        return await this.subscriptionService.subscribeWithKlarna(subscriptionRequest);
      if (this.cart.hasRower()) return await this.subscriptionService.createNotStartedSubscription(subscriptionRequest);
      await this.subscriptionService.createSubscription(subscriptionRequest);
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };

  private getPaymentPlanId = async (order: Order): Promise<string> => {
    const subscriptionPlan = this.cart.getSubscription();
    const stripePlanId = order!.items
      .find((item) =>
        item.product.options.find((option) => option.values.find((value) => value.name === subscriptionPlan))
      )!
      .product.options.find((option) => option.values.find((value) => value.name === subscriptionPlan))!
      .values.find((value) => value.name === subscriptionPlan)!.paymentPlanId;
    const stripePlan = await this.paymentService.getPaymentPlanFromStripePlanId(stripePlanId);
    return stripePlan.paymentPlanId;
  };

  private createSubscriptionRequest = (paymentPlanId: string, order: Order): SubscriptionRequest => ({
    country: order.shipping.country,
    couponCode: this.cart.findCouponCode(),
    [order.paymentMethod === "klarna" ? "source" : "paymentMethod"]: order.cardToken,
    paymentPlanId,
    postalCode: order.shipping.zip,
    state: order.shipping.state,
  });
}

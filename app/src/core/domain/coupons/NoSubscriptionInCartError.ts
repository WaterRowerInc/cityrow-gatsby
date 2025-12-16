import { DomainError } from "../errors/DomainError";

export class NoSubscriptionInCartError extends DomainError {
  constructor() {
    super(
      "The coupon you are adding is for a subscription, and you need to have a subscription in your cart to apply it"
    );
  }
}

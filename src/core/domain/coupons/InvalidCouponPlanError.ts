import { DomainError } from "../errors/DomainError";

export class InvalidCouponPlanError extends DomainError {
  constructor() {
    super(
      "The coupon you want to add is for a different subscription plan. Example: You have a Monthly subscription and the coupon is for Yearly subscriptions"
    );
  }
}

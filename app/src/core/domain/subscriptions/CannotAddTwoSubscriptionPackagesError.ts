import { DomainError } from "../errors/DomainError";

export class CannotAddTwoSubscriptionPackagesError extends DomainError {
  constructor() {
    super(
      "You may only purchase 1 product that requires a subscription at a time. If you want to buy 2 products that require a subscription, please make a second purchase after buying your first product."
    );
  }
}

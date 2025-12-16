import { DomainError } from "../errors/DomainError";

export class ProductDoesNotHaveSubscriptionsNeededError extends DomainError {
  constructor() {
    super(`The product requires subscriptions but doesn't have any assigned`);
  }
}

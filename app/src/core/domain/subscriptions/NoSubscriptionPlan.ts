import { DomainError } from "../errors/DomainError";

export class NoSubscriptionPlan extends DomainError {
  constructor() {
    super("There is no Subscription for the current product");
  }
}

import { DomainError } from "../errors/DomainError";

export class ActiveTrialSubscriptionError extends DomainError {
  constructor() {
    super("You have an active trial subscription, please go to the subscription page to manage your subscriptions");
  }
}

import { DomainError } from "../errors/DomainError";

export class AlreadyHaveActiveSubscriptionError extends DomainError {
  constructor() {
    super(
      "You already have an active subscription. If you want to buy an additional subscription you must log out and use a separate email to create a different account at checkout."
    );
  }
}

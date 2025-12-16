import { DomainError } from "../errors/DomainError";

export class TwoActiveSubscriptionsError extends DomainError {
  constructor() {
    super(
      "You may only purchase 1 subscription. If you want to buy an additional subscription you must make a second purchase and use a separate email to create a different account at checkout."
    );
  }
}

import { DomainError } from "../errors/DomainError";

export class NoPaymentInfoError extends DomainError {
  constructor() {
    super("No payment info found for the current user");
  }
}

import { DomainError } from "../errors/DomainError";

export class CreatePaymentError extends DomainError {
  constructor(message: string) {
    super(`There was an error on the payment creation: ${message}`);
  }
}

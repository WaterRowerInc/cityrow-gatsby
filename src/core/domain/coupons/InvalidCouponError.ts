import { DomainError } from "../errors/DomainError";

export class InvalidCouponError extends DomainError {
  constructor() {
    super("Your coupon code was not found or no longer valid");
  }
}

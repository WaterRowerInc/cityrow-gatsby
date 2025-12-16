import { DomainError } from "../errors/DomainError";

export class ItemDoesNotExistOnCartError extends DomainError {
  constructor() {
    super(
      "This item doesn't exist inside the cart"
    );
  }
}

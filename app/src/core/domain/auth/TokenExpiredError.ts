import { DomainError } from "../errors/DomainError";

export class TokenExpiredError extends DomainError {
  constructor() {
    super(
      "Your link has expired."
    );
  }
}

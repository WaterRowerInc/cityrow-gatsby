import { DomainError } from "../errors/DomainError";

export class PasswordsDontMatchError extends DomainError {
  constructor() {
    super(`Your new password doesn't match the confirm password`);
  }
}

import { DomainError } from "../errors/DomainError";

export class EmailNotFoundError extends DomainError {
  constructor() {
    super(
      "This email cannot be found. Make sure the email you entered exactly matches the one used to create your account."
    );
  }
}

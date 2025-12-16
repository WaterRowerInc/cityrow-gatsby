import { DomainError } from "../errors/DomainError";

export class BadCredentialsError extends DomainError {
  constructor() {
    super(`Unable to log in with the provided credentials`);
  }
}

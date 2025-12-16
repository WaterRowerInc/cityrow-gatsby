import { DomainError } from "../errors/DomainError";

export class InvalidOldPasswordError extends DomainError {
  constructor() {
    super(`Invalid old password`);
  }
}

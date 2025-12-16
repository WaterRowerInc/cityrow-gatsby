import { DomainError } from "../errors/DomainError";

export class NotExpectedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

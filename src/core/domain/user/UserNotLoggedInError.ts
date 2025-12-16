import { DomainError } from "../errors/DomainError";

export class UserNotLoggedInError extends DomainError {
  constructor() {
    super("The user is not logged in");
  }
}

import { DomainError } from "./DomainError";

export class ConnectivityIssuesError extends DomainError {
  constructor() {
    super(`Please check your internet connection`);
  }
}

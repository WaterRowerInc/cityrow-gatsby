import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { SessionStorage } from "../../domain/auth/SessionStorage";

export class IsUserLoggedIn {
  private readonly sessionStorage: SessionStorage;

  constructor(sessionStorage: SessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  execute = async (): Promise<boolean> => {
    try {
      return await this.sessionStorage.hasSession();
    } catch (error: any) {
      throw new NotExpectedError(error.message);
    }
  };
}

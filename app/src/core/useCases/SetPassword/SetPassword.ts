import { TokenExpiredError } from "../../domain/auth/TokenExpiredError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { AuthService } from "../../domain/auth/AuthService";

export class SetPassword {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  execute = async (token: string, password: string): Promise<void> => {
    try {
      return await this.authService.setPassword(token, password);
    } catch (e: any) {
      if (e?.message === "ValidationError") throw new TokenExpiredError();
      throw new NotExpectedError(e.message);
    }
  };
}

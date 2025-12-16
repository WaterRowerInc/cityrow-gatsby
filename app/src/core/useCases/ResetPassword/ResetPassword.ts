import { NotExpectedError } from "./../../domain/orders/NotExpectedError";
import { EmailNotFoundError } from "./../../domain/auth/EmailNotFoundError";
import { AuthService } from "../../domain/auth/AuthService";

export class ResetPassword {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  execute = async (email: string): Promise<void> => {
    try {
      return await this.authService.resetPassword(email);
    } catch (e: any) {
      if (e?.message == "ValidationError") throw new EmailNotFoundError();
      throw new NotExpectedError(e.message);
    }
  };
}

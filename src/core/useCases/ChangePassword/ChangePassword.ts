import { AuthService } from "../../domain/auth/AuthService";
import { PasswordsDontMatchError } from "../../domain/auth/PasswordsDontMatchError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { GetUser } from "../GetUser/GetUser";

export class ChangePassword {
  private readonly authService: AuthService;
  private readonly getUser: GetUser;

  constructor(authService: AuthService, getUser: GetUser) {
    this.authService = authService;
    this.getUser = getUser;
  }

  execute = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
    if (newPassword !== confirmPassword) throw new PasswordsDontMatchError();
    try {
      const user = await this.getUser.execute();
      return this.authService.changePassword(currentPassword, newPassword, user.pk!);
    } catch (e: any) {
      if (e instanceof UserNotLoggedInError) throw e;
      throw new NotExpectedError(e.message);
    }
  };
}

import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { AuthService } from "../../domain/auth/AuthService";

export class DeleteUser {
  private readonly authService: AuthService;
  private readonly userStorage: UserStorage;
  private readonly sessionStorage: SessionStorage;

  constructor(authService: AuthService, userStorage: UserStorage, sessionStorage: SessionStorage) {
    this.authService = authService;
    this.userStorage = userStorage;
    this.sessionStorage = sessionStorage;
  }

  execute = async () => {
    await this.authService.deleteUser();
    // noinspection JSVoidFunctionReturnValueUsed
    await Promise.all([this.sessionStorage.remove(), this.userStorage.remove()]);
  };
}

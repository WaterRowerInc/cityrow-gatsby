import { AuthService } from "../../domain/auth/AuthService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { User } from "../../domain/user/User";
import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { UserCallback, UserStorage, UserSubscription } from "../../domain/user/UserStorage";
import { NotExpectedError } from "./../../domain/orders/NotExpectedError";

export class GetUser {
  private readonly userStorage: UserStorage;
  private readonly sessionStorage: SessionStorage;
  private readonly authService: AuthService;

  constructor(userStorage: UserStorage, authService: AuthService, sessionStorage: SessionStorage) {
    this.userStorage = userStorage;
    this.authService = authService;
    this.sessionStorage = sessionStorage;
  }

  execute = async (): Promise<User> => {
    try {
      const user = await this.userStorage.get();
      const hasSession = await this.sessionStorage.hasSession();

      if (hasSession && user) return user;
      if (hasSession && !user) return await this.getUserFromAuthService();

      if (!hasSession && user) this.userStorage.remove();
      throw new UserNotLoggedInError();
    } catch (error: any) {
      if (error instanceof UserNotLoggedInError) throw error;
      throw new NotExpectedError(error.message);
    }
  };

  private getUserFromAuthService = async (): Promise<User> => {
    const userData = await this.authService.getUser();
    this.userStorage.store(userData);
    return userData;
  };

  subscribe = (callback: UserCallback): UserSubscription => this.userStorage.subscribe(callback);
}

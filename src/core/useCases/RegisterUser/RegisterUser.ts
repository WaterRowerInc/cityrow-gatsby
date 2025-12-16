import { AuthService } from "../../domain/auth/AuthService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { EmailAlreadyRegisteredError } from "../../domain/auth/EmailAlreadyRegisteredError";
import { RegisterUserRequest } from "../../domain/auth/RegisterUserRequest";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

export class RegisterUser {
  private readonly authService: AuthService;
  private readonly identifyAnalyticsUser: IdentifyAnalyticsUser;
  private readonly sessionStorage: SessionStorage;
  private readonly trackAnalytics: TrackAnalytics;
  private readonly userStorage: UserStorage;

  constructor(
    authService: AuthService,
    identifyAnalyticsUser: IdentifyAnalyticsUser,
    sessionStorage: SessionStorage,
    trackAnalytics: TrackAnalytics,
    userStorage: UserStorage
  ) {
    this.authService = authService;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
    this.sessionStorage = sessionStorage;
    this.trackAnalytics = trackAnalytics;
    this.userStorage = userStorage;
  }

  execute = async (registerUserRequest: RegisterUserRequest) => {
    await this.registerUser(registerUserRequest);
    await this.identifyAnalyticsUser.execute({ created_date: new Date(), email: registerUserRequest.email, created_method: "Checkout" });
    await this.trackAccountCreated();
  };

  private registerUser = async (registerUserRequest: RegisterUserRequest) => {
    try {
      const response = await this.authService.registerUser(registerUserRequest);
      await this.sessionStorage.store(response?.token);
      this.userStorage.store(response?.user);
    } catch (e: any) {
      if (e instanceof EmailAlreadyRegisteredError) throw e;
      throw new NotExpectedError(e);
    }
  };

  private trackAccountCreated = async () =>
    await this.trackAnalytics.execute("Account Created", { created_method: "Checkout" });
}

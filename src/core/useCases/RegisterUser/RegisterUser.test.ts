// noinspection JSVoidFunctionReturnValueUsed
import { anything, capture, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { RegisterUser } from "./RegisterUser";
import { AuthService } from "../../domain/auth/AuthService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { EmailAlreadyRegisteredError } from "../../domain/auth/EmailAlreadyRegisteredError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

describe("RegisterUser should", () => {
  it("register a new user if user don't have session", async () => {
    when(authService.registerUser(deepEqual(aRegisterUserRequest))).thenResolve({
      token: someToken,
      user: aRegisterUserRequest,
    });

    await registerUser().execute(aRegisterUserRequest);

    verify(authService.registerUser(aRegisterUserRequest));
    verify(sessionStorage.store(someToken)).called();
    verify(userStorage.store(deepEqual(aRegisterUserRequest))).called();
    verify(identifyAnalyticsUser.execute(anything())).called();
    const [traits] = capture(identifyAnalyticsUser.execute).first();
    expect(traits?.email).toStrictEqual(aRegisterUserRequest.email);
    expect(traits?.created_date?.getDate()).toBeCloseTo(new Date().getDate());
    expect(traits?.created_method).toStrictEqual("Checkout");
    verify(trackAnalytics.execute("Account Created", deepEqual({ created_method: "Checkout" })));
  });

  it("throw a EmailAlreadyRegisteredError if the email is already taken", async () => {
    when(authService.registerUser(deepEqual(aRegisterUserRequest))).thenThrow(new EmailAlreadyRegisteredError());

    await expectThrows(async () => {
      await registerUser().execute(aRegisterUserRequest);
    }, EmailAlreadyRegisteredError);
  });

  it("throw a NotExpectedError if the register user fails besides email already taken", async () => {
    when(authService.registerUser(deepEqual(aRegisterUserRequest))).thenThrow(new NotExpectedError("some error"));

    await expectThrows(async () => {
      await registerUser().execute(aRegisterUserRequest);
    }, NotExpectedError);
  });

  beforeEach(() => {
    authService = mock<AuthService>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    sessionStorage = mock<SessionStorage>();
    trackAnalytics = mock<TrackAnalytics>();
    userStorage = mock<UserStorage>();
  });

  function registerUser(): RegisterUser {
    return new RegisterUser(
      instance(authService),
      instance(identifyAnalyticsUser),
      instance(sessionStorage),
      instance(trackAnalytics),
      instance(userStorage)
    );
  }

  let authService: AuthService;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  let sessionStorage: SessionStorage;
  let trackAnalytics: TrackAnalytics;
  let userStorage: UserStorage;
  const someToken = "someToken";
  const aRegisterUserRequest = {
    firstName: "someFirstName",
    lastName: "someLastName",
    email: "user@test.com",
    pk: "somePk",
  };
});

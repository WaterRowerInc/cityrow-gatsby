import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { instance, mock, verify, when } from "ts-mockito";
import { AuthService } from "../../domain/auth/AuthService";
import { LocalUserStorage } from "../../infrastructure/localStorage/LocalUserStorage";
import { GetUser } from "./GetUser";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

const aUser = { firstName: "Text", lastName: "User", email: "user@test.com" };

describe("GetUser should", () => {
  it("retrieve an user object from userStorage if user has a session", async () => {
    when(sessionStorage.hasSession()).thenResolve(true);
    when(userStorage.get()).thenResolve(aUser);

    const user = await getUser().execute();

    verify(userStorage.get()).called();
    verify(authService.getUser()).never();
    expect(user).toStrictEqual(aUser);
  });

  it("retrieve an user object from authService if user has a session and save it on userStorage", async () => {
    when(sessionStorage.hasSession()).thenResolve(true);
    when(userStorage.get()).thenResolve(null);
    when(authService.getUser()).thenResolve(aUser);

    const user = await getUser().execute();

    verify(userStorage.get()).called();
    verify(authService.getUser()).called();
    verify(userStorage.store(aUser)).called();
    expect(user).toStrictEqual(aUser);
  });

  it("throw a not logged in error if user doesn't have a session", async () => {
    when(sessionStorage.hasSession()).thenResolve(false);

    await expectThrows(async () => {
      await getUser().execute();
    }, UserNotLoggedInError);
  });

  it("throw a not expected error if get user fails", async () => {
    when(sessionStorage.hasSession()).thenResolve(true);
    when(authService.getUser()).thenThrow(new Error());

    await expectThrows(async () => {
      await getUser().execute();
    }, NotExpectedError);
  });

  it("subscribe to user object updates", async () => {
    const mySubscriber = jest.fn();

    getUser().subscribe(mySubscriber);

    verify(userStorage.subscribe(mySubscriber)).called();
  });

  beforeEach(() => {
    userStorage = mock<LocalUserStorage>();
    sessionStorage = mock<SessionStorage>();
    authService = mock<AuthService>();
  });

  function getUser(): GetUser {
    return new GetUser(instance(userStorage), instance(authService), instance(sessionStorage));
  }

  let userStorage: LocalUserStorage;
  let authService: AuthService;
  let sessionStorage: SessionStorage;
});

import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { instance, mock, verify, when } from "ts-mockito";
import { AuthService } from "../../domain/auth/AuthService";
import { DeleteUser } from "./DeleteUser";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

describe("DeleteUser should", () => {
  it("delete the user", async () => {
    await deleteUser().execute();

    verify(authService.deleteUser()).called();
    verify(sessionStorage.remove()).called();
    // noinspection JSVoidFunctionReturnValueUsed
    verify(userStorage.remove()).called();
  });

  it("throw an error if it fails", async () => {
    when(authService.deleteUser()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await deleteUser().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    authService = mock<AuthService>();
    userStorage = mock<UserStorage>();
    sessionStorage = mock<SessionStorage>();
  });

  function deleteUser(): DeleteUser {
    return new DeleteUser(instance(authService), instance(userStorage), instance(sessionStorage));
  }

  let authService: AuthService;
  let userStorage: UserStorage;
  let sessionStorage: SessionStorage;
});

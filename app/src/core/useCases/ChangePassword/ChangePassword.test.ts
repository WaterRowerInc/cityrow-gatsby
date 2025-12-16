import { GetUser } from "./../GetUser/GetUser";
import { instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { AuthService } from "../../domain/auth/AuthService";
import { PasswordsDontMatchError } from "../../domain/auth/PasswordsDontMatchError";
import { ChangePassword } from "./ChangePassword";
import { UserNotLoggedInError } from "../../domain/user/UserNotLoggedInError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";

const currentPassword = "oldPassword";
const newPassword = "newPassword";
const confirmPasswordGood = "newPassword";
const confirmPasswordBad = "passwordThatDoesNotMatch";
const aUser = { firstName: "Test", lastName: "User", email: "user@test.com", pk: "abcdef123456" };

describe("ChangePassword should", () => {
  it("change password if user exists", async () => {
    when(getUser.execute()).thenResolve(aUser);

    await changePassword().execute(currentPassword, newPassword, confirmPasswordGood);

    verify(authService.changePassword(currentPassword, newPassword, aUser.pk)).called();
  });

  it("throw an PasswordsDontMatchError when passwords don't match", async () => {
    await expectThrows(async () => {
      await changePassword().execute(currentPassword, newPassword, confirmPasswordBad);
    }, PasswordsDontMatchError);
  });

  it("throw an UserNotLoggedInError when user is not logged in", async () => {
    when(getUser.execute()).thenThrow(new UserNotLoggedInError());

    await expectThrows(
      async () => await changePassword().execute(currentPassword, newPassword, confirmPasswordGood),
      UserNotLoggedInError
    );
  });

  it("throw an NotExpectedError", async () => {
    when(getUser.execute()).thenThrow(new Error("An unexpected error"));

    await expectThrows(
      async () => await changePassword().execute(currentPassword, newPassword, confirmPasswordGood),
      NotExpectedError
    );
  });

  beforeEach(() => {
    authService = mock<AuthService>();
    getUser = mock<GetUser>();
  });

  function changePassword(): ChangePassword {
    return new ChangePassword(instance(authService), instance(getUser));
  }

  let authService: AuthService;
  let getUser: GetUser;
});

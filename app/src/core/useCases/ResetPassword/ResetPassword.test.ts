import { NotExpectedError } from "./../../domain/orders/NotExpectedError";
import { EmailNotFoundError } from "./../../domain/auth/EmailNotFoundError";
import { capture, instance, mock, when, anything } from "ts-mockito";
import { ResetPassword } from "./ResetPassword";
import { AuthService } from "../../domain/auth/AuthService";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("ResetPassword should", () => {
  it("call the reset password method from the auth service with the respective email", async () => {
    when(authService.resetPassword("mail@mail.com")).thenResolve();

    await resetPassword().execute("mail@mail.com");

    const [email] = capture(authService.resetPassword).last();
    expect(email).toBe("mail@mail.com");
  });

  it("fail with Not found error if service returns validation error", async () => {
    when(authService.resetPassword(anything())).thenThrow(new Error("ValidationError"));

    await expectThrows(async () => {
      await resetPassword().execute("noRegisteredEmail@mail.com");
    }, EmailNotFoundError);
  });

  it("fail if service fails for other reason than valdiation error", async () => {
    when(authService.resetPassword(anything())).thenThrow(new Error("An error"));

    await expectThrows(async () => {
      await resetPassword().execute("mail@mail.com");
    }, NotExpectedError);
  });

  beforeEach(() => {
    authService = mock<AuthService>();
  });

  function resetPassword(): ResetPassword {
    return new ResetPassword(instance(authService));
  }

  let authService: AuthService;
});

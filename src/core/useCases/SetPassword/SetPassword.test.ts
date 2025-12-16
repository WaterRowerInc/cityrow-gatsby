import { TokenExpiredError } from "./../../domain/auth/TokenExpiredError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { capture, instance, mock, when, anything } from "ts-mockito";
import { SetPassword } from "./SetPassword";
import { AuthService } from "../../domain/auth/AuthService";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("SetPassword should", () => {
  it("call the set password method from the auth service with the respective token / password", async () => {
    when(authService.setPassword(aToken, aPassword)).thenResolve();

    await setPassword().execute(aToken, aPassword);

    const [token, password] = capture(authService.setPassword).last();
    expect(token).toBe(aToken);
    expect(password).toBe(aPassword);
  });

  it("fail with token expired error if service returns validation error", async () => {
    when(authService.setPassword(anything(), anything())).thenThrow(new Error("ValidationError"));

    await expectThrows(async () => {
      await setPassword().execute(aToken, aPassword);
    }, TokenExpiredError);
  });

  it("fail if service fails for other reason than valdiation error", async () => {
    when(authService.setPassword(anything(), anything())).thenThrow(new Error("An error"));

    await expectThrows(async () => {
      await setPassword().execute(aToken, aPassword);
    }, NotExpectedError);
  });

  beforeEach(() => {
    authService = mock<AuthService>();
  });

  function setPassword(): SetPassword {
    return new SetPassword(instance(authService));
  }

  let authService: AuthService;

  const aPassword = "aValidPassword";
  const aToken = "aToken";
});

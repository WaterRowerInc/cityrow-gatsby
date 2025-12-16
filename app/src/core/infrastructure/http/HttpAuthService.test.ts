import { anything, instance, mock, verify, when } from "ts-mockito";
import { HttpAuthService } from "./HttpAuthService";
import { HttpClient } from "./HttpClient";
import { GetUser } from "../../useCases/GetUser/GetUser";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { ConnectivityIssuesError } from "../../domain/errors/ConnectivityIssuesError";
import { BadCredentialsError } from "../../domain/auth/BadCredentialsError";
import { InvalidOldPasswordError } from "../../domain/auth/InvalidOldPasswordError";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { AxiosError } from "../../domain/errors/AxiosError";

describe("HttpAuthService should", () => {
  it("perform log in successfully", async () => {
    when(httpClient.post("/auth/login/", anything())).thenResolve(aResponse);

    const { user, token } = await authService().logIn(credentials.email, credentials.password);

    verify(httpClient.post("/auth/login/", anything())).called();
    expect(user).toStrictEqual(aUserInCamelCase);
    expect(token).toBe(aToken);
  });

  it("throw an error for bad credentials when login", async () => {
    when(httpClient.post("/auth/login/", anything())).thenReject(new AxiosError(aBadCredentialsResponse));
    expectThrows(async () => {
      await authService().logIn(credentials.email, credentials.password);
    }, BadCredentialsError);
  });

  it("throw a connectivity error when there is no response when login", async () => {
    when(httpClient.post("/auth/login/", anything())).thenReject(new AxiosError(undefined));
    expectThrows(async () => {
      await authService().logIn(credentials.email, credentials.password);
    }, ConnectivityIssuesError);
  });

  it("perform password change successfully", async () => {
    when(getUser.execute()).thenResolve(aUserInCamelCase);
    when(
      httpClient.post(`/user/${aUserInCamelCase.pk}/change_password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      })
    ).thenResolve(aResponse);

    try {
      const result = await authService().changePassword(oldPassword, newPassword, newPassword);
      expect(result).toBe(undefined);
    } catch (error: any) {
      expect(error.message).not.toBe("Invalid user");
    }
  });

  it("throw an Invalid user error if getUser resolves null", async () => {
    when(getUser.execute()).thenResolve(null);
    when(
      httpClient.post(`/user/${aUserInCamelCase.pk}/change_password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      })
    ).thenResolve(aResponse);

    try {
      const result = await authService().changePassword(oldPassword, newPassword, newPassword);
      expect(result).toBe(undefined);
    } catch (error: any) {
      expect(error.message).toBe("Invalid user");
    }
  });

  it("throw an error for bad credentials when changing password", async () => {
    when(getUser.execute()).thenResolve(aUserInCamelCase);
    when(httpClient.post(`/user/${aUserInCamelCase.pk}/change_password/`, anything())).thenReject(
      new AxiosError(aBadCredentialsResponse)
    );

    expectThrows(async () => {
      await authService().changePassword(oldPassword, newPassword, aUserInCamelCase.pk);
    }, InvalidOldPasswordError);
  });

  it("throw a generic error when response doesn't have an error message", async () => {
    when(getUser.execute()).thenResolve(aUserInCamelCase);
    when(httpClient.post(`/user/${aUserInCamelCase.pk}/change_password/`, anything())).thenReject(
      new Error("My Error")
    );

    expectThrows(async () => {
      await authService().changePassword(oldPassword, newPassword, aUserInCamelCase.pk);
    }, NotExpectedError);
  });

  it("throw a connectivity error when there is no response when changing password", async () => {
    when(getUser.execute()).thenResolve(aUserInCamelCase);
    when(httpClient.post(`/user/${aUserInCamelCase.pk}/change_password/`, anything())).thenReject(
      new AxiosError(undefined)
    );
    expectThrows(async () => {
      await authService().changePassword(oldPassword, newPassword, aUserInCamelCase.pk);
    }, ConnectivityIssuesError);
  });

  beforeEach(() => {
    httpClient = mock<HttpClient>();
    getUser = mock<GetUser>();
  });

  function authService(): HttpAuthService {
    return new HttpAuthService(instance(httpClient));
  }

  let httpClient: HttpClient;
  let getUser: GetUser;

  const credentials = {
    email: "mchiquin@sweatworks.net",
    password: "123456",
  };

  const anUserInSnakeCase = {
    first_name: "Miguel",
    last_name: "Chiquin",
    email: "mchiquin@sweatworks.net",
    pk: "abcdefg123456",
  };

  const aUserInCamelCase = {
    firstName: "Miguel",
    lastName: "Chiquin",
    email: "mchiquin@sweatworks.net",
    pk: "abcdefg123456",
  };
  const aToken = "abcdefg1123456";

  const aResponse = {
    data: {
      user: anUserInSnakeCase,
      token: aToken,
    },
  };

  const aBadCredentialsResponse = {
    data: {
      error_type: "ValidationError",
      errors: [{ message: "Invalid Credentials" }],
    },
  };

  const oldPassword = "oldPassword";
  const newPassword = "newPassword";
});

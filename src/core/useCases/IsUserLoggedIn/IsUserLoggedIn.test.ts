import { SessionStorage } from "../../domain/auth/SessionStorage";
import { instance, mock, verify, when } from "ts-mockito";
import { IsUserLoggedIn } from "./IsUserLoggedIn";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("IsUserLoggedIn should", () => {
  it("get the user session status", async () => {
    when(sessionStorage.hasSession()).thenResolve(true);

    const status = await isUserLoggedIn().execute();

    verify(sessionStorage.hasSession()).called();
    expect(status).toBe(true);
  });

  it("fail if user status call throws an error", async () => {
    when(sessionStorage.hasSession()).thenThrow(new Error("an error"));

    await expectThrows(async () => {
      await isUserLoggedIn().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    sessionStorage = mock<SessionStorage>();
  });

  function isUserLoggedIn(): IsUserLoggedIn {
    return new IsUserLoggedIn(instance(sessionStorage));
  }

  let sessionStorage: SessionStorage;
});

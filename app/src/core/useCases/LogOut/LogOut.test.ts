// noinspection JSVoidFunctionReturnValueUsed

import { instance, mock, verify } from "ts-mockito";
import { LocalSessionStorage } from "../../infrastructure/localStorage/LocalSessionStorage";
import { LocalUserStorage } from "../../infrastructure/localStorage/LocalUserStorage";
import { LogOut } from "./LogOut";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { AnalyticsService } from "../../domain/analytics/AnalyticsService";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

describe("LogOut should", () => {
  it("remove the user, remove token, track the Web Signed Out event, reset the analytics and identify a new user", async () => {
    await logout().execute();

    verify(trackAnalytics.execute("Web Signed Out")).once();
    verify(userStorage.remove()).calledAfter(trackAnalytics.execute("Web Signed Out"));
    verify(sessionStorage.remove()).calledAfter(userStorage.remove());
    verify(analyticsService.reset()).calledAfter(sessionStorage.remove());
  });

  beforeEach(() => {
    analyticsService = mock<AnalyticsService>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    sessionStorage = mock<LocalSessionStorage>();
    trackAnalytics = mock<TrackAnalytics>();
    userStorage = mock<LocalUserStorage>();
  });

  function logout(): LogOut {
    return new LogOut(
      instance(analyticsService),
      instance(identifyAnalyticsUser),
      instance(sessionStorage),
      instance(trackAnalytics),
      instance(userStorage)
    );
  }

  let analyticsService: AnalyticsService;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  let sessionStorage: SessionStorage;
  let trackAnalytics: TrackAnalytics;
  let userStorage: UserStorage;
});

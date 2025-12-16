import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { UserStorage } from "../../../domain/user/UserStorage";
import { TrackAnalytics } from "./TrackAnalytics";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";

describe("TrackAnalytics should", () => {
  it("track the analytics event with the options received", async () => {
    await trackAnalytics().execute(someEvent, anything());

    verify(analyticsService.track(someEvent, anything())).called();
  });

  it("call the http analytics service if analytics track fails", async () => {
    when(analyticsService.track(someEvent, anything())).thenThrow(new Error());
    when(userStorage.getUserId()).thenResolve(aUserId);
    when(userStorage.getAnonymousId()).thenReturn(anAnonymousId);

    await trackAnalytics().execute(someEvent, anything());

    verify(
      httpAnalyticsService.track(
        deepEqual({
          userId: aUserId,
          anonymousId: anAnonymousId,
          event: someEvent,
          properties: anything(),
        })
      )
    ).called();
  });

  beforeEach(() => {
    analyticsService = mock<AnalyticsService>();
    httpAnalyticsService = mock<HttpAnalyticsService>();
    userStorage = mock<UserStorage>();
  });

  function trackAnalytics(): TrackAnalytics {
    return new TrackAnalytics(instance(analyticsService), instance(httpAnalyticsService), instance(userStorage));
  }

  let analyticsService: AnalyticsService;
  let httpAnalyticsService: HttpAnalyticsService;
  let userStorage: UserStorage;
  const aUserId = "aUserId";
  const anAnonymousId = "anAnonymousId";
  const someEvent = "someEvent";
});

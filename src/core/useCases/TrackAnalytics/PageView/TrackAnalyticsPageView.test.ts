import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { TrackAnalyticsPageView } from "./TrackAnalyticsPageView";
import { UserStorage } from "../../../domain/user/UserStorage";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";

describe("TrackAnalyticsPageView should", () => {
  it("track the Page View event in the analytics service with the user logged in", async () => {
    when(analyticsService.trackPageView(aPage)).thenResolve();

    await trackAnalyticsPageView().execute(aPage);

    verify(analyticsService.trackPageView(aPage)).called();
  });

  it("call the page method on the httpAnalyticsService if analytics service trackPageView fails", async () => {
    when(analyticsService.trackPageView(anything())).thenThrow(new Error("an Error"));
    when(userStorage.getUserId()).thenResolve(aUserId);
    when(userStorage.getAnonymousId()).thenReturn(anAnonymousId);

    await trackAnalyticsPageView().execute(aPage);

    verify(httpAnalyticsService.page(deepEqual({ anonymousId: anAnonymousId, name: aPage, userId: aUserId }))).called();
  });

  beforeEach(() => {
    analyticsService = mock<AnalyticsService>();
    httpAnalyticsService = mock<HttpAnalyticsService>();
    userStorage = mock<UserStorage>();
  });

  function trackAnalyticsPageView(): TrackAnalyticsPageView {
    return new TrackAnalyticsPageView(
      instance(analyticsService),
      instance(httpAnalyticsService),
      instance(userStorage)
    );
  }

  let analyticsService: AnalyticsService;
  let httpAnalyticsService: HttpAnalyticsService;
  let userStorage: UserStorage;
  const aPage = "aPage";
  const aUserId = "aUserId";
  const anAnonymousId = "anAnonymousId";
});

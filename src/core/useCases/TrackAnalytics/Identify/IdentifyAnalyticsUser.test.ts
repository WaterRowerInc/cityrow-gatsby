import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { IdentifyAnalyticsUser } from "./IdentifyAnalyticsUser";
import { UserStorage } from "../../../domain/user/UserStorage";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";

describe("Identify Analytics User should", () => {
  it("identify the logged in user", async () => {
    when(userStorage.getUserId()).thenResolve(aUserId);
    when(userStorage.getAnonymousId()).thenReturn(anAnonymousId);

    await identifyAnalyticsUser().execute(someTraits);

    verify(analyticsService.identify(aUserId, deepEqual({ ...someTraits, user_id: aUserId }))).once();
  });

  it("identify without having a logged in user", async () => {
    when(userStorage.getUserId()).thenResolve(undefined);
    await identifyAnalyticsUser().execute(someTraits);

    verify(analyticsService.identify(undefined, deepEqual(someTraits))).once();
  });

  it("call identify on the httpAnalyticsService if analytics fails", async () => {
    when(analyticsService.identify(anything(), anything())).thenThrow(new Error("an Error"));
    when(userStorage.getUserId()).thenResolve(aUserId);
    when(userStorage.getAnonymousId()).thenReturn(anAnonymousId);

    await identifyAnalyticsUser().execute(someTraits);

    verify(
      httpAnalyticsService.identify(
        deepEqual({
          anonymousId: anAnonymousId,
          traits: { ...someTraits, user_id: aUserId },
          userId: aUserId,
        })
      )
    ).once();
  });

  it("call identify with user Id on the httpAnalyticsService if analytics fails", async () => {
    when(analyticsService.identify(anything(), anything())).thenThrow(new Error("an Error"));
    when(userStorage.getUserId()).thenResolve(undefined);
    when(userStorage.getAnonymousId()).thenReturn(anAnonymousId);

    await identifyAnalyticsUser().execute(someTraits);

    verify(
      httpAnalyticsService.identify(
        deepEqual({
          anonymousId: anAnonymousId,
          traits: someTraits,
          userId: undefined,
        })
      )
    ).once();
  });

  beforeEach(() => {
    analyticsService = mock<AnalyticsService>();
    httpAnalyticsService = mock<HttpAnalyticsService>();
    userStorage = mock<UserStorage>();
  });

  function identifyAnalyticsUser(): IdentifyAnalyticsUser {
    return new IdentifyAnalyticsUser(instance(analyticsService), instance(httpAnalyticsService), instance(userStorage));
  }

  let analyticsService: AnalyticsService;
  let httpAnalyticsService: HttpAnalyticsService;
  let userStorage: UserStorage;
  const someTraits = {
    city: "someCity",
    coupon: "someCoupon",
    created_method: "someCreatedMethod",
    currency: "someCurrency",
    email: "user@test.com",
    first_name: "someFirstName",
    last_name: "someLastName",
    state: "someState",
    street: "someStreet",
    total_revenue: 25,
  };
  const aUserId = "aUserId";
  const anAnonymousId = "anAnonymousId";
});

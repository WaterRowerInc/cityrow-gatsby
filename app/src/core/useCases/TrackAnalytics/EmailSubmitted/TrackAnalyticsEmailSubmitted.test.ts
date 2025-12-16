import { deepEqual, instance, mock, verify, when } from "ts-mockito";
import { TrackAnalyticsEmailSubmitted } from "./TrackAnalyticsEmailSubmitted";
import { CountriesRepository } from "../../../domain/localization/CountriesRepository";
import { UserStorage } from "../../../domain/user/UserStorage";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";
import { IdentifyAnalyticsUser } from "../Identify/IdentifyAnalyticsUser";

describe("TrackAnalyticsEmailSubmitted should", () => {
  it("identify the user with the given email", async () => {
    when(countriesRepository.getByBrowserConfiguration()).thenReturn(aCountry);

    await trackAnalyticsProductViewed().execute(anEmail, "an Email Reason");

    verify(identifyAnalyticsUser.execute(deepEqual({ email: anEmail }))).called();
  });

  it("track the Product Viewed event in the analytics service with an email reason", async () => {
    when(countriesRepository.getByBrowserConfiguration()).thenReturn(aCountry);
    when(userStorage.getUserId()).thenResolve(undefined);

    await trackAnalyticsProductViewed().execute(anEmail, "an Email Reason");

    verify(
      trackAnalytics.execute(
        "Email Submitted",
        deepEqual({ ...aRequest, email_reason: "an Email Reason", userId: undefined })
      )
    ).called();
  });

  it("track the Analytics Email Submitted event in the analytics service with the user logged in", async () => {
    when(countriesRepository.getByBrowserConfiguration()).thenReturn(aCountry);
    when(userStorage.getUserId()).thenResolve(aUserId);

    await trackAnalyticsProductViewed().execute(anEmail);

    verify(trackAnalytics.execute("Email Submitted", deepEqual({ ...aRequest, userId: aUserId }))).called();
  });

  beforeEach(() => {
    countriesRepository = mock<CountriesRepository>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    trackAnalytics = mock<TrackAnalytics>();
    userStorage = mock<UserStorage>();
  });

  function trackAnalyticsProductViewed(): TrackAnalyticsEmailSubmitted {
    return new TrackAnalyticsEmailSubmitted(
      instance(countriesRepository),
      instance(identifyAnalyticsUser),
      instance(trackAnalytics),
      instance(userStorage)
    );
  }

  let countriesRepository: CountriesRepository;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  let trackAnalytics: TrackAnalytics;
  let userStorage: UserStorage;
  const anEmail = "anEmail@email.com";
  const aCountry = {
    key: "aCountryCode",
    value: "aCountry",
    text: "aCountry",
  };
  const aUserId = "aUserId";
  const aRequest = {
    email_capture: anEmail,
    postal_capture: "",
    country_capture: aCountry.value,
    email_reason: "newsletter",
    userId: aUserId,
  };
});

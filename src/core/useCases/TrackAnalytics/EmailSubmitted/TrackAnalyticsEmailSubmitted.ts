import { EmailSubmittedRequest } from "../../../domain/analytics/EmailSubmittedRequest";
import { CountriesRepository } from "../../../domain/localization/CountriesRepository";
import { UserStorage } from "../../../domain/user/UserStorage";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";
import { IdentifyAnalyticsUser } from "../Identify/IdentifyAnalyticsUser";

export class TrackAnalyticsEmailSubmitted {
  private readonly countriesRepository: CountriesRepository;
  private readonly identifyAnalyticsUser: IdentifyAnalyticsUser;
  private readonly trackAnalytics: TrackAnalytics;
  private readonly userStorage: UserStorage;

  constructor(
    countriesRepository: CountriesRepository,
    identifyAnalyticsUser: IdentifyAnalyticsUser,
    trackAnalytics: TrackAnalytics,
    userStorage: UserStorage
  ) {
    this.countriesRepository = countriesRepository;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
    this.trackAnalytics = trackAnalytics;
    this.userStorage = userStorage;
  }

  execute = async (email: string, emailReason?: string) => {
    await this.identifyAnalyticsUser.execute({ email });
    return this.trackAnalytics.execute("Email Submitted", await this.parseOptions(email, emailReason));
  };

  private parseOptions = async (email: string, emailReason?: string): Promise<EmailSubmittedRequest> => ({
    email_capture: email,
    postal_capture: "",
    country_capture: this.countriesRepository.getByBrowserConfiguration().value,
    email_reason: emailReason || "newsletter",
    userId: await this.userStorage.getUserId(),
  });
}

import { AnalyticsService } from "../../domain/analytics/AnalyticsService";
import { SessionStorage } from "../../domain/auth/SessionStorage";
import { UserStorage } from "../../domain/user/UserStorage";
import { IdentifyAnalyticsUser } from "../TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics/TrackAnalytics";

export class LogOut {
  private readonly analyticsService: AnalyticsService;
  private readonly identifyAnalyticsUser: IdentifyAnalyticsUser;
  private readonly sessionStorage: SessionStorage;
  private readonly trackAnalytics: TrackAnalytics;
  private readonly userStorage: UserStorage;

  constructor(
    analyticsService: AnalyticsService,
    identifyAnalyticsUser: IdentifyAnalyticsUser,
    sessionStorage: SessionStorage,
    trackAnalytics: TrackAnalytics,
    userStorage: UserStorage
  ) {
    this.analyticsService = analyticsService;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
    this.sessionStorage = sessionStorage;
    this.trackAnalytics = trackAnalytics;
    this.userStorage = userStorage;
  }

  execute = async () => {
    await this.trackAnalytics.execute("Web Signed Out");
    this.userStorage.remove();
    this.sessionStorage.remove();
    this.analyticsService.reset();
  };
}

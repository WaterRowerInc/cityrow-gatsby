import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { UserStorage } from "../../../domain/user/UserStorage";
import { IdentifyTraits } from "../../../domain/analytics/IdentifyTraits";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";

export class IdentifyAnalyticsUser {
  private readonly analyticsService: AnalyticsService;
  private readonly httpAnalyticsService: HttpAnalyticsService;
  private readonly userStorage: UserStorage;

  constructor(
    analyticsService: AnalyticsService,
    httpAnalyticsService: HttpAnalyticsService,
    userStorage: UserStorage
  ) {
    this.analyticsService = analyticsService;
    this.httpAnalyticsService = httpAnalyticsService;
    this.userStorage = userStorage;
  }

  execute = async (traits?: IdentifyTraits) => {
    const userId = await this.userStorage.getUserId();
    if (userId) traits = { ...traits, user_id: userId };
    try {
      await this.analyticsService.identify(userId, traits);
    } catch (e) {
      const anonymousId = this.userStorage.getAnonymousId();
      await this.httpAnalyticsService.identify({ anonymousId, userId, traits });
    }
  };
}

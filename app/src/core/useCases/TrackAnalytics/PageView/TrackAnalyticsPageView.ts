import { AnalyticsService } from "../../../domain/analytics/AnalyticsService";
import { UserStorage } from "../../../domain/user/UserStorage";
import { HttpAnalyticsService } from "../../../infrastructure/http/HttpAnalyticsService";

export class TrackAnalyticsPageView {
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

  execute = async (page: string) => {
    try {
      this.analyticsService.trackPageView(page);
    } catch (e: any) {
      const userId = await this.userStorage.getUserId();
      const anonymousId = this.userStorage.getAnonymousId();
      await this.httpAnalyticsService.page({ userId, anonymousId, name: page });
    }
  };
}

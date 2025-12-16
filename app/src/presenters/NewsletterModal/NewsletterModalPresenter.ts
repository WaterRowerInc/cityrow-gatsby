import { IdentifyAnalyticsUser } from "../../core/useCases/TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { IdentifyTraits } from "../../core/domain/analytics/IdentifyTraits";
import { TrackAnalyticsEmailSubmitted } from "../../core/useCases/TrackAnalytics/EmailSubmitted/TrackAnalyticsEmailSubmitted";

export interface NewsletterModalView {
  hideModal();
}

export class NewsletterModalPresenter {
  private view: NewsletterModalView;
  private trackAnalyticsEmailSubmitted: TrackAnalyticsEmailSubmitted;
  private identifyAnalyticsUser: IdentifyAnalyticsUser;

  constructor(
    view: NewsletterModalView,
    trackAnalyticsEmailSubmitted: TrackAnalyticsEmailSubmitted,
    identifyAnalyticsUser: IdentifyAnalyticsUser
  ) {
    this.view = view;
    this.trackAnalyticsEmailSubmitted = trackAnalyticsEmailSubmitted;
    this.identifyAnalyticsUser = identifyAnalyticsUser;
  }

  trackEmailSubmitted = async (email?: string) => {
    if (!email) return;

    this.view.hideModal();
    // noinspection JSIgnoredPromiseFromCall
    await this.identifyAnalyticsUser.execute({ email } as IdentifyTraits);
    this.trackAnalyticsEmailSubmitted.execute(email, "pop up");
  };
}

import { IdentifyAnalyticsUser } from "../../core/useCases/TrackAnalytics/Identify/IdentifyAnalyticsUser";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { NewsletterModalPresenter, NewsletterModalView } from "./NewsletterModalPresenter";
import { TrackAnalyticsEmailSubmitted } from "../../core/useCases/TrackAnalytics/EmailSubmitted/TrackAnalyticsEmailSubmitted";
import { IdentifyTraits } from "../../core/domain/analytics/IdentifyTraits";

describe("NewsletterModalPresenter should", () => {
  it("track email submitted on submit", async () => {
    when(identifyAnalyticsUser.execute({ email: anEmail } as IdentifyTraits)).thenResolve(anything());
    when(trackAnalyticsEmailSubmitted.execute(anEmail)).thenResolve(anything());

    await presenter.trackEmailSubmitted(anEmail);

    verify(view.hideModal()).called();
    verify(identifyAnalyticsUser.execute(anything())).called();
    verify(trackAnalyticsEmailSubmitted.execute(anEmail, "pop up")).called();
  });

  it("don't track the event if no email was provided", async () => {
    await presenter.trackEmailSubmitted(undefined);

    verify(trackAnalyticsEmailSubmitted.execute(anEmail)).never();
    verify(identifyAnalyticsUser.execute(anything())).never();
    verify(view.hideModal()).never();
  });

  beforeEach(() => {
    view = mock<NewsletterModalView>();
    trackAnalyticsEmailSubmitted = mock<TrackAnalyticsEmailSubmitted>();
    identifyAnalyticsUser = mock<IdentifyAnalyticsUser>();
    presenter = createPresenter();
  });

  function createPresenter(): NewsletterModalPresenter {
    return new NewsletterModalPresenter(
      instance(view),
      instance(trackAnalyticsEmailSubmitted),
      instance(identifyAnalyticsUser)
    );
  }

  let view: NewsletterModalView;
  let presenter: NewsletterModalPresenter;
  let trackAnalyticsEmailSubmitted: TrackAnalyticsEmailSubmitted;
  let identifyAnalyticsUser: IdentifyAnalyticsUser;
  const anEmail = "mail@company.com";
});

import { anything, instance, mock, verify, when } from "ts-mockito";
import { TrackAnalyticsPageView } from "./../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";
import { CommonPagePresenter, CommonPageView } from "./CommonPagePresenter";

describe("CommonPagePresenter should", () => {
  it("show loader when page starts", async () => {
    when(trackAnalyticsPageView.execute(anything())).thenResolve();

    await presenter.start(cmsData, path);

    verify(view.showLoader()).called();
  });

  it("track page viewed", async () => {
    when(trackAnalyticsPageView.execute(anything())).thenResolve();

    await presenter.start(cmsData, path);

    verify(trackAnalyticsPageView.execute(anything())).calledAfter(view.showLoader());
  });

  it("show page content from CMS", async () => {
    when(trackAnalyticsPageView.execute(anything())).thenResolve();

    await presenter.start(cmsData, path);

    verify(view.showContent(anything())).calledBefore(view.hideLoader());
  });

  it("hide loader after page finished start", async () => {
    when(trackAnalyticsPageView.execute(anything())).thenResolve();

    await presenter.start(cmsData, path);

    verify(view.hideLoader()).calledAfter(view.showContent(anything()));
  });

  it("hide loader if there's an error", async () => {
    when(trackAnalyticsPageView.execute(anything())).thenReject();

    await presenter.start(cmsData, path);

    verify(view.hideLoader()).called();
    verify(view.showContent(anything())).never();
  });

  beforeEach(() => {
    view = mock<CommonPageView>();
    trackAnalyticsPageView = mock<TrackAnalyticsPageView>();
    presenter = createPresenter();
  });

  function createPresenter(): CommonPagePresenter {
    return new CommonPagePresenter(instance(view), instance(trackAnalyticsPageView));
  }

  let view: CommonPageView;
  let presenter: CommonPagePresenter;
  let trackAnalyticsPageView: TrackAnalyticsPageView;

  const path = "/en-us/anUrl";
  const cmsData = {
    allBuilderModels: {
      landingPage: [
        {
          content: {
            data: {
              url: "/anUrl",
            },
            query: [
              {
                property: "zone",
                value: ["us"],
              },
            ],
          },
        },
      ],
    },
  };
});

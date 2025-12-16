import { TrackAnalyticsPageView } from "../../core/useCases/TrackAnalytics/PageView/TrackAnalyticsPageView";

export interface CommonPageView {
  hideLoader();

  showContent(content: any);

  showLoader();
}

export class CommonPagePresenter {
  private view: CommonPageView;
  private trackAnalyticsPageView: TrackAnalyticsPageView;

  constructor(view: CommonPageView, trackAnalyticsPageView: TrackAnalyticsPageView) {
    this.view = view;
    this.trackAnalyticsPageView = trackAnalyticsPageView;
  }

  start = async (data: any, path: string) => {
    try {
      this.view.showLoader();
      const content = this._getContentFromDataAndPath(data, path);
      await this.trackAnalyticsPageView.execute(content.data.analyticsPageTitle || "");
      this.view.showContent(content);
      this.view.hideLoader();
    } catch (e) {
      this.view.hideLoader();
    }
  };

  private _getContentFromDataAndPath = (data, path: string) =>
    data?.allBuilderModels.landingPage?.find((page) => {
      const url = page?.content.data.url;
      const targetZones = page?.content.query.find((query) => query?.property === "zone")?.value;
      return targetZones?.find((zone) => path.toLowerCase() === `/en-${zone}${url}`.toLowerCase());
    })?.content;
}

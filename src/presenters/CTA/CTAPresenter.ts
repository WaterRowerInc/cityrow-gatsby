import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { TrackAnalyticsCTAClicked } from "../../core/useCases/TrackAnalytics/CTAClicked/TrackAnalyticsCTAClicked";

export interface CTAView {
  setLocalizationCode(localizationCode: string);
}

export class CTAPresenter {
  private view: CTAView;
  private getLocalizationCode: GetLocalizationCode;
  private trackAnalyticsCTAClicked: TrackAnalyticsCTAClicked;

  constructor(
    view: CTAView,
    getLocalizationCode: GetLocalizationCode,
    trackAnalyticsCTAClicked: TrackAnalyticsCTAClicked
  ) {
    this.view = view;
    this.getLocalizationCode = getLocalizationCode;
    this.trackAnalyticsCTAClicked = trackAnalyticsCTAClicked;
  }

  start = () => this.view.setLocalizationCode(this.getLocalizationCode.execute());

  trackAnalytics = (sourceUrl: string, destinationUrl: string, text: string) =>
    this.trackAnalyticsCTAClicked.execute(sourceUrl, destinationUrl, text).then();
}

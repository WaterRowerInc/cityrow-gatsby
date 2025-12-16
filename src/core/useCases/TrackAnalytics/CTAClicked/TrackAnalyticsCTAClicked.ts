import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsCTAClicked {
  private readonly trackAnalytics: TrackAnalytics;

  constructor(trackAnalytics: TrackAnalytics) {
    this.trackAnalytics = trackAnalytics;
  }

  execute = async (sourceUrl: string, destinationUrl: string, text: string) =>
    await this.trackAnalytics.execute("CTA Clicked", {
      sourceUrl,
      destinationUrl,
      text,
    });
}

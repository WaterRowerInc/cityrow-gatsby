import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

export class TrackAnalyticsUserConverted {
  private readonly trackAnalytics: TrackAnalytics;

  constructor(trackAnalytics: TrackAnalytics) {
    this.trackAnalytics = trackAnalytics;
  }

  execute = async () => await this.trackAnalytics.execute("User Converted");
}

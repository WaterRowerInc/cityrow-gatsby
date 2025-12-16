import { instance, mock, verify } from "ts-mockito";
import { TrackAnalyticsUserConverted } from "./TrackAnalyticsUserConverted";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsUserConverted should", () => {
  it("track the User Converted event", async () => {
    await trackAnalyticsUserConverted().execute();

    verify(trackAnalytics.execute("User Converted")).called();
  });

  beforeEach(() => {
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsUserConverted(): TrackAnalyticsUserConverted {
    return new TrackAnalyticsUserConverted(instance(trackAnalytics));
  }

  let trackAnalytics: TrackAnalytics;
});

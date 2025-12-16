import { deepEqual, instance, mock, verify } from "ts-mockito";
import { TrackAnalyticsCTAClicked } from "./TrackAnalyticsCTAClicked";
import { TrackAnalytics } from "../TrackAnalytics/TrackAnalytics";

describe("TrackAnalyticsCTAClicked should", () => {
  it("track the CTA Clicked event in the analytics service with the user logged in", async () => {
    await trackAnalyticsCTAClicked().execute(aSourceURL, aDestinationUrl, someText);

    verify(trackAnalytics.execute("CTA Clicked", deepEqual(aCTAClickedRequest))).called();
  });

  beforeEach(() => {
    trackAnalytics = mock<TrackAnalytics>();
  });

  function trackAnalyticsCTAClicked(): TrackAnalyticsCTAClicked {
    return new TrackAnalyticsCTAClicked(instance(trackAnalytics));
  }

  let trackAnalytics: TrackAnalytics;
  const aSourceURL = "aSourceURL";
  const aDestinationUrl = "aDestinationUrl";
  const someText = "some text";
  const aCTAClickedRequest = { sourceUrl: aSourceURL, destinationUrl: aDestinationUrl, text: someText };
});

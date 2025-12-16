import { instance, mock, verify, when } from "ts-mockito";
import { CTAPresenter, CTAView } from "./CTAPresenter";
import { GetLocalizationCode } from "../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { shippingFixtures } from "../../core/domain/orders/testing/ShippingFixtures";
import { TrackAnalyticsCTAClicked } from "../../core/useCases/TrackAnalytics/CTAClicked/TrackAnalyticsCTAClicked";

describe("CTAPresenter should", () => {
  it("set the localization code on start", async () => {
    when(getLocalizationCode.execute()).thenReturn(aLocalizationCode);

    await presenter.start();

    verify(view.setLocalizationCode(aLocalizationCode)).called();
  });

  it("track analytics", async () => {
    when(trackAnalyticsCTAClicked.execute(aSource, aDestination, someText)).thenResolve();

    await presenter.trackAnalytics(aSource, aDestination, someText);

    verify(trackAnalyticsCTAClicked.execute(aSource, aDestination, someText)).called();
  });

  beforeEach(() => {
    view = mock<CTAView>();
    getLocalizationCode = mock<GetLocalizationCode>();
    trackAnalyticsCTAClicked = mock<TrackAnalyticsCTAClicked>();
    presenter = createPresenter();
  });

  function createPresenter(): CTAPresenter {
    return new CTAPresenter(instance(view), instance(getLocalizationCode), instance(trackAnalyticsCTAClicked));
  }

  let presenter: CTAPresenter;
  let view: CTAView;
  let getLocalizationCode: GetLocalizationCode;
  let trackAnalyticsCTAClicked: TrackAnalyticsCTAClicked;
  const aLocalizationCode = shippingFixtures.aLocalizationCode;
  const aSource = "a source";
  const aDestination = "a destination";
  const someText = "some Text";
});

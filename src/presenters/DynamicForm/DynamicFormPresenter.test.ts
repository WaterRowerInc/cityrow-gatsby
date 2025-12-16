import { instance, mock, verify, when } from "ts-mockito";
import { DynamicFormRequest } from "./../../core/domain/analytics/DynamicFormRequest";
import { TrackAnalytics } from "./../../core/useCases/TrackAnalytics/TrackAnalytics/TrackAnalytics";
import { DynamicFormPresenter, DynamicFormView } from "./DynamicFormPresenter";

describe("DynamicFormPresenter should", () => {
  it("track info entered by the user", async () => {
    when(trackAnalytics.execute("Marketing Info Gathered", sampleFormValues)).thenResolve();
    await presenter.submit(sampleFormValues);

    verify(trackAnalytics.execute("Marketing Info Gathered", sampleFormValues)).called();
    verify(view.clearForm()).called();
  });

  beforeEach(() => {
    view = mock<DynamicFormView>();
    trackAnalytics = mock<TrackAnalytics>();
    presenter = createPresenter();
  });

  function createPresenter(): DynamicFormPresenter {
    return new DynamicFormPresenter(instance(view), instance(trackAnalytics));
  }

  let view: DynamicFormView;
  let trackAnalytics: TrackAnalytics;
  let presenter: DynamicFormPresenter;
  const sampleFormValues = { campaignName: "a campaign name", email: "user@email.com" } as DynamicFormRequest;
});

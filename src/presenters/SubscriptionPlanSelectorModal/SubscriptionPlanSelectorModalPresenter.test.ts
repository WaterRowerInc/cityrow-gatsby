import { anything, instance, mock, verify } from "ts-mockito";
import { GetLocalizationCode } from "./../../core/useCases/GetLocalizationCode/GetLocalizationCode";
import { IsUserLoggedIn } from "./../../core/useCases/IsUserLoggedIn/IsUserLoggedIn";
import {
  SubscriptionPlanSelectorModalPresenter,
  SubscriptionPlanSelectorModalView,
} from "./SubscriptionPlanSelectorModalPresenter";

describe("SubscriptionPlanSelectorModalPresenter should", () => {
  it("check if user is logged in and send the result to the view", async () => {
    await presenter.start();

    verify(view.setIsUserLoggedIn(anything())).called();
  });

  it("initialize localization code on start", async () => {
    await presenter.start();

    verify(view.setLocale(anything())).called();
  });

  beforeEach(() => {
    view = mock<SubscriptionPlanSelectorModalView>();
    isUserLoggedIn = mock<IsUserLoggedIn>();
    getLocalizationCode = mock<GetLocalizationCode>();
    presenter = createPresenter();
  });

  function createPresenter(): SubscriptionPlanSelectorModalPresenter {
    return new SubscriptionPlanSelectorModalPresenter(
      instance(view),
      instance(isUserLoggedIn),
      instance(getLocalizationCode)
    );
  }

  let presenter: SubscriptionPlanSelectorModalPresenter;
  let view: SubscriptionPlanSelectorModalView;
  let isUserLoggedIn: IsUserLoggedIn;
  let getLocalizationCode: GetLocalizationCode;
});

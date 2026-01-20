import { FormEvent } from "react";
import { DynamicFormRequest } from "./../../core/domain/analytics/DynamicFormRequest";
import { TrackAnalytics } from "./../../core/useCases/TrackAnalytics/TrackAnalytics/TrackAnalytics";
export interface DynamicFormView {
  handleSubmit(e: FormEvent);
  clearForm();
  showSuccessMessage?: () => void;
}

export class DynamicFormPresenter {
  private view: DynamicFormView;
  private trackAnalytics: TrackAnalytics;

  constructor(view: DynamicFormView, trackAnalytics: TrackAnalytics) {
    this.view = view;
    this.trackAnalytics = trackAnalytics;
  }

  submit = async (values: DynamicFormRequest) => {
    this.trackAnalytics.execute("Marketing Info Gathered", values);
    this.view.showSuccessMessage && this.view.showSuccessMessage();
    this.view.clearForm();
  };
}

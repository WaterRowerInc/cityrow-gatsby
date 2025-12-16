import { DynamicFormRequest } from './DynamicFormRequest';
import { CTAClickedRequest } from "./CTAClickedRequest";
import { ProductAnalyticsRequest } from "./ProductAnalyticsRequest";
import { EmailSubmittedRequest } from "./EmailSubmittedRequest";
import { CheckoutStartedRequest } from "./CheckoutStartedRequest";
import { PaymentInfoEnteredRequest } from "./PaymentInfoEnteredRequest";
import { OrderCompletedRequest } from "./OrderCompletedRequest";
import { AccountCreatedRequest } from "./AccountCreatedRequest";
import { ProductRemovedRequest } from "./ProductRemovedRequest";
import { CouponRequest } from "./CouponRequest";
import { IdentifyTraits } from "./IdentifyTraits";

export interface AnalyticsService {
  identify(id?: string, traits?: IdentifyTraits);

  reset();

  track(
    event: string,
    options?:
      | AccountCreatedRequest
      | CheckoutStartedRequest
      | CouponRequest
      | CTAClickedRequest
      | EmailSubmittedRequest
      | OrderCompletedRequest
      | PaymentInfoEnteredRequest
      | ProductAnalyticsRequest
      | ProductRemovedRequest
      | DynamicFormRequest
  );

  trackPageView(page: string);
}

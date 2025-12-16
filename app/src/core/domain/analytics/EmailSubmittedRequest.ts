export interface EmailSubmittedRequest {
  email_capture: string;
  postal_capture: string;
  country_capture: string;
  email_reason: string;
  userId?: string;
}

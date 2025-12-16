import { ReviewsSummary } from "./ReviewsSummary";

export interface ReviewsService {
  getBusinessReviewsSummary(): Promise<ReviewsSummary>;
}

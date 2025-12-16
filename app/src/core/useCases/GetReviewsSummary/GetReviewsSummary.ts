import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { ReviewsService } from "../../domain/reviews/ReviewsService";
import { ReviewsSummary } from "../../domain/reviews/ReviewsSummary";

export class GetReviewsSummary {
  private readonly reviewsService: ReviewsService;

  constructor(reviewsService: ReviewsService) {
    this.reviewsService = reviewsService;
  }

  execute = async (): Promise<ReviewsSummary> => {
    try {
      return await this.reviewsService.getBusinessReviewsSummary();
    } catch (e: any) {
      throw new NotExpectedError(e.message);
    }
  };
}

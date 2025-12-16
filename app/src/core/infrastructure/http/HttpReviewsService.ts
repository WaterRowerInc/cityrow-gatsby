import { HttpClient } from "./HttpClient";
import { ReviewsService } from "../../domain/reviews/ReviewsService";
import { ReviewsSummary } from "../../domain/reviews/ReviewsSummary";

export class HttpReviewsService implements ReviewsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
  getBusinessReviewsSummary = async (): Promise<any> => {
    const response = await this.httpClient.get(`/get-business-unit-reviews/`);
    return this.jsonToReviewsSummary(response.data);
  };

  private jsonToReviewsSummary = (json: any): ReviewsSummary => ({
    score: json.data.score.stars,
  });
}

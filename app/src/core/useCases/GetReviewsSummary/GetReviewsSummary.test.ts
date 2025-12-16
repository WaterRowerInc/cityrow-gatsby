import { instance, mock, verify, when } from "ts-mockito";
import { expectThrows } from "../../../utils/testing/expectThrows";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { reviewsFixtures } from "../../domain/orders/testing/ReviewsFixtures";
import { ReviewsService } from "../../domain/reviews/ReviewsService";
import { GetReviewsSummary } from "./GetReviewsSummary";

describe("GetReviewsSummary should", () => {
  it("retrieve the business reviews summary", async () => {
    when(reviewsService.getBusinessReviewsSummary()).thenResolve(someReviewsSummary);

    await getReviewsSummary().execute();

    verify(reviewsService.getBusinessReviewsSummary()).called();
  });

  it("fail if get business reviews", async () => {
    when(reviewsService.getBusinessReviewsSummary()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await getReviewsSummary().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    reviewsService = mock<ReviewsService>();
  });

  function getReviewsSummary(): GetReviewsSummary {
    return new GetReviewsSummary(instance(reviewsService));
  }

  let reviewsService: ReviewsService;
  const someReviewsSummary = reviewsFixtures.someReviewsSummary;
});

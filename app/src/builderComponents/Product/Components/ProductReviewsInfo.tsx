import React from "react";
import "./ProductReviewsInfo.scss";
import { ReviewsSummary } from "../../../core/domain/reviews/ReviewsSummary";
import ProductStars from "./ProductStars";
import { Link } from "gatsby";

const ProductReviewsInfo = ({ reviewsInfo }: { reviewsInfo?: ReviewsSummary }) => {
  if (!reviewsInfo) return null;
  return (
    <div className='product-reviews-info__container__'>
      <ProductStars score={reviewsInfo.score} />
      <span className='product-reviews-info__container__score'>{reviewsInfo.score}</span>
      <Link className='product-reviews-info__container__link' to={reviewsInfo.link || "#"}>
        See Reviews
      </Link>
    </div>
  );
};

export default ProductReviewsInfo;

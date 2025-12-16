import * as React from "react";
import clsx from "classnames";
import { ReviewType } from "./ReviewType";
import "./Review.scss";

function ReviewItem({ item }: { item: ReviewType }) {
  return (
    <div className='reviews-carousel__content'>
      <div className='reviews-carousel__container'>
        <div className='reviews-carousel__header'>
          <div
            className={clsx("reviews-carousel__stars-container", {
              "reviews-carousel__stars-container--medium": item.imageSize == "Medium",
              "reviews-carousel__stars-container--large": item.imageSize == "Large",
            })}
            style={{ backgroundImage: `url(${item.ratingImage})` }}
          />
        </div>
        <div className='reviews-carousel__message'>{item.body}</div>
        <div className='reviews-carousel__user'>{item.reviewer}</div>
        <div className='reviews-carousel__footnote'>{item.source ? item.source : "Google Play Store Review"}</div>
      </div>
    </div>
  );
}

export default ReviewItem;

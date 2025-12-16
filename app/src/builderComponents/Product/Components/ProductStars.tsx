import React from "react";
import "./ProductStars.scss";
import fullStar from "../../../assets/images/star.webp";
import halfStar from "../../../assets/images/starHalf.webp";
import emptyStar from "../../../assets/images/starEmpty.webp";

const ProductStars = ({ score }: { score: number }) => {
  const getStarType = (starNumber) => (score >= starNumber ? fullStar : starNumber - score < 1 ? halfStar : emptyStar);

  return (
    <div className='product-stars__container__'>
      <img alt='productStar' src={getStarType(1)} />
      <img alt='productStar' src={getStarType(2)} />
      <img alt='productStar' src={getStarType(3)} />
      <img alt='productStar' src={getStarType(4)} />
      <img alt='productStar' src={getStarType(5)} />
    </div>
  );
};

export default ProductStars;

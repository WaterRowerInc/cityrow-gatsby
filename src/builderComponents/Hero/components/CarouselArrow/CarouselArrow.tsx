import React from "react";
import "./CarouselArrowStyle.scss";

const CarouselArrow = ({ onClick, isPrev }: { onClick?: () => void; isPrev?: boolean }) => {
  return (
    <div onClick={onClick} className={`carouselArrowContainer carouselArrowContainer--${isPrev ? "left" : "right"}`} />
  );
};

export default CarouselArrow;

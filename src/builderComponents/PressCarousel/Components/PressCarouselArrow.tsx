import React from "react";
import "./PressCarouselArrow.scss";

const PressCarouselArrow = ({ onClick, isPrev }: { onClick?: () => void; isPrev?: boolean }) => {
  return (
    <div onClick={onClick} className={`pressCarousel__arrow pressCarousel__arrow--${isPrev ? "left" : "right"}`} />
  );
};

export default PressCarouselArrow;

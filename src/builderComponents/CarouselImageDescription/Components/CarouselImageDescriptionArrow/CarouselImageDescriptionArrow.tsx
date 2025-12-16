import React from "react";
import "./CarouselImageDescriptionArrow.scss";

const CarouselImageDescriptionArrow = ({ onClick, isPrev }: { onClick?: () => void; isPrev?: boolean }) => {
  return (
    <div
      onClick={onClick}
      role={"button"}
      onKeyPress={(e) => e.key.toLowerCase() === "enter" && onClick}
      tabIndex={0}
      className={`carousel-image-description-arrow__ carousel-image-description-arrow__--${isPrev ? "left" : "right"}`}
    />
  );
};

export default CarouselImageDescriptionArrow;

import React, { Ref } from "react";
import Slider from "react-slick";
import CarouselImage from "../../../components/CarouselImage/CarouselImage";
import "./ProductThumbnails.scss";
import clsx from "classnames";

const ProductThumbnails = React.forwardRef(
  (
    {
      changeSlide,
      shownImages,
      currentSlide,
    }: {
      changeSlide: (slideIndex: number) => void;
      shownImages: string[];
      currentSlide: number;
    },
    ref: Ref<Slider>
  ) => (
    <div className='product-thumbnails__container__' id='thumbnailsSlider'>
      <Slider
        ref={ref}
        speed={500}
        autoplay={false}
        accessibility
        infinite
        arrows={false}
        slidesToShow={shownImages.length >= 4 ? 4 : shownImages.length}
        swipeToSlide
      >
        {shownImages.map((image, index) => (
          <div
            className={clsx("product-thumbnails__container__thumbnail", {
              "product-thumbnails__container__thumbnail--active": index === currentSlide - 1,
            })}
            key={index}
            onClick={() => changeSlide(index)}
          >
            <CarouselImage imageUrl={image} contain />
          </div>
        ))}
      </Slider>
    </div>
  )
);

ProductThumbnails.displayName = "ProductThumbnails";

export default ProductThumbnails;

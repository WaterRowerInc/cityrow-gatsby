import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "./ProductCarousel.scss";
import { VariantVM } from "../ProductVM";
import CarouselImage from "../../../components/CarouselImage/CarouselImage";
import ProductThumbnails from "./ProductThumbnails";

const ProductCarousel = ({
  images,
  title,
  onSlideChange = () => null,
  selectedVariant,
}: {
  images: string[];
  title: string;
  onSlideChange?: (slide: number) => void;
  selectedVariant?: VariantVM | null;
}) => {
  useEffect(() => {
    setCurrentSlide(1);
  }, [selectedVariant]);
  const shownImages =
    !selectedVariant?.notShowOnCarousel && selectedVariant?.images.length ? selectedVariant?.images : images;
  const slider = useRef<Slider>(null);
  const thumbnailSlider = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const previousSlide = () => {
    slider.current?.slickPrev();
  };

  const nextSlide = () => {
    slider.current?.slickNext();
  };

  const beforeSliderChange = (_oldIndex: number, newIndex: number) => {
    setCurrentSlide(newIndex + 1);
    onSlideChange(newIndex + 1);
  };

  const formatSlideNumber = (slideNumber: number) => (slideNumber < 10 ? `0${slideNumber}` : slideNumber);
  return (
    <>
      {shownImages.length > 0 && (
        <Slider
          ref={slider}
          beforeChange={beforeSliderChange}
          speed={500}
          autoplay={false}
          accessibility
          infinite
          arrows={false}
          asNavFor={thumbnailSlider.current!}
        >
          {shownImages.map((image, index) => (
            <div className='productCarousel__container' key={index}>
              <CarouselImage imageUrl={image} contain />
            </div>
          ))}
        </Slider>
      )}
      <div className='productCarousel__footer'>
        <div className='productCarousel__footer__container'>
          <button className='productCarousel__footer__backButton' onClick={previousSlide} />
          <button className='productCarousel__footer__forwardButton' onClick={nextSlide} />
          <p className='productCarousel__footer__title'>{title}</p>
          <p className='productCarousel__footer__slideNumber'>{`${formatSlideNumber(
            currentSlide
          )} - ${formatSlideNumber(shownImages.length)}`}</p>
        </div>
      </div>
      <ProductThumbnails
        ref={thumbnailSlider}
        changeSlide={(index) => slider?.current?.slickGoTo(index)}
        shownImages={shownImages}
        currentSlide={currentSlide}
      />
    </>
  );
};

export default ProductCarousel;

import React from "react";
import "./PressCarousel.scss";
import Slider from "react-slick";
import { PressSlideType } from "./PressSlide.type";
import PressSlide from "./Components/PressSlide";
import PressCarouselArrow from "./Components/PressCarouselArrow";
import BuilderImage from "../../components/BuilderImage/BuilderImage";

const pressSliderSettings = {
  className: "pressCarousel__slider",
  slidesToScroll: 1,
  slidesToShow: 1,
  prevArrow: <PressCarouselArrow isPrev />,
  nextArrow: <PressCarouselArrow />,
  responsive: [{ breakpoint: 1024, settings: { arrows: false } }],
};

const brandSliderSettings = {
  className: "pressCarousel__brandSlider",
  slidesToScroll: 1,
  slidesToShow: 3,
  centerPadding: "10px",
  centerMode: true,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { dots: true, dotsClass: "slick-dots pressCarousel__slick-dots", slidesToShow: 1 } },
  ],
};

const PressCarousel = ({ title, pressSlides }: { title: string; pressSlides: PressSlideType[] }) => {
  let pressSliderRef: any = React.useRef(null);
  let brandSliderRef: any = React.useRef(null);
  const [pressSliderComponent, setPressSliderComponent] = React.useState<Slider>();
  const [brandSliderComponent, setBrandSliderComponent] = React.useState<Slider>();

  React.useEffect(() => {
    setPressSliderComponent(pressSliderRef);
    setBrandSliderComponent(brandSliderRef);
  }, [pressSliderRef, brandSliderRef]);

  return (
    <div className='pressCarousel__container'>
      <div className='pressCarousel__wrapper'>
        <h2 className='pressCarousel__title'>{title}</h2>
        {pressSlides && (
          <>
            <Slider {...pressSliderSettings} ref={(s) => (pressSliderRef = s)} asNavFor={brandSliderComponent}>
              {pressSlides.map((slide: PressSlideType, index: number) => (
                <PressSlide key={`slide-${index}`} comment={slide.comment} />
              ))}
            </Slider>
            <Slider {...brandSliderSettings} ref={(s) => (brandSliderRef = s)} asNavFor={pressSliderComponent}>
              {pressSlides.map((slide: PressSlideType, index: number) => (
                <div className='pressCarousel__brandContainer' key={`brand-${index}`}>
                  <BuilderImage className='pressCarousel__image' imageModel={{image: slide?.image, title: `brand-${index}`}} />
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
};

export default PressCarousel;

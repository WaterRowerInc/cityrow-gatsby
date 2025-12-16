import React, { useRef } from "react";
import "./CarouselSitePages.scss";
import CTAButton from "../../components/CTAButton/CTAButton";
import CarouselSitePagesItem, { CarouselSitePagesItemType } from "./CarouselSitePagesItem/CarouselSitePagesItem";
import Slider from "react-slick";

const CarouselSitePages = ({ header, ctas, slidesToScroll, slidesToShow, slides = [] }: CarouselSitePagesType) => {
  const slider = useRef<Slider | null>(null);

  const moveToNextSlide = () => slider.current?.slickNext();

  const moveToPrevSlide = () => slider.current?.slickPrev();

  const SETTINGS = {
    speed: 300,
    draggable: false,
    touchThreshold: 25,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 1,
    infinite: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          vertical: true,
          verticalSwiping: false,
          slidesToShow: slides.length,
        },
      },
    ],
  };

  return (
    <div className='carousel-site-pages__container'>
      {header && <h2 className='carousel-site-pages__header-title'>{header}</h2>}
      <div className='carousel-site-pages__ctas__container'>
        {ctas &&
          ctas.map((cta: CTA, index: number) => (
            <CTAButton
              customClass='carousel-site-pages__ctas__cta'
              key={`ctas-${index}`}
              goTo={cta.destination}
              external={cta.external}
              text={cta.label}
              variation={cta.variation}
            />
          ))}
      </div>
      <div className='carousel-site-pages__slides__container'>
        {!!slides.length &&
          (slides.length <= 3 ? (
            RenderSlides({ slides })
          ) : (
            <Slider
              {...SETTINGS}
              className='carousel-site-pages__carousel'
              prevArrow={<SliderArrow onClick={moveToPrevSlide} isPrev />}
              nextArrow={<SliderArrow onClick={moveToNextSlide} />}
            >
              {RenderSlides({ slides, fullWidth: true })}
            </Slider>
          ))}
      </div>
    </div>
  );
};

const RenderSlides = ({ slides, fullWidth }: RenderSlidesProps) =>
  slides.map(({ title, body, destination, external, imageModel }: CarouselSitePagesItemType, index: number) => (
    <CarouselSitePagesItem
      key={`slides-${index}`}
      title={title}
      destination={destination}
      imageModel={imageModel}
      body={body}
      fullWidth={fullWidth}
      external={external}
    />
  ));

const SliderArrow = ({ onClick, isPrev }: { onClick?: () => void; isPrev?: boolean }) => {
  return (
    <div
      onClick={onClick}
      className={`carousel-site-pages__carousel__arrow carousel-site-pages__carousel__arrow--${
        isPrev ? "left" : "right"
      }`}
      onKeyPress={(e) => e.key.toLowerCase() === "enter" && onClick}
      tabIndex={0}
      role={"button"}
    />
  );
};

interface RenderSlidesProps {
  slides: CarouselSitePagesItemType[];
  fullWidth?: boolean;
}
interface CarouselSitePagesType {
  header: string;
  slidesToShow: number;
  slidesToScroll: number;
  ctas: CTA[];
  slides: CarouselSitePagesItemType[];
}

interface CTA {
  label: string;
  destination: string;
  external: boolean;
  variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
}

export default CarouselSitePages;

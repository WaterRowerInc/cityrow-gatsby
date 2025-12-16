import React from "react";
import Slider from "react-slick";
import CTAButton from "../../components/CTAButton/CTAButton";
import "./CarouselImageDescription.scss";
import CarouselImageDescriptionArrow from "./Components/CarouselImageDescriptionArrow/CarouselImageDescriptionArrow";
import CarouselImageDescriptionItem, {
  CarouselImageDescriptionItemProps,
} from "./Components/CarouselImageDescriptionItem/CarouselImageDescriptionItem";

const CarouselImageDescription = ({
  title,
  description,
  firstCta,
  secondCta,
  items,
}: CarouselImageDescriptionProps) => {
  return (
    <div className={"carousel-image-description__container"}>
      <h2 className={"carousel-image-description__title"}>{title}</h2>
      <div className={"carousel-image-description__title-border"}>{"."}</div>
      {description && <p className={"carousel-image-description__description"}>{description}</p>}
      <div className={"carousel-image-description__cta-container"}>
        {firstCta && <CTAButton goTo={firstCta.destination} text={firstCta.label} external={firstCta?.external} />}
        {secondCta && (
          <CTAButton
            variation='secondary'
            goTo={secondCta.destination}
            text={secondCta.label}
            external={secondCta?.external}
          />
        )}
      </div>
      {items && (
        <Slider
          className={"carousel-image-description__slider"}
          slidesToScroll={1}
          slidesToShow={1}
          centerMode
          variableWidth
          dots
          dotsClass='slick-dots slick-dots--display'
          prevArrow={<CarouselImageDescriptionArrow isPrev />}
          nextArrow={<CarouselImageDescriptionArrow />}
        >
          {items.map((item: CarouselImageDescriptionItemProps, index: number) => (
            <CarouselImageDescriptionItem key={`item-${index}`} item={item} />
          ))}
        </Slider>
      )}
    </div>
  );
};

interface CarouselImageDescriptionProps {
  title: string;
  description: string;
  firstCta: {
    destination: string;
    label: string;
    external: boolean;
  };
  secondCta: {
    destination: string;
    label: string;
    external: boolean;
  };
  items: CarouselImageDescriptionItemProps[];
}

export default CarouselImageDescription;

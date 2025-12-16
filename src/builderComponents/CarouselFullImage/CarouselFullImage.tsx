import clsx from "classnames";
import CTAButton from "components/CTAButton/CTAButton";
import React from "react";
import Slider from "react-slick";
import BuilderBackgroundImage from "../../components/BuilderImage/BuilderBackgroundImage";
import "./CarouselFullImage.scss";

const settings = {
  speed: 500,
  fade: true,
};

const CarouselFullImage = ({ items, firstCta, secondCta, fullWidth }: CarouselFullImageProps) => {
  const slider: any = React.useRef(null);
  return (
    <div className='carousel-full-image'>
      <div className='carousel-full-image__content'>
        <Slider {...settings} ref={slider} className='custom-carousel-full-image'>
          {items?.length &&
            items?.map((elem: CarouselFullImageItem, index: number) => (
              <div key={`slider-fullimg-${index}`} className='carousel-full-image__content-frame'>
                <BuilderBackgroundImage
                  className={clsx(`carousel-full-image__content-frame__image-section`, {
                    "carousel-full-image__content-frame__image-section--full": !fullWidth,
                  })}
                  imageModel={elem?.imageModel}
                />
                <div className='carousel-full-image__content-frame__data'>
                  <div className='carousel-full-image__content-frame__header-section'>{elem.header}</div>
                  <div className='carousel-full-image__content-frame__element-section'>
                    {elem.title ? (
                      <h4 className='carousel-full-image__content-frame__title-section'>{elem.title}</h4>
                    ) : null}
                    <p className='carousel-full-image__content-frame__body-section'>{elem.body}</p>
                  </div>
                  <div className='carousel-full-image__content-frame__arrows-section'>
                    <div
                      className='carousel-full-image__content-frame__arrows-section--left'
                      onClick={() => slider?.current?.slickPrev()}
                      role={"button"}
                      onKeyPress={(e) => e.key.toLowerCase() === "enter" && slider?.current?.slickPrev()}
                      tabIndex={0}
                    />
                    <div
                      className='carousel-full-image__content-frame__arrows-section--right'
                      onClick={() => slider?.current?.slickNext()}
                      role={"button"}
                      onKeyPress={(e) => e.key.toLowerCase() === "enter" && slider?.current?.slickNext()}
                      tabIndex={0}
                    />
                  </div>
                  <div className='carousel-full-image__links'>
                    {firstCta && (
                      <CTAButton goTo={firstCta.destination} text={firstCta.label} external={firstCta?.external} />
                    )}
                    {secondCta && (
                      <CTAButton
                        variation='secondary'
                        goTo={secondCta.destination}
                        text={secondCta.label}
                        external={secondCta?.external}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

interface CarouselFullImageItem {
  header: string;
  title: string;
  body: string;
  imageModel: {
    image: string;
    title: string;
  };
}

interface CarouselFullImageProps {
  fullWidth: boolean;
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
  items: CarouselFullImageItem[];
}

export default CarouselFullImage;

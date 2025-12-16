import React from "react";
import "./InstructorBioItem.scss";
import Slider from "react-slick";
import { InstructorBioItemType } from "./InstructorBioItemType";
import CarouselImageDescriptionArrow from "../../../CarouselImageDescription/Components/CarouselImageDescriptionArrow/CarouselImageDescriptionArrow";
import UpcomingClassItem from "./Components/UpcomingClass/UpcomingClassItem";
import { UpcomingClassType } from "./Components/UpcomingClass/UpcomingClassType";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";

const BREAKPOINTS = [1024, 800, 600, 500, 400];

const GENERAL_RESPONSIVE_SETTINGS = {
  arrows: true,
  dots: false,
};

const SETTINGS = {
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 1,
  centerMode: true,
  infinite: false,
  swipeToSlide: true,
  dots: false,
  arrows: true,
  responsive: BREAKPOINTS.map((breakPoint) => ({
    breakpoint: breakPoint,
    settings: GENERAL_RESPONSIVE_SETTINGS,
  })),
};

const InstructorBioItem = ({ bio }: { bio: InstructorBioItemType }) => {
  return (
    <div className={"instructor-bio-item__container__"}>
      <BuilderImage imageModel={bio.imageModel!} className={"instructor-bio-item__container__photo"} />
      <div className={"instructor-bio-item__container__text-content__"}>
        <h3 className={"instructor-bio-item__container__text-content__name"}>{bio.name}</h3>
        <h5 className={"instructor-bio-item__container__text-content__username"}>{bio.username}</h5>
        <p className={"instructor-bio-item__container__text-content__description"}>{bio.description}</p>
        <div className={"instructor-bio-item__container__text-content__classes-container__"}>
          <div className={"instructor-bio-item__container__text-content__classes-container__title-row__"}>
            <h4 className={"instructor-bio-item__container__text-content__classes-container__title-row__title-text"}>
              {"UPCOMING CLASSES"}
            </h4>
          </div>
          {bio.upcomingClasses && (
            <Slider
              {...SETTINGS}
              className={"instructor-bio-item__container__text-content__classes-container__slider"}
              slidesToScroll={1}
              slidesToShow={1}
              centerMode={false}
              variableWidth
              arrows={true}
              prevArrow={<CarouselImageDescriptionArrow isPrev />}
              nextArrow={<CarouselImageDescriptionArrow />}
            >
              {bio.upcomingClasses.map((item: UpcomingClassType, index: number) => (
                <UpcomingClassItem key={`item-${index}`} item={item} />
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorBioItem;

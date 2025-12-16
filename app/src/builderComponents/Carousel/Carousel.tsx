import clsx from "classnames";
import * as React from "react";
import Slider from "react-slick";
import CTA from "../../components/CTA/CTA";
import "./Carousel.scss";
import ImageItem from "./Components/Image/ImageItem";
import { ImageType } from "./Components/Image/ImageType";
import ReviewItem from "./Components/Review/ReviewItem";
import { ReviewType } from "./Components/Review/ReviewType";
import TeamItem from "./Components/Team/TeamItem";
import { TeamType } from "./Components/Team/TeamType";

const SETTINGS = {
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 1,
  centerMode: false,
  infinite: true,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        arrows: true,
        dots: true,
      },
    },
  ],
};

const settingResponsiveTeam = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 5,
      arrows: true,
      dots: false,
    },
  },
  {
    breakpoint: 800,
    settings: {
      slidesToShow: 4,
      arrows: true,
      dots: false,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 3,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 2,
    },
  },
  {
    breakpoint: 400,
    settings: {
      slidesToShow: 1.5,
    },
  },
];
const settingResponsiveImage = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: true,
      dots: false,
    },
  },
  {
    breakpoint: 800,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
      arrows: false,
      dots: true,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
      arrows: false,
      dots: true,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    },
  },
  {
    breakpoint: 400,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    },
  },
];
const itemContainer = {
  review: ReviewItem,
  product: ImageItem,
  team: TeamItem,
};

function Carousel({
  header,
  itemType,
  items,
  theme,
  slidesToShow,
  slidesToScroll,
  cta,
}: {
  header: string;
  theme: "Black" | "White" | "Gray" | "Blue";
  slidesToShow: number;
  slidesToScroll: number;
  itemType: "review" | "product" | "team";
  items: ReviewType[] | ImageType[] | TeamType[];
  cta?: {
    label: string;
    destination: string;
    external: boolean;
  };
}) {
  const Components: ({ item }: { item: any }) => JSX.Element = itemContainer[itemType];
  const isBlack = theme === "Black" || theme === "Gray" || theme === "Blue";

  return (
    <div
      className={clsx("carousel__container", {
        "carousel__container--black": theme === "Black",
        "carousel__container--white": theme === "White",
        "carousel__container--gray": theme === "Gray",
        "carousel__container--blue": theme === "Blue",
      })}
    >
      <h2
        className={clsx("carousel__title", {
          "carousel__title--white": theme === "Black" || theme === "Blue",
        })}
      >
        {header}
      </h2>
      {itemType === "product" && <div className='carousel__title-border'>{"."}</div>}
      {items && (
        <div
          className={
            itemType === "product"
              ? "slick-image-carousel"
              : itemType === "team"
              ? "carousel__content--team"
              : "carousel__content"
          }
        >
          <Slider
            {...SETTINGS}
            {...(itemType === "product" && {
              centerMode: false,
              responsive: settingResponsiveImage,
            })}
            {...(itemType === "team" && { responsive: settingResponsiveTeam })}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToScroll}
            className={clsx("custom-carousel", {
              "custom-carousel--black": isBlack,
              "custom-carousel--white": !isBlack,
            })}
          >
            {items.map((item: ReviewType | ImageType | TeamType, idx: number) => (
              <Components key={`item-caro-${idx}`} item={item} />
            ))}
          </Slider>
        </div>
      )}
      {cta && (
        <CTA external={cta.external} goTo={cta.destination} text={cta.label} className='carousel__cta-container'>
          <span
            className={clsx("carousel__cta", {
              "carousel__cta--white": theme === "Black" || theme === "Blue",
            })}
          >
            {cta.label}
          </span>
        </CTA>
      )}
    </div>
  );
}

export default Carousel;

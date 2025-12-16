import * as React from "react";
import clsx from "classnames";
import "./CarouselSitePagesItem.scss";
import BuilderImage from "../../../components/BuilderImage/BuilderImage";
import CTA from "../../../components/CTA/CTA";
import { BuilderImageModel } from "../../../components/BuilderImage/BuilderImage.type";

const CarouselSitePagesItem = ({
  title,
  body,
  fullWidth = false,
  destination,
  external,
  imageModel,
  disabled = false,
}: CarouselSitePagesItemType) => {
  return (
    <div
      className={clsx("carousel-site-pages-item__container", {
        "carousel-site-pages-item__container--full": fullWidth,
      })}
    >
      <CTA goTo={destination} external={external} text={title} disabled={disabled}>
        <BuilderImage imageModel={imageModel} className='carousel-site-pages-item__image' />
        <div className='carousel-site-pages-item__header-container'>
          <h2 className='carousel-site-pages-item__header-title'>{title}</h2>
          <span className='carousel-site-pages-item__header-title__arrow'></span>
        </div>
      </CTA>
      <p className='carousel-site-pages-item__'>{body}</p>
    </div>
  );
};
export interface CarouselSitePagesItemType {
  imageModel: BuilderImageModel;
  title: string;
  body: string;
  external: boolean;
  destination: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default CarouselSitePagesItem;

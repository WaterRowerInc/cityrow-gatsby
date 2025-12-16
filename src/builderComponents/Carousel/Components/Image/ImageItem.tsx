import * as React from "react";
import { ImageType } from "./ImageType";
import "./Image.scss";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";

function ImageItem({ item }: { item: ImageType }) {
  return (
    <div className='image-carousel__content'>
      <div className='image-carousel__content__story-frame'>
        <a href={item.imageModel?.link} rel={"origin"}>
          <BuilderImage imageModel={item.imageModel} className='image-carousel__content__story-frame__member-photo' />
        </a>
        {item.member && item.location && item.body && (
          <div className='image-carousel__content__story-frame__text-section'>
            <div className='image-carousel__content__story-frame__text-section__name'>{item.member}</div>
            <div className='image-carousel__content__story-frame__text-section__location'>{item.location}</div>
            <div className='image-carousel__content__story-frame__text-section__review'>{item.body}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageItem;

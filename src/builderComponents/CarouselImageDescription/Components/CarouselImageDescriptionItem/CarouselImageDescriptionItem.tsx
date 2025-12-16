import React from "react";
import "./CarouselImageDescriptionItem.scss";

const CarouselImageDescriptionItem = ({
  item: { image, name, location, description },
}: {
  item: CarouselImageDescriptionItemProps;
}) => {
  return (
    <div className='carousel-image-description-item__container'>
      <img src={image} className='carousel-image-description-item__photo' alt={name} />
      <div className='carousel-image-description-item__textContainer'>
        <h4 className='carousel-image-description-item__name'>{name}</h4>
        <p className='carousel-image-description-item__location'>{location}</p>
        <p className='carousel-image-description-item__description'>{description}</p>
      </div>
    </div>
  );
};

export interface CarouselImageDescriptionItemProps {
  image: string;
  name: string;
  location: string;
  description: string;
}

export default CarouselImageDescriptionItem;

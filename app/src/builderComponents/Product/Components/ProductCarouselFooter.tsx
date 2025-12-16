import React from "react";
import "./ProductCarouselFooter.scss";

const ProductCarouselFooter = ({ description, specs = "" }: { description: string; specs?: string }) => {
  return (
    <div className='productCarouselFooter__container'>
      <div className='productCarouselFooter__wrapper'>
        <div className='productCarouselFooter__description__container'>
          <h2 className='productCarouselFooter__description__title'>PRODUCT DESCRIPTION</h2>
          <p className='productCarouselFooter__description__text'>{description}</p>
        </div>
        <div className='productCarouselFooter__specs__container'>
          <h2 className='productCarouselFooter__specs__title'>PRODUCT SPECS</h2>
          <p className='productCarouselFooter__specs__text' dangerouslySetInnerHTML={{ __html: specs }} />
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselFooter;

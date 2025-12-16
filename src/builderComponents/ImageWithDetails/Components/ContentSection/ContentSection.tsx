import BulletList from "components/BulletList/BulletList";
import RowButtons from "components/RowButtons/RowButtons";
import React from "react";
import "./ContentSection.scss";

function ContentSection({
  introText,
  header,
  body,
  bulletsPoints,
  ctas,
  price,
  priceWithoutSale,
}: {
  introText: string;
  header: string;
  body: string;
  bulletsPoints: { text: string }[];
  ctas: {
    label: string;
    destination: string;
    variation: string;
  }[];
  price: string;
  priceWithoutSale?: string;
}) {
  return (
    <div className='img-with-details__content__container'>
      <h2 className='img-with-details__content__introText'>{introText}</h2>
      <h2 className='img-with-details__content__title'>{header}</h2>
      <p className='img-with-details__content__description'>{body}</p>
      {price && (
        <>
          <div className='img-with-details__price__container'>
            <p>Starting at</p>
            {priceWithoutSale && <p className='img-with-details__price__text-sale'>{priceWithoutSale}</p>}
            <p className='img-with-details__price__text'>{price}</p>
          </div>
        </>
      )}
      {bulletsPoints?.length ? <BulletList options={bulletsPoints} /> : null}
      {ctas?.length ? <RowButtons ctas={ctas} /> : null}
    </div>
  );
}

export default ContentSection;

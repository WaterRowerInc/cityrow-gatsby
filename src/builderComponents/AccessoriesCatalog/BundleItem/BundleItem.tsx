import CustomButton from "../../../components/CustomButton/CustomButton";
import React from "react";
import { BundleVM } from "./BundleVM";
import "./BundleItem.scss";

const BundleItem = ({ bundleItem }: { bundleItem: BundleVM }) => {
  return (
    <div className={"bundle-item__container__"}>
      <img
        src={bundleItem.images[0]}
        title={bundleItem.name}
        className={"bundle-item__container__photo"}
        alt={bundleItem.name}
      />
      <h1 className='bundle-item__container__name'>{bundleItem.name}</h1>
      <h2 className='bundle-item__container__price'>{bundleItem.price}</h2>
      <h3 className='bundle-item__container__price-clarification'>{bundleItem.priceClarification}</h3>
      <div className='bundle-item__container__separator'>.</div>
      {bundleItem.items && (
        <div>
          <h3 className='bundle-item__container__include-title'>INCLUDES</h3>
          {bundleItem.items.map((included, index) => (
            <h3 key={`ii${index}`} className='bundle-item__container__item-included'>
              {included}
            </h3>
          ))}
        </div>
      )}
      <a
        href={`/accessories/${bundleItem.slug}-bundle`}
        rel='origin'
        className='bundle-item__container__cta-box'
        title={`Shop ${bundleItem.name}`}
      >
        <CustomButton text='SHOP THE KIT' customClass='bundle-item__container__cta-box--button' />
      </a>
    </div>
  );
};

export default BundleItem;

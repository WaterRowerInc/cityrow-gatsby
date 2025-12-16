import React from "react";
import "./ShopAll.scss";
import ShopAllItem from "./Components/ShopAllItem/ShopAllItem";
import ShopAllItemProps from "./Components/ShopAllItem/ShopAllItemProps";

const ShopAll = ({ title, description, items }: { title: string; description: string; items: ShopAllItemProps[] }) => {
  return (
    <div className='shop-all__container__'>
      <h1 className='shop-all__container__title'>{title}</h1>
      <div className='shop-all__container__title-border'>.</div>
      <p className='shop-all__container__description'>{description}</p>
      <div className='shop-all__container__items-box'>
        <div className='shop-all__container__items-box--container'>
          {items && items.map((item, index) => <ShopAllItem key={`sa${index}`} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default ShopAll;

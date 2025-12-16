import React from "react";
import { ProductVM } from "../../builderComponents/Product/ProductVM";
import "./UpSellsSection.scss";
import CustomButton from "../CustomButton/CustomButton";

const UpSellSection = ({ products, title }: { products: ProductVM[]; title: string }) => {
  if (!products?.length) return null;
  return (
    <>
      <h2 className='upSellsSection__title'>{title}</h2>
      <div className='upSellsSection__underLine' />
      <div className='upSellsSection__product__container'>
        {products.map((product) => (
          <div key={product.id} className='upSellsSection__product__wrapper'>
            <div
              style={{ backgroundImage: `url(${product.images?.[0]})` }}
              className='upSellsSection__product__image'
            />
            <h6 className='upSellsSection__product__name'>{product.name}</h6>
            <h6 className='upSellsSection__product__price'>{product.price}</h6>
            <p className='upSellsSection__product__priceComment'>excludes tax & shipping</p>
            <CustomButton text='SHOP THE PRODUCT' customClass='upSellsSection__product__button' />
          </div>
        ))}
      </div>
    </>
  );
};

export default UpSellSection;

import React from "react";
import "./ProductPrice.scss";

const ProductPrice = ({
  price,
  priceWithoutSale,
  hasFinancingDescription,
}: {
  price?: string;
  priceWithoutSale?: string;
  hasFinancingDescription?: boolean;
}) => (
  <div className='productPrice__container'>
    {priceWithoutSale && <p className='productPrice__text sale'>{priceWithoutSale}</p>}
    <p className='productPrice__text'>{price}</p>
    {hasFinancingDescription && <p className='productPrice__subText'>plus tax and subscription</p>}
  </div>
);

export default ProductPrice;

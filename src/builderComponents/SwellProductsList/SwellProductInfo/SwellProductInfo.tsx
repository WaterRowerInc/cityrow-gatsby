import React from "react";
import "./SwellProductInfo.scss";
import { SwellProductInfoVM } from "../../../components/SwellProductInfo/SwellProductInfoVM";

const SwellProductInfo = ({ product }: { product: SwellProductInfoVM }) => {
  return (
    <div className={"swell-product-container__"}>
      <h4 className={"swell-product__container__title"}>{`${product.name} - SLUG: ${product.slug}`}</h4>
      <h4 className={"swell-product__container__subtitle"}>
        {`On CITYROW: /product/${product.slug} - On Swell Store: /admin/products/${product.id}`}
      </h4>
    </div>
  );
};

export default SwellProductInfo;

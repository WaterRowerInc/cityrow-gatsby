import clsx from "classnames";
import React from "react";
import { ProductComparisonDetail, ProductSection } from "./components/ProductSection";
import "./ProductComparison.scss";

const ProductComparison = ({
  header,
  theme,
  leftProduct,
  rightProduct,
}: {
  header?: string;
  theme: "dark" | "blue" | "light";
  leftProduct: ProductComparisonDetail;
  rightProduct: ProductComparisonDetail;
}) => {
  return (
    <section
      className={clsx(
        "productComparison__section",
        { "productComparison__section--dark": theme === "dark" },
        { "productComparison__section--light": theme === "light" }
      )}
    >
      {header && <h4 className='productComparison__header'>{header}</h4>}
      <div className='productComparison__container'>
        <ProductSection product={leftProduct} />
        <div className='productComparison__divider' />
        <ProductSection product={rightProduct} />
      </div>
    </section>
  );
};

export default ProductComparison;

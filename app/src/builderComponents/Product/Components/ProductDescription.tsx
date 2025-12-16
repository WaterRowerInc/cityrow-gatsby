import React from "react";
import "./ProductDescription.scss";

const ProductDescription = ({ description }: { description: string }) => (
  <div className='productDescription__text' dangerouslySetInnerHTML={{ __html: description }} />
);

export default ProductDescription;

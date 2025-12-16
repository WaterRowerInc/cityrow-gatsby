import React from "react";
import "./ProductHeader.scss";

const ProductHeader = ({ header }: { header?: string }) => <h1 className='productHeader__text'>{header}</h1>;

export default ProductHeader;

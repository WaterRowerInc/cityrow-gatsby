import React from "react";
import { ProductOptionValueVM } from "../../Product/ProductVM";

const ColorBadge = ({ color }: { color: ProductOptionValueVM }) => {
  return (
    <div
      style={{
        backgroundColor: color.name,
        border: color.name.toLowerCase() === "white" ? `1px solid #b2b2b2` : `1px solid ${color.name}`,
      }}
      title={color.name}
    />
  );
};

export default ColorBadge;

import React from "react";
import "./AccessoryItem.scss";
import { AccessoryVM } from "./AccessoryVM";
import ColorBadge from "../ColorBadge/ColorBadge";

const AccessoryItem = ({ accessoryItem }: { accessoryItem: AccessoryVM }) => {
  const colors = accessoryItem.options.find((option) => option.attributeId === "color");
  return (
    <a
      className='accessories-catalog-item__container__'
      href={`/accessories/${accessoryItem.slug}`}
      rel='origin'
      title={`Shop ${accessoryItem.name}`}
    >
      <img
        src={accessoryItem.images[0]}
        title={accessoryItem.name}
        className='accessories-catalog-item__container__photo'
        alt={accessoryItem.name}
      />
      <h3 className={"accessories-catalog-item__container__name"}>{accessoryItem.name}</h3>
      <h3 className={"accessories-catalog-item__container__price"}>
        {accessoryItem.priceWithoutSale ? (
          <>
            <span className='accessories-catalog-item__container__price__original'>
              {accessoryItem.priceWithoutSale}
            </span>
            <span className='accessories-catalog-item__container__price__sale'>
              {accessoryItem.priceRange}
            </span>
          </>
        ) : (
          accessoryItem.priceRange
        )}
      </h3>
      {colors && (
        <div className='accessories-catalog-item__container__colors-box__'>
          {colors.values.map((color, index) => (
            <ColorBadge color={color} key={`aci${index}`} />
          ))}
        </div>
      )}
    </a>
  );
};

export default AccessoryItem;

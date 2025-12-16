import React from "react";
import "./ApparelItem.scss";
import { ApparelVM } from "../ApparelVM";
import ColorBadge from "../ColorBadge/ColorBadge";

const ApparelItem = ({ apparelItem }: { apparelItem: ApparelVM }) => {
  const colors = apparelItem.options.find((option) => option.attributeId === "color");
  return (
    <a
      className={"apparel-catalog-item__container__"}
      href={`/apparel/${apparelItem.slug}`}
      rel={"origin"}
      title={`Shop ${apparelItem.name}`}
    >
      <img
        src={apparelItem.images[0]}
        title={apparelItem.name}
        className={"apparel-catalog-item__container__photo"}
        alt={apparelItem.name}
      />
      <h3 className={"apparel-catalog-item__container__name"}>{apparelItem.name}</h3>
      <h3 className={"apparel-catalog-item__container__group"}>{apparelItem.subtitle}</h3>
      <h3 className={"apparel-catalog-item__container__price"}>
        {apparelItem.priceWithoutSale ? (
          <>
            <span className='accessories-catalog-item__container__price__original'>
              {apparelItem.priceWithoutSale}
            </span>
            <span className='accessories-catalog-item__container__price__sale'>
              {apparelItem.price}
            </span>
          </>
        ) : (
          apparelItem.price
        )}
      </h3>
      {colors && (
        <div className={"apparel-catalog-item__container__colors-box__"}>
          {colors.values.map((color, index) => (
            <ColorBadge color={color} key={`aci${index}`} />
          ))}
        </div>
      )}
    </a>
  );
};

export default ApparelItem;

import React from "react";
import "./Item.scss";
import { CartItemVM } from "../../Cart/CartVM";

const Item = ({
  subscriptionHasTrial = true,
  item,
  onRemoveClick,
}: {
  subscriptionHasTrial?: boolean;
  item?: CartItemVM;
  onRemoveClick: (itemId: string) => void;
}) => {
  return (
    <div className={"cart-details__item__container"}>
      <div className={"cart-details__item__name-price-wrapper"}>
        <h5 className={"cart-details__item__name"}>
          {item?.quantity! > 1 && `(${item?.quantity}) - `}
          {item?.name}
        </h5>
        <h5 className={item?.hasSalePrice ? "cart-details__item__price" : "cart-details__item__price-bold"}>
          {item?.hasSalePrice && "Orig."}
        </h5>
        <h5
          className={
            item?.hasSalePrice
              ? "cart-details__item__price cart-details__item__price-striked"
              : "cart-details__item__price-bold"
          }
        >
          {item?.hasSalePrice ? item?.originalPrice : item?.price}
        </h5>
      </div>

      {item?.isSubscription && (
        <p className={"cart-details__item__subtitle"}>{item.subtitle}</p>
      )}
      {item?.appliedPromotionName && (
        <div className={"cart-details__item__promo__wrapper"}>
          <h5 className={"cart-details__item__promo__title"}>{item?.appliedPromotionName}</h5>
          <h5 className={"cart-details__item__promo__price"}>Sale {item?.price}</h5>
        </div>
      )}
      {item?.hasSalePrice && (
        <div className={"cart-details__item__promo__wrapper"}>
          <h5 className={"cart-details__item__promo__title"}>Sale Price</h5>
          <h5 className={"cart-details__item__promo__price"}>{item?.price}</h5>
        </div>
      )}
      <div className={"cart-details__item__options__container"}>
        {!item?.isSubscription &&
          item?.options?.map((option, i) => (
            <div key={`${option.name}${i}`} className={"cart-details__item__options__wrapper"}>
              <p className={"cart-details__item__options__name"}>{option.name}:&nbsp;</p>
              <p className={"cart-details__item__options__value"}>{option.value}</p>
            </div>
          ))}
      </div>

      {item?.disclaimer && subscriptionHasTrial && <p className='cart-details__item__disclaimer'>{item?.disclaimer}</p>}

      {item?.bundleItems && (
        <div className={"cart-details__item__bundle__container"}>
          {item?.bundleItems?.map((bundleItem: CartItemVM, i) => (
            <div key={`${bundleItem.name}${i}`}>
              <p className={"cart-details__item__bundle__title"}>
                ({bundleItem.quantity}) {bundleItem.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <a className={"cart-details__item__remove"} onClick={() => onRemoveClick(item?.id || "")}>
        Remove
      </a>
    </div>
  );
};

export default Item;

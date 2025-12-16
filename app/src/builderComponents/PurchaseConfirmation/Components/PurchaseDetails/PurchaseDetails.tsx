import * as React from "react";
import TotalPricesList from "../../../../components/CartDetails/Components/TotalPricesList";
import { OrderItemVM, OrderVM } from "../../OrderVM";
import "./PurchaseDetails.scss";

const PurchaseDetails = ({ order }: { order?: OrderVM }) => (
  <div className='purchase-details__content'>
    <div className={"purchase-details__content-border"}>.</div>

    {order?.items
      .filter((item) => !item.product.isSubscription)
      .map((item) => (
        <RenderItem key={item.product.id} order={item} />
      ))}

    <div className={"purchase-details__content-border"}>.</div>

    <div>
      <TotalPricesList
        discounts={order?.discounts}
        subtotal={order?.subTotal}
        shipping={order?.delivery}
        tax={order?.taxes}
      />
    </div>

    <div className='purchase-details__total-price__container'>
      <p className='purchase-details__total-price__title'>Total</p>
      <p className='purchase-details__total-price__price'>{order?.total}</p>
    </div>
  </div>
);

const RenderItem = ({ order }: { order: OrderItemVM }) => {
  const { product, quantity, hasSalePrice, options, originalPrice, price } = order;
  return (
    <div className={"purchase-details__item__container"}>
      <div className={"purchase-details__item__name-price-wrapper"}>
        <h5 className={"purchase-details__item__name"}>
          {quantity > 1 && `(${quantity}) - `}
          {product?.name}
        </h5>
        <h5
          className={
            hasSalePrice || product?.discountTitle
              ? "purchase-details__item__price striked"
              : "purchase-details__item__price"
          }
        >
          {(hasSalePrice || product?.discountTitle) && "Orig. "}
          {hasSalePrice ? originalPrice : price}
        </h5>
      </div>

      {(product?.discountTitle || hasSalePrice) && (
        <div className={"purchase-details__item__promo__wrapper"}>
          <h5 className={"purchase-details__item__promo__title"}>{product?.discountTitle}</h5>
          <h5 className={"purchase-details__item__promo__price"}>Sale {price}</h5>
        </div>
      )}

      <div className={"purchase-details__item__options__container"}>
        {options?.map((option, i) => (
          <div key={`${option.name}${i}`} className={"purchase-details__item__options__wrapper"}>
            <p className={"purchase-details__item__options__body"}>{option?.name || option?.id}:&nbsp;</p>
            <p className={"purchase-details__item__options__body"}>{option?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseDetails;

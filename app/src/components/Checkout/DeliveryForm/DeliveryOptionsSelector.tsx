import React, { useEffect, useState } from "react";
import RadioButton from "../../Form/RadioButton/RadioButton";
import "./DeliveryOptionsSelector.scss";

const DeliveryOptionsSelector = ({
  defaultValue,
  isJustInfo,
  onSelect,
  shippingOptions,
}: {
  defaultValue?: any;
  isJustInfo: boolean;
  onSelect: (deliveryOption: string) => void;
  shippingOptions: any;
}) => {
  const [selected, setSelected] = useState(shippingOptions[0]?.id || defaultValue);
  const select = (value, disabled) => {
    if (isJustInfo || value === selected || disabled) return;
    onSelect(value);
    setSelected(value);
  };
  useEffect(() => {
    if (shippingOptions?.length) {
      select(shippingOptions[0]?.id, shippingOptions[0]?.disabled);
    }
  }, [shippingOptions]);
  return (
    <div className={"delivery-options-selector__container__"}>
      {shippingOptions?.map((shippingOption, key) => (
        <div
          className={`delivery-options-selector__container__item__
        ${shippingOption.disabled && "delivery-options-selector__container__item__--disabled"}`}
          key={`${shippingOption.id}${key}`}
        >
          {!isJustInfo && shippingOptions.length > 1 && (
            <RadioButton
              selected={selected === shippingOption.id}
              onClick={() => select(shippingOption.id, shippingOption.disabled)}
            />
          )}
          <div className={"delivery-options-selector__container__item__info__"}>
            <div
              className={"delivery-options-selector__container__item__info__title-row__"}
              onClick={() => select(shippingOption.id, shippingOption.disabled)}
            >
              <h4 className={"delivery-options-selector__container__item__info__title-row__name"}>
                {shippingOption.name}
              </h4>
              {!isJustInfo && (
                <h4 className={"delivery-options-selector__container__item__info__title-row__price"}>
                  {shippingOption.price}
                </h4>
              )}
            </div>
            <h4 className={"delivery-options-selector__container__item__info__estimation"}>
              {shippingOption.description}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryOptionsSelector;

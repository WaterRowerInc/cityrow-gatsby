import React, { useEffect, useState } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import "./TabletSize.scss";

const TabletSize = ({
  options,
  onSelect,
  variants,
  productName,
}: {
  options?: ProductOptionValueVM[];
  onSelect: (variant: VariantVM) => void;
  variants: VariantVM[];
  productName: string;
}) => {
  useEffect(() => {
    if (!options?.[0]) return;
    onSelect(variants.find((variant) => variant.optionsIds[0] === options[0].id)!);
  }, [options]);

  if (!options?.length) return null;
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const getVariantFromOptionValue = (option: ProductOptionValueVM): VariantVM =>
    variants.find((variant) => variant.optionsIds.find((optionId) => optionId === option.id))!;

  return (
    <div className='tabletSize__option__wrapper'>
      {options.map((option) => (
        <div
          className={`tabletSize__option__container ${
            selectedOption.id === option.id && "tabletSize__option__container__selected"
          }`}
          key={option.id}
          onClick={() => {
            setSelectedOption(option);
            onSelect(variants.find((variant) => variant.optionsIds[0] === option.id)!);
          }}
        >
          <div className='tabletSize__option__body'>
            <h5 className='tabletSize__option__title'>{productName.toUpperCase()}</h5>
            <div className='tabletSize__option__namePriceContainer'>
              <p className='tabletSize__option__name'>{option.name}</p>
              <p className='tabletSize__option__price'>{getVariantFromOptionValue(option).price}</p>
            </div>
            <p className='tabletSize__option__description'>{option.description}</p>
          </div>
          <div
            className='tabletSize__option__image'
            style={{ backgroundImage: `url(${getVariantFromOptionValue(option).images?.[0]})` }}
          />
        </div>
      ))}
    </div>
  );
};

export default TabletSize;

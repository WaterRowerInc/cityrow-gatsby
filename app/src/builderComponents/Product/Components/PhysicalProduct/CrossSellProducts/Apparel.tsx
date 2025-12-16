import React, { useEffect, useState } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import Sizes from "../ProductOptions/Sizes";
import Quantity from "../ProductOptions/Quantity";
import Colors from "../ProductOptions/Colors";
import "./Apparel.scss";

const Apparel = ({
  sizeOptions,
  colorOptions,
  variants,
  description,
  stockTracking,
  onSelect,
}: {
  sizeOptions?: ProductOptionValueVM[];
  colorOptions?: ProductOptionValueVM[];
  variants: VariantVM[];
  description: string;
  stockTracking: boolean;
  onSelect: (variant: VariantVM) => void;
}) => {
  if (!sizeOptions?.length && !colorOptions?.length) return null;

  const getVariantFromOptionValue = (option: ProductOptionValueVM): VariantVM =>
    variants.find((variant) => variant.optionsIds.find((optionId) => optionId === option.id))!;

  const getVariantFromOptionsValues = (
    sizeOption?: ProductOptionValueVM,
    colorOption?: ProductOptionValueVM
  ): VariantVM => {
    if (!sizeOption) return getVariantFromOptionValue(colorOption!);
    if (!colorOption) return getVariantFromOptionValue(sizeOption!);
    return variants.find(
      (variant) => variant.optionsIds.includes(sizeOption.id) && variant.optionsIds.includes(colorOption.id)
    )!;
  };

  const [selectedVariant, setSelectedVariant] = useState(
    getVariantFromOptionsValues(sizeOptions?.[0], colorOptions?.[0])
  );

  useEffect(() => {
    onSelect(selectedVariant);
  }, [selectedVariant]);

  return (
    <div className='apparel__container'>
      <div className='apparel__optionsDetails__wrapper'>
        <div className='apparel__optionsDetails__price__container'>
          <p className='apparel__optionsDetails__price__text'>{selectedVariant?.price || 0}</p>
          <p className='apparel__optionsDetails__price__subText'>price excludes tax</p>
        </div>
        <div className='apparel__optionsDetails__description'>{description}</div>
        <div className='apparel__optionsDetails__sizeAndQty'>
          <Sizes
            options={sizeOptions}
            variants={variants}
            onSelect={(variant) => {
              setSelectedVariant(variant);
              onSelect(variant);
            }}
          />
          <Quantity stock={selectedVariant?.stock || 0} stockTracking={stockTracking} onQuantitySelected={() => null} />
        </div>
        <Colors
          options={colorOptions}
          variants={variants}
          onSelect={(variant) => {
            setSelectedVariant(variant);
            onSelect(variant);
          }}
        />
      </div>
      <div className='apparel__image' style={{ backgroundImage: `url(${selectedVariant.images?.[0]})` }} />
    </div>
  );
};

export default Apparel;

import React, { useEffect, useRef, useState } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import "./WoodColors.scss";

const WoodColors = ({
  options,
  onSelect,
  variants,
  description,
  hidePrice,
}: {
  options?: ProductOptionValueVM[];
  onSelect: (variant: VariantVM) => void;
  variants: VariantVM[];
  description: string;
  hidePrice?: boolean;
}) => {
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (!options || !options[0]) return;
    selectRef.current.value = options[0].name;
    onSelect(variants.find((variant) => variant.optionsIds[0] === options[0].id)!);
  }, [options]);

  if (!options?.length) return null;

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const getVariantFromOptionValue = (option: ProductOptionValueVM): VariantVM =>
    variants.find((variant) => variant.optionsIds.find((optionId) => optionId === option.id))!;

  return (
    <div className='woodColors__container'>
      <div className='woodColors__details__container'>
        <div className='woodColors__details__textWrapper'>
          {!hidePrice && (
            <div className='woodColors__details__priceContainer'>
              <p className='woodColors__details__price'>{selectedOption.price}</p>
              <p className='woodColors__details__priceComment'>price varies based on arm selection</p>
            </div>
          )}
          <p className='woodColors__details__description'>{description}</p>
        </div>
        <div
          className='woodColors__details__image'
          style={{ backgroundImage: `url(${getVariantFromOptionValue(selectedOption).images?.[0]})` }}
        />
      </div>
      <select
        ref={selectRef}
        placeholder='Wood Color'
        className='woodColors__select'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const newOption = options.find((option) => option.name.toUpperCase() === e.target.value.toUpperCase())!;
          onSelect(variants.find((variant) => variant.optionsIds[0] === newOption.id)!);
          setSelectedOption(newOption);
        }}
      >
        {options.map((option: ProductOptionValueVM) => (
          <option key={option.id} value={option.name}>
            {`${option.name} - ${option.description}`} {!hidePrice && " - " + option.price}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WoodColors;

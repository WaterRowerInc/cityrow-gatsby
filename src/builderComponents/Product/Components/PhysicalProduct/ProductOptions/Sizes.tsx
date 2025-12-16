import React, { useEffect, useRef, useState } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import "./Sizes.scss";

const Sizes = ({
  options,
  variants,
  onSelect,
  selectedVariant,
  selectedOptions,
}: {
  options?: ProductOptionValueVM[];
  variants?: VariantVM[];
  onSelect: (variant: VariantVM) => void;
  selectedVariant?: VariantVM;
  selectedOptions?: string[];
}) => {
  const selectRef = useRef<any>(null);
  const [availableOptions, setAvailableOptions] = useState<ProductOptionValueVM[]>([]);

  useEffect(() => {
    if (!availableOptions?.length) return;
    const selectedOption = selectedVariant?.optionsIds[0]
      ? availableOptions.find((option) => option.id === selectedVariant?.optionsIds[0])
      : availableOptions[0];

    selectRef.current.value = selectedOption!.name;
    onSelect(variants?.find((variant) => variant.optionsIds[0] === selectedOption!.id)!);
  }, [options]);

  useEffect(() => {
    if (!options?.length) return;
    setAvailableOptions(
      options?.filter((option) => selectedVariant?.optionsIds[0] == option.id || !selectedOptions?.includes(option.id))
    );
  }, [selectedVariant, selectedOptions]);

  useEffect(() => {
    if (selectedVariant && availableOptions?.length) {
      selectRef.current.value = availableOptions?.find((option) => option.id == selectedVariant.optionsIds[0])?.name;
    }
  }, [availableOptions]);

  if (!availableOptions?.length) return null;

  return (
    <div className='sizes__container'>
      <h6 className='sizes__title'>Size</h6>
      <select
        ref={selectRef}
        placeholder='Size'
        className='sizes__select'
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          const newOption = availableOptions?.find(
            (option) => option.name.toUpperCase() === event.target.value.toUpperCase()
          )!;
          onSelect(variants?.find((variant) => variant.optionsIds.find((optionIds) => optionIds === newOption.id))!);
        }}
      >
        {availableOptions?.map((option: ProductOptionValueVM) => (
          <option key={option.id} value={option.name} className='sizes__option'>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Sizes;

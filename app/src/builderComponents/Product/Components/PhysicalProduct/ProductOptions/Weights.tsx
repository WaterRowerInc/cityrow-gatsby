import React, { useEffect, useRef } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import "./Weights.scss";

const Weights = ({
  options,
  variants,
  onSelect,
}: {
  options?: ProductOptionValueVM[];
  variants?: VariantVM[];
  onSelect: (variant: VariantVM) => void;
}) => {
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (!options || !options[0]) return;
    selectRef.current.value = variants![0].name;
    onSelect(variants![0]);
  }, [options]);

  if (!options?.length) return null;

  return (
    <div className='weights__container'>
      <h6 className='weights__title'>Weight</h6>
      <select
        ref={selectRef}
        placeholder='Weight'
        className='weights__select'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const newOption = options.find((option) => option.name.toUpperCase() === e.target.value.toUpperCase())!;
          onSelect(variants?.find((variant) => variant.optionsIds.find((optionId) => optionId === newOption.id))!);
        }}
      >
        {options.map((option: ProductOptionValueVM) => (
          <option key={option.id} value={option.name} className='weights__option'>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Weights;

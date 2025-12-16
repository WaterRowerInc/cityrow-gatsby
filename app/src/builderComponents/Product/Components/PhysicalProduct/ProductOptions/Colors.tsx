import React, { useEffect, useState } from "react";
import "./Colors.scss";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";

const Colors = ({
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
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [availableOptions, setAvailableOptions] = useState<ProductOptionValueVM[]>([]);

  useEffect(() => {
    if (!availableOptions?.length) return;
    setSelectedColorId(selectedVariant ? selectedVariant.optionsIds[0] : availableOptions[0].id);
    onSelect(selectedVariant ?? variants?.find((variant) => variant.optionsIds[0] === availableOptions[0].id)!);
  }, [options]);

  useEffect(() => {
    if (!options?.length) return;
    setAvailableOptions(
      options?.filter((option) => selectedVariant?.optionsIds[0] == option.id || !selectedOptions?.includes(option.id))
    );
  }, [selectedVariant, selectedOptions]);

  useEffect(() => {
    if (selectedVariant && availableOptions?.length) setSelectedColorId(selectedVariant.optionsIds[0]);
  }, [availableOptions]);

  if (!availableOptions?.length) return null;
  return (
    <div className='colors__container'>
      {availableOptions.map((option) => (
        <div
          key={option.id}
          className='colors__color-container'
          onClick={() => onSelect(variants?.find((variant) => variant.optionsIds.find((id) => id === option.id))!)}
        >
          <div className='colors__selected' style={selectedColorId === option.id ? { borderWidth: "3px" } : {}}>
            <div className='colors__color' style={{ backgroundColor: `${option.name.toLowerCase()}` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Colors;

import React, { useEffect, useRef, useState } from "react";
import { ProductOptionValueVM, VariantVM } from "../../../ProductVM";
import "./MonitorWoodType.scss";

const MonitorWoodType = ({
  options,
  onSelect,
  variants,
}: {
  options?: ProductOptionValueVM[];
  onSelect: (variant: VariantVM) => void;
  variants: VariantVM[];
}) => {
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (!options || !options[0]) return;
    selectRef.current.value = options[0].name;
    const variant = variants.find((variant) => variant.optionsIds[0] === options[0].id)!;
    variant.notShowOnCarousel = true;
    onSelect(variant);
  }, [options]);

  if (!options?.length) return null;

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const getVariantFromOptionValue = (option: ProductOptionValueVM): VariantVM =>
    variants.find((variant) => variant.optionsIds.find((optionId) => optionId === option.id))!;

  return (
    <div className='monitorWoodType__container'>
      <div className='monitorWoodType__details__container'>
        {getVariantFromOptionValue(selectedOption).images.length > 0 && (
          <div
            className='monitorWoodType__details__image'
            style={{ backgroundImage: `url(${getVariantFromOptionValue(selectedOption).images?.[0]})` }}
          />
        )}
      </div>
      <h3 className='monitorWoodType__title'>Choose your WaterRower’s monitor + wood type</h3>
      <h5 className='monitorWoodType__subTitle'>
        Not sure which WaterRower you have? Find out{" "}
        <a href='https://www.waterrowerservice.com/model-identification/'>here</a>.
      </h5>
      <select
        ref={selectRef}
        placeholder='Monitor + Wood Type'
        className='monitorWoodType__select'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const newOption = options.find((option) => option.name.toUpperCase() === e.target.value.toUpperCase())!;
          const variant = variants.find((variant) => variant.optionsIds[0] === newOption.id)!;
          variant.notShowOnCarousel = true;
          onSelect(variant);
          setSelectedOption(newOption);
        }}
      >
        {options.map((option: ProductOptionValueVM) => (
          <option key={option.id} value={option.name}>
            {option.name} {option.price != "$0" && `+${option.price}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonitorWoodType;

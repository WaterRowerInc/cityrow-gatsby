import React, { useEffect, useState } from "react";
import "./MultipleVariantsSelection.scss";
import Weights from "./Weights";
import { VariantVM } from "../../../ProductVM";

const MultipleVariantsSelection = ({
  productName,
  variants,
  onOptionSelect,
  getOptions,
}: {
  productName?: string;
  variants?: VariantVM[];
  onOptionSelect: (variants: VariantVM[]) => void;
  getOptions: (attributeId: string) => any;
}) => {
  const [quantitySelected, setQuantitySelected] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<VariantVM[]>([]);

  useEffect(() => {
    setQuantitySelected(1);
  }, []);

  useEffect(() => {
    if (quantitySelected - selectedVariants.length > 0) {
      const newSelectedVariants = [...selectedVariants];
      for (let i = 0; i < quantitySelected - selectedVariants.length; i++) newSelectedVariants.push(variants![0]);
      setSelectedVariants(newSelectedVariants);
    } else {
      setSelectedVariants(selectedVariants.slice(0, quantitySelected));
    }
  }, [quantitySelected]);

  useEffect(() => {
    onOptionSelect(selectedVariants);
  }, [selectedVariants]);

  const handleOnSelect = (variant: VariantVM, index: number) => {
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = variant;
    setSelectedVariants(newSelectedVariants);
  };

  return (
    <div className='multipleVariantsSelection__container'>
      <div className='multipleVariantsSelection__quantity__container'>
        <h6 className='multipleVariantsSelection__quantity__title'>{productName}</h6>
        {Array.from(Array(7).keys())
          .slice(1)
          .map((number) => (
            <div
              key={number}
              className='multipleVariantsSelection__quantity__numberContainer'
              onClick={() => {
                setQuantitySelected(number);
              }}
            >
              <div
                className='multipleVariantsSelection__quantity__selected'
                style={quantitySelected === number ? { borderWidth: "3px" } : {}}
              >
                <p
                  className='multipleVariantsSelection__quantity__number'
                  style={quantitySelected === number ? { color: "#30353C" } : {}}
                >
                  {number}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className='multipleVariantsSelection__variants__container'>
        {Array.from(Array(quantitySelected).keys()).map((number: number, index: number) => {
          return (
            <Weights
              key={number}
              options={getOptions("weight")}
              variants={variants}
              onSelect={(variant: VariantVM) => handleOnSelect(variant, index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MultipleVariantsSelection;

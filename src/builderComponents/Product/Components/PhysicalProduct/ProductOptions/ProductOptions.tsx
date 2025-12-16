import React from "react";
import Sizes from "./Sizes";
import { ProductOptionValueVM, ProductVM, VariantVM } from "../../../ProductVM";
import "./ProductOptions.scss";
import Quantity from "./Quantity";
import Colors from "./Colors";
import Weights from "./Weights";
import MultipleVariantsSelection from "./MultipleVariantsSelection";
import TabletSize from "../CrossSellProducts/TabletSize";
import WoodColors from "../CrossSellProducts/WoodColors";
import MonitorWoodType from "../CrossSellProducts/MonitorWoodType";

const ProductOptions = ({
  product,
  stock,
  onOptionSelect,
  onMultipleVariantOptionSelect,
  selectedVariant,
  selectedOptions,
  removeVariant,
}: {
  product: ProductVM | null;
  stock: number;
  onOptionSelect: (variant: VariantVM) => void;
  onMultipleVariantOptionSelect: (variants: VariantVM[]) => void;
  selectedVariant?: VariantVM;
  selectedOptions?: string[];
  removeVariant?: () => void;
}) => {
  if (!product?.options?.length) return null;

  const getOptionValuesByAttributeId = (attributeId: string): ProductOptionValueVM[] | undefined =>
    product?.options?.find((option) => option.name?.toLowerCase() === attributeId.toLowerCase())?.values;

  const getVariantsByProduct = (product: ProductVM): VariantVM[] => product.variants;

  if (product?.acceptsMultipleVariants)
    return (
      <MultipleVariantsSelection
        productName={product?.name}
        onOptionSelect={onMultipleVariantOptionSelect}
        variants={getVariantsByProduct(product)}
        getOptions={getOptionValuesByAttributeId}
      />
    );

  return (
    <div className='productOptions__container'>
      <div className='productOptions__sizeAndQtyContainer'>
        <Sizes
          options={getOptionValuesByAttributeId("apparel size")}
          selectedVariant={selectedVariant}
          selectedOptions={selectedOptions}
          variants={getVariantsByProduct(product)}
          onSelect={onOptionSelect}
        />
        <Weights
          options={getOptionValuesByAttributeId("weight")}
          variants={getVariantsByProduct(product)}
          onSelect={onOptionSelect}
        />
        <TabletSize
          options={getOptionValuesByAttributeId("tablet size")}
          onSelect={onOptionSelect}
          variants={getVariantsByProduct(product)}
          productName={product.name}
        />
        <WoodColors
          options={getOptionValuesByAttributeId("wood color")}
          onSelect={onOptionSelect}
          variants={getVariantsByProduct(product)}
          description={product.description}
          hidePrice
        />
        <MonitorWoodType
          options={getOptionValuesByAttributeId("monitor wood type")}
          onSelect={onOptionSelect}
          variants={getVariantsByProduct(product)}
        />
        <Quantity
          stock={stock}
          stockTracking={product?.stockTracking}
          onQuantitySelected={(quantity) => (selectedVariant ? onOptionSelect({ ...selectedVariant, quantity }) : null)}
        />
      </div>
      <Colors
        selectedVariant={selectedVariant}
        options={getOptionValuesByAttributeId("color")}
        variants={getVariantsByProduct(product)}
        onSelect={onOptionSelect}
        selectedOptions={selectedOptions}
      />
      {selectedOptions && selectedOptions.length > 1 && (
        <a className={"cart-details__item__remove"} onClick={removeVariant}>
          Remove
        </a>
      )}
    </div>
  );
};

export default ProductOptions;

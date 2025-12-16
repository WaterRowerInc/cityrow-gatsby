import React, { useEffect, useState } from "react";
import { ProductOptionValueVM, ProductVM, VariantVM } from "../../../ProductVM";
import CheckBox from "./CheckBox";
import WoodColors from "./WoodColors";
import TabletSize from "./TabletSize";
import Apparel from "./Apparel";

const CrossSellProducts = ({
  crossSellProducts,
  mainCrossSellProductId,
  onCrossSellVariantsSelect,
  onCrossSellProductsSelect,
  onCrossSellProductsRemove,
}: {
  crossSellProducts: ProductVM[];
  mainCrossSellProductId?: string;
  onCrossSellVariantsSelect: (variants: VariantVM[]) => void;
  onCrossSellProductsSelect: (product: ProductVM) => void;
  onCrossSellProductsRemove: (product: ProductVM) => void;
}) => {
  const [isProductChecked, setIsProductChecked] = useState<boolean[]>([]);

  const [selectedWoodColor, setSelectedWoodColor] = useState<VariantVM | null>(null);
  const [selectedTabletSize, setSelectedTabletSize] = useState<VariantVM | null>(null);
  const [selectedApparel, setSelectedApparel] = useState<VariantVM | null>(null);

  useEffect(() => {
    const selectedVariants: VariantVM[] = [];
    if (selectedWoodColor) selectedVariants.push(selectedWoodColor);
    if (selectedTabletSize) selectedVariants.push(selectedTabletSize);
    if (selectedApparel) selectedVariants.push(selectedApparel);
    onCrossSellVariantsSelect(selectedVariants);
  }, [selectedWoodColor, selectedTabletSize, selectedApparel]);

  useEffect(() => {
    if (!isProductChecked.length && crossSellProducts?.length) setIsProductChecked(crossSellProducts.map(() => false));
  }, [crossSellProducts]);

  const getProductOptionValuesByAttributeId = (
    attributeId: string,
    product: ProductVM
  ): ProductOptionValueVM[] | undefined =>
    product.options?.find((option) => option.name?.toLowerCase() === attributeId?.toLowerCase())?.values;

  const getVariantsByProduct = (product: ProductVM): VariantVM[] => product.variants;

  const cleanSelections = () => {
    setSelectedWoodColor(null);
    setSelectedTabletSize(null);
    setSelectedApparel(null);
  };

  if (!crossSellProducts) return null;

  return (
    <div>
      {crossSellProducts.map((product, index) => {
        return (
          <div key={product.name}>
            <CheckBox
              visible={!mainCrossSellProductId || product.id === mainCrossSellProductId}
              onCheck={() => {
                if (mainCrossSellProductId) return setIsProductChecked(isProductChecked.map(() => true));
                const newIsProductChecked = [...isProductChecked];
                newIsProductChecked[index] = true;
                setIsProductChecked(newIsProductChecked);
                if (!product?.variants.length) onCrossSellProductsSelect(product);
              }}
              onUnCheck={() => {
                if (mainCrossSellProductId) {
                  onCrossSellVariantsSelect([]);
                  return setIsProductChecked(isProductChecked.map(() => false));
                }
                const newIsProductChecked = [...isProductChecked];
                newIsProductChecked[index] = false;
                setIsProductChecked(newIsProductChecked);
                onCrossSellProductsRemove(product);
                cleanSelections();
              }}
              productName={product.name}
            />
            {isProductChecked[index] && (
              <>
                <WoodColors
                  options={getProductOptionValuesByAttributeId("wood color", product)}
                  onSelect={(variant) => setSelectedWoodColor(variant)}
                  variants={getVariantsByProduct(product)}
                  description={product.description}
                />
                <TabletSize
                  options={getProductOptionValuesByAttributeId("tablet size", product)}
                  onSelect={(variant) => setSelectedTabletSize(variant)}
                  variants={getVariantsByProduct(product)}
                  productName={product.name}
                />
                <Apparel
                  onSelect={(variant) => setSelectedApparel(variant)}
                  sizeOptions={getProductOptionValuesByAttributeId("size", product)}
                  colorOptions={getProductOptionValuesByAttributeId("color", product)}
                  variants={getVariantsByProduct(product)}
                  description={product.description}
                  stockTracking={product.stockTracking}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CrossSellProducts;

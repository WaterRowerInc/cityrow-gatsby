import React from "react";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";
import { BuilderImageModel } from "../../../../components/BuilderImage/BuilderImage.type";
import CTAButton from "../../../../components/CTAButton/CTAButton";
import CustomButton from "../../../../components/CustomButton/CustomButton";
import { ReviewsSummary } from "../../../../core/domain/reviews/ReviewsSummary";
import { isMediumScreenOrSmaller } from "../../../../utils/responsiveUtils";
import { ProductVM, VariantVM } from "../../ProductVM";
import ProductAccordion from "../ProductAccordion";
import ProductCarousel from "../ProductCarousel";
import ProductDescription from "../ProductDescription";
import ProductHeader from "../ProductHeader";
import ProductPrice from "../ProductPrice";
import ProductReviewsInfo from "../ProductReviewsInfo";
import SubscriptionPlanSelectorModal from "../SubscriptionProduct/SubscriptionPlanSelectorModal";
import CrossSellProducts from "./CrossSellProducts/CrossSellProducts";
import "./PhysicalProduct.scss";
import ProductOptions from "./ProductOptions/ProductOptions";

const PhysicalProduct = ({
  cta,
  crossSellProducts,
  onAddToCart,
  isSelectingSubscriptionPlan,
  onClosePlanSelectorModal,
  onCrossSellProductsRemove,
  onCrossSellProductsSelect,
  onCrossSellVariantsSelect,
  onMultipleVariantOptionSelect,
  onOptionSelect,
  onPlanSelect,
  onSelectSubscription,
  product,
  productDetailAccordion,
  reviewsSummary,
  selectedSubscription,
  selectedVariants,
  totalPrice,
  totalPriceWithoutSale,
  addVariant,
  removeVariant,
  title,
  headerImage,
}: {
  cta?: {
    label: string;
    destination: string;
    variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
  };
  crossSellProducts: ProductVM[];
  isSelectingSubscriptionPlan: boolean;
  onClosePlanSelectorModal: () => void;
  onAddToCart: () => void;
  onCrossSellProductsRemove: (product: ProductVM) => void;
  onCrossSellProductsSelect: (product: ProductVM) => void;
  onCrossSellVariantsSelect: (variants: VariantVM[]) => void;
  onMultipleVariantOptionSelect: (variants: VariantVM[]) => void;
  onOptionSelect: (variant: VariantVM, index: number) => void;
  onPlanSelect: (ProductOptionValueVM) => void;
  onSelectSubscription: () => void;
  product: ProductVM | null;
  productDetailAccordion: { header: string; body: any }[];
  reviewsSummary?: ReviewsSummary;
  selectedSubscription: ProductVM | null;
  selectedVariants?: VariantVM[];
  totalPrice: string;
  totalPriceWithoutSale?: string;
  addVariant: () => void;
  removeVariant: (index: number) => void;
  title: string;
  headerImage?: BuilderImageModel;
}) => {
  const canAddToCart =
    !product?.stockTracking ||
    (product.stockTracking && (selectedVariants?.every((v) => v.stock > 0) || product?.canBuyWithoutStock));

  const productOptionValues = product?.options?.flatMap((o) => o.values.map((v) => v.id));
  const availableVariants = product?.variants?.filter((v) => productOptionValues?.includes(v.optionsIds[0]));

  const shouldShowAddButton =
    availableVariants &&
    selectedVariants &&
    availableVariants.length > selectedVariants.length &&
    !product?.hideAddMultiple &&
    !product?.acceptsMultipleVariants;

  return (
    <div className='physicalProduct__container'>
      <section className='physicalProduct__carousel-section'>
        <ProductCarousel
          images={product?.images || []}
          title={product?.name || ""}
          selectedVariant={selectedVariants ? selectedVariants[0] : null}
        />
      </section>
      <section className='physicalProduct__info-section'>
        <div className='physicalProduct__info-container'>
          {headerImage && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <BuilderImage className={`physicalProduct__header-image`} imageModel={headerImage} />
            </div>
          )}
          <ProductHeader header={title || product?.name} />
          <ProductReviewsInfo reviewsInfo={reviewsSummary} />
          <ProductPrice
            price={totalPrice}
            priceWithoutSale={totalPriceWithoutSale}
            hasFinancingDescription={product?.isRower}
          />
          <ProductDescription description={product?.description || ""} />
          {selectedVariants?.map((selectedVariant, index) => (
            <ProductOptions
              removeVariant={() => removeVariant(index)}
              key={index}
              selectedVariant={selectedVariant}
              selectedOptions={selectedVariants.flatMap((v) => v.optionsIds)}
              product={product}
              stock={selectedVariant.stock}
              onOptionSelect={(option) => onOptionSelect(option, index)}
              onMultipleVariantOptionSelect={onMultipleVariantOptionSelect}
            />
          ))}
          {shouldShowAddButton && (
            <CustomButton
              variation='secondary'
              customClass='physicalProduct__add-variation-button'
              text='Add +'
              onClick={addVariant}
            />
          )}
          <CrossSellProducts
            crossSellProducts={crossSellProducts}
            mainCrossSellProductId={product?.mainCrossSellProductId}
            onCrossSellVariantsSelect={onCrossSellVariantsSelect}
            onCrossSellProductsSelect={onCrossSellProductsSelect}
            onCrossSellProductsRemove={onCrossSellProductsRemove}
          />
          {!isMediumScreenOrSmaller() && (
            <div className={"physicalProduct__buttons-container"}>
              <CustomButton
                disabled={!canAddToCart}
                customClass='physicalProduct__add-to-cart-button'
                text={canAddToCart ? "Add to Cart" : "Out of Stock"}
                onClick={product?.hasSubscriptionPackage ? onSelectSubscription : onAddToCart}
              />
            </div>
          )}
          <div className='physicalProduct__accordion__container'>
            <ProductAccordion details={productDetailAccordion} />
            {cta?.label && isMediumScreenOrSmaller() && (
              <CTAButton
                customClass='physicalProduct__cta'
                goTo={cta.destination}
                text={cta.label}
                variation='secondary'
              />
            )}
          </div>
        </div>
      </section>
      {isMediumScreenOrSmaller() && (
        <section className='physicalProduct__add-to-cart-section'>
          <CustomButton
            disabled={!canAddToCart}
            customClass='physicalProduct__add-to-cart-button'
            text={canAddToCart ? "Add to Cart" : "Out of Stock"}
            onClick={product?.hasSubscriptionPackage ? onSelectSubscription : onAddToCart}
          />
        </section>
      )}
      <SubscriptionPlanSelectorModal
        isVisible={isSelectingSubscriptionPlan}
        subscription={selectedSubscription}
        onAddToCart={onPlanSelect}
        onClose={onClosePlanSelectorModal}
      />
    </div>
  );
};

export default PhysicalProduct;

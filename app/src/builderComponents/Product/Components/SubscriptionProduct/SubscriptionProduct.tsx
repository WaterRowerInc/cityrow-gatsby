import React from "react";
import ProductCarousel from "../ProductCarousel";
import ProductAccordion from "../ProductAccordion";
import { ProductVM } from "../../ProductVM";
import ProductHeader from "../ProductHeader";
import SubscriptionDetails from "./SubscriptionDetails";
import "./SubscriptionProduct.scss";
import SubscriptionPlanSelectorModal from "./SubscriptionPlanSelectorModal";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";
import { BuilderImageModel } from "../../../../components/BuilderImage/BuilderImage.type";

const SubscriptionProduct = ({
  isSelectingSubscriptionPlan,
  isUserLoggedIn,
  onAddToCart,
  onSelectSubscription,
  onClosePlanSelectorModal,
  product,
  productDetailAccordion,
  selectedSubscription,
  subscriptionProducts,
  title,
  headerImage,
  subscriptionCta,
  subscriptionLoggedCta,
}: {
  isSelectingSubscriptionPlan: boolean;
  isUserLoggedIn: boolean;
  onAddToCart: (ProductOptionValueVM) => void;
  onSelectSubscription: (subscription: ProductVM) => void;
  onClosePlanSelectorModal: () => void;
  product: ProductVM | null;
  productDetailAccordion: { header: string; body: any }[];
  selectedSubscription: ProductVM | null;
  subscriptionProducts: ProductVM[];
  subscriptionCta?: string;
  subscriptionLoggedCta?: string;
  title: string;
  headerImage?: BuilderImageModel;
}) => (
  <div className='subscriptionProduct__container'>
    <section className='subscriptionProduct__carouselSection'>
      <ProductCarousel images={product?.images || []} title={product?.name || ""} />
    </section>
    <section className='subscriptionProduct__infoSection'>
      {headerImage && <BuilderImage className={`physicalProduct__header-image`} imageModel={headerImage} />}
      <ProductHeader header={title || product?.name} />
      <SubscriptionDetails
        isUserLoggedIn={isUserLoggedIn}
        description={product?.description}
        subscriptionProducts={subscriptionProducts}
        onSelectSubscription={onSelectSubscription}
        subscriptionLoggedCta={subscriptionLoggedCta}
        subscriptionCta={subscriptionCta}
      />
      <div className='subscriptionProduct__accordion__container'>
        <ProductAccordion details={productDetailAccordion} />
      </div>
    </section>
    <SubscriptionPlanSelectorModal
      isVisible={isSelectingSubscriptionPlan}
      subscription={selectedSubscription}
      onAddToCart={onAddToCart}
      onClose={onClosePlanSelectorModal}
    />
  </div>
);

export default SubscriptionProduct;

import DeliveryOptionsSelector from "./DeliveryOptionsSelector";
import React from "react";
import Loader from "../../Loader/Loader";
const DeliveryForm = ({
  isLoading,
  onSelectShippingOption,
  shippingOptions,
}: {
  isLoading: boolean;
  onSelectShippingOption: (deliveryOption: string) => void;
  shippingOptions: any;
}) => {
  return (
    <div className='delivery-section'>
      <Loader visible={isLoading} isFullScreen={false} />
      {shippingOptions.length > 0 ? (
        <>
          <h1 className='checkout-page__container__flow-container__medium-title'>Rower Delivery</h1>
          <DeliveryOptionsSelector
            isJustInfo={false}
            defaultValue={shippingOptions?.[0]?.id}
            shippingOptions={shippingOptions}
            onSelect={onSelectShippingOption}
          />
        </>
      ) : (
        <>
          <h1 className='checkout-page__container__flow-container__medium-title checkout-page__container__flow-container__accessories-title'>
            Accessories Delivery
          </h1>
          <h2 className='checkout-page__container__flow-container__small-title'>Parcel Shipping</h2>
          <p className='checkout-page__container__flow-container__estimated-delivery-text'>
            Estimated delivery: 1-2 weeks
          </p>
          <p className='checkout-page__container__flow-container__shipping-info-text'>
            Your accessories will arrive via parcel ground shipping.
          </p>
        </>
      )}
    </div>
  );
};

export default DeliveryForm;

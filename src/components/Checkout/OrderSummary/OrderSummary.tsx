// noinspection XHTMLIncompatabilitiesJS

import cartMobileExpand from "../../../assets/images/cartMobileExpand.png";
import cartMobileCollapse from "../../../assets/images/cartMobileCollapse.png";
import CheckoutCopyText from "../CheckoutCopyText";
import CartDetails from "../../CartDetails/CartDetails";
import React from "react";
import CustomButton from "../../CustomButton/CustomButton";

const OrderSummary = ({
  checkout,
  isKlarnaPayment,
  isLegalCopyVisible,
  isSticky,
  checkoutButtonText,
  totalPrice,
  positionFromTop,
}: {
  checkout: any;
  isKlarnaPayment: boolean;
  isLegalCopyVisible: boolean;
  isSticky: boolean;
  checkoutButtonText: string;
  positionFromTop?: number;
  totalPrice: string;
}) => {
  const [isMobileSummaryHidden, setIsMobileSummaryHidden] = React.useState(true);
  const toggleMobileSummary = () => setIsMobileSummaryHidden(!isMobileSummaryHidden);
  const isDocumentDefined = () => typeof document !== "undefined";
  if (isMobileSummaryHidden) {
    isDocumentDefined() && (document.body.style.overflow = "auto");
  } else {
    isDocumentDefined() && (document.body.style.overflow = "hidden");
  }
  return (
    <>
      <div
        className={`checkout-page__container__mobile-mini-box__
        ${isMobileSummaryHidden ? "d-md-block" : "d-md-none"}`}
      >
        <div className={"checkout-page__container__mobile-mini-box__title-container__"}>
          <div className={"checkout-page__container__mobile-mini-box__title-container__text-container__"}>
            <h3 className={"checkout-page__container__mobile-mini-box__title-container__text-container__total-text"}>
              {"Total - "}
              <span className={"checkout-page__container__mobile-mini-box__title-container__text-container__amount"}>
                {totalPrice}
              </span>
            </h3>
          </div>
          <img
            src={isMobileSummaryHidden ? cartMobileExpand : cartMobileCollapse}
            alt={"arrow"}
            className={"checkout-page__container__mobile-mini-box__caret"}
            onClick={toggleMobileSummary}
          />
        </div>
        <div className={"checkout-page__container__mobile-mini-box__divider-line"}>{"."}</div>
        {isLegalCopyVisible && <CheckoutCopyText />}
        <CustomButton
          text={checkoutButtonText}
          customClass={"checkout-page__container__mobile-mini-box__cta"}
          onClick={checkout}
        />
      </div>
      <div
        id='checkout-summary-desktop'
        className={`checkout-page__container__summary-container__ ${
          isSticky ? "order-summary-sticky" : "order-summary-normal"
        }`}
        style={{
          top: positionFromTop ? -positionFromTop : 0,
        }}
      >
        <img
          src={isMobileSummaryHidden ? cartMobileExpand : cartMobileCollapse}
          alt={"arrow"}
          className={"checkout-page__caret"}
          onClick={toggleMobileSummary}
        />
        <h1 className={"checkout-page__container__summary-container__title"}>{"Order Summary"}</h1>
        <div className={"checkout-page__container__summary-container__divider-line"}>{"."}</div>
        <CartDetails isKlarnaPayment={isKlarnaPayment} />
        {isLegalCopyVisible && <CheckoutCopyText />}
        <CustomButton
          text={checkoutButtonText}
          customClass={"checkout-page__container__summary-container__cta"}
          onClick={checkout}
        />
      </div>
      <div
        id='checkout-summary-mobile'
        className={`checkout-page__container__summary-container__
            ${isMobileSummaryHidden ? "d-none" : "d-md-block"}`}
        style={{
          top: 0,
        }}
      >
        <img
          src={isMobileSummaryHidden ? cartMobileExpand : cartMobileCollapse}
          alt={"arrow"}
          className={"checkout-page__caret"}
          onClick={toggleMobileSummary}
        />
        <h1 className={"checkout-page__container__summary-container__title"}>{"Order Summary"}</h1>
        <div className={"checkout-page__container__summary-container__divider-line"}>{"."}</div>
        <CartDetails isKlarnaPayment={isKlarnaPayment} />
        {isLegalCopyVisible && <CheckoutCopyText />}
        <CustomButton
          text={checkoutButtonText}
          customClass={"checkout-page__container__summary-container__cta"}
          onClick={checkout}
        />
      </div>
    </>
  );
};

export default OrderSummary;

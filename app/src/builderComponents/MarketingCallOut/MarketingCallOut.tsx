import * as React from "react";
import "./MarketingCallOut.scss";
import CTAButton from "components/CTAButton/CTAButton";

const MarketingCallOut = ({ header, body, cta }: MarketingCallOutProps) => {
  return (
    <div className='marketing-call-out__container'>
      <div className='marketing-call-out__inner-container'>
        <div className='marketing-call-out__text__container'>
          {header && <h4 className='marketing-call-out__text__title'>{header}</h4>}
          <p className='marketing-call-out__text__description'>{body}</p>
        </div>
        {cta?.label && (
          <div className='marketing-call-out__cta_link_container'>
            <CTAButton
              goTo={cta?.destination}
              className='marketing-call-out__cta_link'
              customClass='square-button__wrapper-padding'
              external={cta?.external}
              text={cta?.label}
              variation={cta?.variation}
            />
          </div>
        )}
      </div>
    </div>
  );
};
interface MarketingCallOutProps {
  header: string;
  body: string;
  cta: {
    label: string;
    destination: string;
    variation: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
    external: boolean;
  };
}

export default MarketingCallOut;

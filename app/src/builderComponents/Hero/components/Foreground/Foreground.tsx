import React from "react";
import "./ForegroundStyle.scss";
import CTAButton from "../../../../components/CTAButton/CTAButton";
import CTAImage from "../../../../components/CTAImage/CTAImage";

const Foreground = ({
  alignment,
  body,
  cta,
  subTitle,
  title,
}: {
  alignment: string;
  body: string;
  cta?: {
    destination: string;
    label: string;
    isExternal: boolean;
    image?: string;
  }[];
  subTitle: string;
  title: string;
}) => {
  return (
    <div className={`hero-foreground__container hero-foreground__${alignment || "left"}`}>
      <h1 className='hero-foreground__title'>{title}</h1>
      <h4 className='hero-foreground__sub-title'>{subTitle}</h4>
      <h4 className='hero-foreground__body'>{body}</h4>
      {cta && cta.map.length && (
        <div
          className='hero-foreground__buttons-container'
          style={{ justifyContent: cta.length > 1 ? "space-between" : "center" }}
        >
          {cta.map(({ destination, label, isExternal, image }, i) =>
            image ? (
              <CTAImage
                key={i}
                goTo={destination}
                customClass={"hero-foreground__cta-image"}
                text={label?.toUpperCase()}
                image={image}
                external={isExternal}
              />
            ) : (
              <CTAButton
                key={i}
                goTo={destination}
                customClass={"hero-foreground__cta-button"}
                text={label?.toUpperCase()}
                external={isExternal}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Foreground;

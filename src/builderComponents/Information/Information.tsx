import clsx from "classnames";
import CTAButton from "components/CTAButton/CTAButton";
import * as React from "react";
import BuilderImage from "../../components/BuilderImage/BuilderImage";
import { BuilderImageModel } from "../../components/BuilderImage/BuilderImage.type";
import "./Information.scss";

const Information = ({ header, body, color, imageModel, cta, horizontalLine, imageSize }: InformationProps) => {
  const isDarkMode = color === "Dark";
  return (
    <div className={clsx("information__container", { "information__container--dark": isDarkMode })}>
      {header && <h4 className={clsx("information__title", { "information__title--dark": isDarkMode })}>{header}</h4>}
      <div className='information__container_description'>
        {horizontalLine && <div className={clsx("information__line", { "information__line--dark": isDarkMode })} />}
        <p className={clsx("information__description", { "information__description--dark": isDarkMode })}>{body}</p>
      </div>
      {imageModel && (
        <BuilderImage
          imageModel={imageModel}
          className={clsx(
            "information__img_content",
            { "information__img_content--medium": imageSize === "Medium" },
            { "information__img_content--large": imageSize === "Large" }
          )}
        />
      )}
      {cta?.label && (
        <div className='information__cta_link_container'>
          <CTAButton
            goTo={cta.destination}
            className='information__cta_link'
            customClass='square-button__wrapper-padding'
            text={cta.label}
            variation={isDarkMode ? "secondaryWhite" : "primary"}
          />
        </div>
      )}
    </div>
  );
};

interface InformationProps {
  header: string;
  body: string;
  color: "Light" | "Dark";
  imageModel?: BuilderImageModel;
  imageSize: "Small" | "Medium" | "Large";
  cta: {
    label: string;
    destination: string;
  };
  horizontalLine: boolean;
}

export default Information;

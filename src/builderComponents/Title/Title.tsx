import clsx from "classnames";
import CTAButton from "components/CTAButton/CTAButton";
import * as React from "react";
import BuilderImage from "../../components/BuilderImage/BuilderImage";
import { BuilderImageModel } from "../../components/BuilderImage/BuilderImage.type";
import "./Title.scss";

const Title = ({ header, body, color, imageModel, cta, imageSize }: Props) => {
  const isDarkMode = color === "Dark";
  return (
    <div className={clsx("title__container", { "title__container--dark": isDarkMode })}>
      <div className='title__inner-container'>
        <div className='title__text-container'>
          {header && <h4 className={clsx("title__title", { "title__title--dark": isDarkMode })}>{header}</h4>}
          <p className={clsx("title__description", { "title__description--dark": isDarkMode })}>{body}</p>
        </div>
        {imageModel?.image && (
          <BuilderImage
            imageModel={imageModel}
            className={clsx(
              "title__img_content",
              { "title__img_content--medium": imageSize === "Medium" },
              { "title__img_content--large": imageSize === "Large" }
            )}
          />
        )}
        {cta?.label && (
          <div className='title__cta_link_container'>
            <CTAButton
              goTo={cta?.destination}
              className='title__cta_link'
              customClass='square-button__wrapper-padding'
              text={cta?.label}
              variation={isDarkMode ? "secondaryWhite" : "primary"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
interface Props {
  header: string;
  body: string;
  color: "Light" | "Dark";
  imageModel?: BuilderImageModel;
  imageSize: "Small" | "Medium" | "Large";
  cta: {
    label: string;
    destination: string;
  };
}

export default Title;

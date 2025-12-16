/*eslint-disable @typescript-eslint/type-annotation-spacing*/
import * as React from "react";
import clsx from "classnames";
import "./FeatureBanner.scss";
import { FeatureBannerType } from "./FeatureBanner.type";
import { FeatureBannerItemType } from "./FeatureBannerItem/FeatureBannerItemType";
import BuilderImage from "../../components/BuilderImage/BuilderImage";

const FeaturesList = ({ title, description, features, theme }: FeatureBannerType) => {
  return (
    <div
      className={clsx(`feature-banner__container`, {
        "feature-banner__container--dark_mode": theme === "Dark",
        "feature-banner__container--medium_mode": theme === "Medium",
      })}
    >
      {title && (
        <>
          <h2 className={"feature-banner__header-title"}>{title}</h2>
          <div className={"feature-banner__title-border"}>{"."}</div>
          {description && <p className={"feature-banner__description"}>{description}</p>}
        </>
      )}
      <div className={"feature-banner__items-box__"}>
        {features &&
          features.slice(0, 4).map((feature: FeatureBannerItemType, index: number) => (
            <div key={`features-${index}`} className={"feature-banner__items-box__item__"}>
              {feature?.icon && (
                <BuilderImage
                  imageModel={{ title: `${index}-${feature.icon}`, image: feature.icon }}
                  className={"feature-banner__items-box__item__icon"}
                />
              )}
              <h4 className={"feature-banner__items-box__item__title"}>{feature.header}</h4>
              <p className={"feature-banner__items-box__item__text"}>{feature.body}</p>
              {feature?.linkText && (
                <a href={feature?.linkUrl} rel={"origin"} className={"feature-banner__items-box__item__link"}>
                  {feature?.linkText}
                </a>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FeaturesList;

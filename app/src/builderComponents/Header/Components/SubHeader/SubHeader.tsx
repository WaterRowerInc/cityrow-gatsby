import React, { useState } from "react";
import clsx from "classnames";
import CTAButton from "components/CTAButton/CTAButton";
import "./SubHeader.scss";
import SubHeaderButton from "./SubHeaderButton";
import arrow from "../../../../assets/images/accordionArrow.png";
import { BuilderPageNavCta, BuilderPageNavOption } from "../../Menu";

const SubHeader = ({
  text,
  options,
  localizationCode,
  isHomePath,
  cta,
}: {
  text: string;
  options: BuilderPageNavOption[];
  localizationCode: string;
  isHomePath: boolean;
  cta: BuilderPageNavCta;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const RenderSubMenuItems = ({ expanded = false }: RenderSubMenuItemsProp) => (
    <div
      className={clsx("sub-head__container__items-box", {
        "sub-head__container__no-cta-box": !cta?.label.trim(),
        "sub-head__container__items-box--expanded": expanded,
      })}
      onClick={() => setIsExpanded(false)}
    >
      {options?.length &&
        options.map((item: BuilderPageNavOption, index: number) => (
          <SubHeaderButton
            isExternal={item.isExternal}
            path={item.path}
            name={item.name}
            localizationCode={localizationCode}
            key={`sub-top_menu-${index}`}
            fullWidth={expanded}
          />
        ))}
      {!expanded && cta?.label.trim() && <CTAButton text={cta?.label} goTo={cta?.destination} />}
    </div>
  );
  return (
    <>
      <div className='sub-head__container__'>
        <p
          className={clsx("sub-head__current-path", {
            sub_header__msg: isHomePath,
          })}
        >
          {text}
        </p>
        <RenderSubMenuItems />
        <div onClick={() => setIsExpanded((_isExpanded) => !_isExpanded)} className='sub-head__arrow-container'>
          <img
            className={clsx("sub-head__arrow", {
              "sub-head__arrow--expanded": isExpanded,
            })}
            alt='arrow'
            src={arrow}
          />
        </div>
      </div>
      <div className='sub-head__container__items-box--hidden'>
        <RenderSubMenuItems expanded={isExpanded} />
      </div>
    </>
  );
};

interface RenderSubMenuItemsProp {
  expanded?: boolean;
}

export default SubHeader;

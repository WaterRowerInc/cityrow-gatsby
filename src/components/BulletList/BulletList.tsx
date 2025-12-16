import * as React from "react";
import checkMark from "assets/images/checkmark.png";
import checkMarkWhite from "assets/images/checkmark_white.png";
import clsx from "classnames";
import "./BulletList.scss";

interface IBulletList {
  options?: object[];
  alt?: boolean;
  labelKey?: string;
}

function BulletList({ options, alt, labelKey = "text" }: IBulletList) {
  return (
    <div className='bullet-list__containers'>
      {options?.map((option, index) => {
        return (
          <div
            key={`app-options-${index}`}
            className={clsx("bullet-list__option", { "bullet-list__option--alt": alt })}
          >
            <img
              src={alt ? checkMarkWhite : checkMark}
              alt='check-mark'
              className={clsx("bullet-list__option_check_marks", {
                "bullet-list__option_check_marks--alt": alt,
              })}
            />
            <p
              className={clsx("bullet-list__option_description", {
                "bullet-list__option_description--alt": alt,
              })}
            >
              {option[labelKey]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default BulletList;

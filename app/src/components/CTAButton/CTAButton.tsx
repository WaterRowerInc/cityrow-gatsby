import React from "react";
import CustomButton from "components/CustomButton/CustomButton";
import "./CTAButton.scss";
import CTA from "../CTA/CTA";

function CTAButton({
  className,
  customClass,
  disabled,
  external,
  goTo,
  onClick,
  text,
  variation = "primary",
}: CTAButtonPropsType) {
  return (
    <CTA external={external} goTo={goTo} onClick={onClick} text={text} disabled={disabled} className={className}>
      <CustomButton text={text} variation={variation} disabled={disabled} customClass={customClass} />
    </CTA>
  );
}

interface CTAButtonPropsType {
  className?: string;
  customClass?: string;
  disabled?: boolean;
  external?: boolean;
  goTo: string;
  onClick?: () => void;
  text: string;
  variation?: "primary" | "secondary" | "secondaryWhite" | "link" | "linkInverse";
}

export default CTAButton;

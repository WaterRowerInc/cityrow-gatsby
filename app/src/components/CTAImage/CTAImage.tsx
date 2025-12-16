import React from "react";
import "./CTAImage.scss";
import CTA from "../CTA/CTA";

function CTAImage({ className, customClass, disabled, external, goTo, image, onClick, text }: CTAImagePropsType) {
  return (
    <CTA external={external} goTo={goTo} onClick={onClick} text={text} disabled={disabled} className={className}>
      <img alt={text} src={image} className={customClass} />
    </CTA>
  );
}

interface CTAImagePropsType {
  className?: string;
  customClass?: string;
  disabled?: boolean;
  external?: boolean;
  goTo: string;
  image: string;
  onClick?: () => void;
  text: string;
}

export default CTAImage;

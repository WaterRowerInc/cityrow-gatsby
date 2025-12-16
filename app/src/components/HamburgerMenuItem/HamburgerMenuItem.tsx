import React from "react";
import hamburger from "assets/images/hamburger.png";

export default function HamburgerMenuItem({ onHamburgerClick }: HamburgerMenuItemProps) {
  return <img width={32} height={32} src={hamburger} alt={"menu"} onClick={onHamburgerClick} />;
}

interface HamburgerMenuItemProps {
  onHamburgerClick: () => void;
}

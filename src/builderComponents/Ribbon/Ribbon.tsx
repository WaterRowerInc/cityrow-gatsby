import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import "./Ribbon.scss";

export default function Ribbon({
  primaryInfo,
  secondaryInfo,
  isExternalLink,
  linkText,
  destination,
}: {
  primaryInfo: string;
  secondaryInfo: string;
  isExternalLink: boolean;
  linkText: string;
  destination: string;
}) {
  const [ribbonVisible, setRibbonVisible] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", handleRibbonVisibility);

    return () => {
      window.removeEventListener("scroll", handleRibbonVisibility);
      const header = getHeaderElement();
      if (header) header.className = "header__container";
    };
  }, []);

  useEffect(() => {
    const header = getHeaderElement();
    if (header)
      header.className = ribbonVisible ? "header__container header__container--with-ribbon" : "header__container";
  }, [ribbonVisible]);

  const getHeaderElement = () => {
    const elements = document.getElementsByClassName("header__container");
    return elements.length > 0 ? elements[0] : null;
  };

  const handleRibbonVisibility = () => {
    if (window.scrollY > window.innerHeight) setRibbonVisible(false);
    else if (window.scrollY < window.innerHeight - 50) setRibbonVisible(true);
  };

  return (
    <div className={`ribbon__container__ ${!ribbonVisible ? "ribbon__container__hidden" : ""}`}>
      <h4 className='ribbon__container__primary-text'>
        {primaryInfo}
        <span className='ribbon__container__secondary-text'>{secondaryInfo}</span>
        {isExternalLink ? (
          <a href={destination} target={"_blank"} title={linkText} rel={"noreferrer"}>
            {linkText}
          </a>
        ) : (
          <Link to={destination} title={linkText}>
            {linkText}
          </Link>
        )}
      </h4>
    </div>
  );
}

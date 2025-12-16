import React, { CSSProperties } from "react";
import "./Overlay.scss";

const Overlay = ({
  children,
  isFullScreen = true,
  isVisible = true,
  onClick,
  style,
}: {
  children?: any;
  isFullScreen?: boolean;
  isVisible?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) => {
  if (!isVisible) return null;
  return (
    <div
      className={`overlay__container ${!isFullScreen && "overlay__container--not-full-screen"}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Overlay;

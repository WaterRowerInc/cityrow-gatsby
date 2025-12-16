import React from "react";
import { CircularProgress } from "@material-ui/core";
import Overlay from "../Overlay/Overlay";

const Loader = ({ visible = true, isFullScreen = true }: { visible?: boolean; isFullScreen?: boolean }) => {
  if (!visible) return null;
  return (
    <Overlay isFullScreen={isFullScreen}>
      <CircularProgress />
    </Overlay>
  );
};

export default Loader;

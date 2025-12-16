/*eslint-disable  @typescript-eslint/type-annotation-spacing*/
import * as React from "react";
import clsx from "classnames";
import "./ImageFrameDynamicWidth.scss";
import { IImageFrameDynamic } from "./ImageFrameDynamicWidth.type";
import BuilderBackgroundImage from "../BuilderImage/BuilderBackgroundImage";

function ImageFrameDynamicWidth({ children, side, imageModel }: IImageFrameDynamic) {
  const imageAnchoring = React.useMemo(() => {
    let side = "";
    if (imageModel?.areaFocus === "Left") {
      side = "--left";
    } else if (imageModel?.areaFocus === "Right") {
      side = "--right";
    }
    return side;
  }, [imageModel?.areaFocus]);

  const imageRightSide: boolean = side === "Left";

  return (
    <div
      className={clsx({
        image_frame_dynamic_width__container: !imageRightSide,
        "image_frame_dynamic_width__container--reverse": imageRightSide,
      })}
    >
      <BuilderBackgroundImage
        className={clsx(
          "image_frame_dynamic_width__section",
          { "image_frame_dynamic_width__section--left": imageAnchoring === "--left" },
          { "image_frame_dynamic_width__section--right": imageAnchoring === "--right" }
        )}
        imageModel={imageModel}
      />
      {children ? (
        <div
          className={clsx(
            "image_frame_dynamic__child_section",
            { "image_frame_dynamic__child_section--left": imageAnchoring === "--left" },
            { "image_frame_dynamic__child_section--right": imageAnchoring === "--right" }
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default ImageFrameDynamicWidth;

import * as React from "react";
import clsx from "classnames";
import { IImageFrame } from "./ImageFrameFixWidth.type";
import "./ImageFrameFixWidth.scss";
import BuilderImage from "../BuilderImage/BuilderImage";

function ImageFrameFixWidth({ side, imageModel, children }: IImageFrame) {
  const left: boolean = side === "Left";
  return (
    <div className='img_frame_fix_width__container'>
      <div
        className={clsx("img_frame_fix_width__inner-container", {
          "img_frame_fix_width__inner-container--reverse": left,
        })}
      >
        <div className={clsx("img_frame_fix_width__first", { "img_frame_fix_width__first--reverse": left })}>
          <div>{children}</div>
        </div>
        <div
          className={clsx("img_frame_fix_width__second", {
            "img_frame_fix_width__second--reverse": left,
          })}
        >
          <BuilderImage imageModel={imageModel} className='img_frame_fix_width__second-image' />
        </div>
      </div>
    </div>
  );
}

export default ImageFrameFixWidth;

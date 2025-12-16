import React from "react";
import "./PressSlide.scss";

const PressSlide = ({ comment }: { comment: string }) => {
  return (
    <div className='pressSlide__container'>
      <p className='pressSlide__comment'>{comment}</p>
    </div>
  );
};

export default PressSlide;

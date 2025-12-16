/*eslint-disable @typescript-eslint/type-annotation-spacing*/
import * as React from "react";
import clsx from "classnames";
import { IGridCollection, Tentry } from "./GridCollection.type";
import "./GridCollectionStyle.scss";
import BuilderImage from "../../components/BuilderImage/BuilderImage";
import BuilderBackgroundImage from "../../components/BuilderImage/BuilderBackgroundImage";

function GridCollection(props: Partial<IGridCollection>) {
  const isEven = props.imageStartSide === "Right";
  return (
    <div className='grid_collection__container'>
      {props.imagesAndText?.map((elem: Tentry, index: number) => (
        <div
          key={`grid-col-${index}`}
          className={clsx("grid_collection__element", {
            "grid_collection__element--even": isEven ? index % 2 === 0 : index % 2 !== 0,
          })}
        >
          <BuilderBackgroundImage className={`grid_collection__element_img`} imageModel={elem.imageModel} />
          <div className='grid_collection__content_container'>
            <div className='grid_collection__inner_content_container'>
              {elem.title ? (
                <h2 className='grid_collection__inner_content_container__header'>{elem.title.trim()}</h2>
              ) : null}
              <p className='grid_collection__inner_content_container__description'>{elem.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GridCollection;

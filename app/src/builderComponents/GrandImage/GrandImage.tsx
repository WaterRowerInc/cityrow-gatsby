import * as React from "react";
import clsx from "classnames";
import BulletList from "components/BulletList/BulletList";
import RowButtons from "components/RowButtons/RowButtons";
import "./GrandImage.scss";
import BuilderBackgroundImage from "../../components/BuilderImage/BuilderBackgroundImage";
import { BuilderImageModel } from "../../components/BuilderImage/BuilderImage.type";

const GrandImage = ({
  introText,
  header,
  body,
  containerPosition,
  productBullets,
  ctas,
  imageModel,
}: Partial<GrandImageProps>) => {
  return (
    <div className='grand-image__wrapper__'>
      <BuilderBackgroundImage
        className='grand-image__wrapper__img'
        imageModel={imageModel!}
      />
      <div
        className={clsx("grand-image__wrapper__text-container__", {
          "grand-image__wrapper__text-container__reverse": containerPosition === "Right",
        })}
      >
        <div className='grand-image__wrapper__text-container__text grand-image__wrapper__text-container__text__intro'>
          {introText}
        </div>
        <div className='grand-image__wrapper__text-container__text grand-image__wrapper__text-container__text__title'>
          {header}
        </div>
        <div className='grand-image__wrapper__text-container__text grand-image__wrapper__text-container__text__description'>
          {body}
        </div>
        {productBullets?.length ? <BulletList alt options={productBullets} /> : null}
        {ctas?.length ? <RowButtons ctas={ctas} /> : null}
      </div>
    </div>
  );
};

type ProductBulletType = {
  text: string;
};

interface GrandImageProps {
  introText: string;
  header: string;
  body: string;
  containerPosition: "Left" | "Right";
  imageModel: BuilderImageModel;
  ctas: {
    label: string;
    destination: string;
    variation: string;
    external: boolean;
  }[];
  productBullets: ProductBulletType[];
}

export default GrandImage;

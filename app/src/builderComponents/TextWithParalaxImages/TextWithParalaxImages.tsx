import React, { useEffect, useState } from "react";
import "./TextWithParalaxImages.scss";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const TextWithParalaxImages = ({
  subtitle,
  title,
  body,
  items,
  image1,
  image2,
  image3,
  image4,
}: {
  subtitle?: string;
  title: string;
  body: string;
  items: ParallaxItem[];
  image1: string;
  image2: string;
  image3?: string;
  image4?: string;
}) => {
  const [layoutNumber, setLayoutNumber] = useState(2);

  useEffect(() => {
    if (image3 && image4) return setLayoutNumber(4);
    if (image3 || image4) return setLayoutNumber(3);
    setLayoutNumber(2);
  }, [image3, image4]);

  return (
    <ParallaxProvider>
      <div className='main-container'>
        <div className='text-with-paralax-images__container__'>
          <div className='text-with-paralax-images__container__info-container__'>
            {subtitle && <span className='text-with-paralax-images__container__info-container__subtitle'>{subtitle}</span>}
            <h4 className='text-with-paralax-images__container__info-container__title'>{title}</h4>
            <p className='text-with-paralax-images__container__info-container__body'>{body}</p>
            {items && (
              <div className='text-with-paralax-images__container__info-container__items-container__'>
                {items.map((item: ParallaxItem, key: number) => (
                  <div
                    key={`par-it-${key}`}
                    className='text-with-paralax-images__container__info-container__items-container__item__'
                  >
                    <img
                      src={item.icon}
                      alt='icon'
                      className='text-with-paralax-images__container__info-container__items-container__item__icon'
                    />
                    <div className='text-with-paralax-images__container__info-container__items-container__item__text-container'>
                      <span className='text-with-paralax-images__container__info-container__items-container__item__text-container__title'>
                        {item.title}
                      </span>
                      <p className='text-with-paralax-images__container__info-container__items-container__item__text-container__body'>
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='text-with-paralax-images__container__images-container__'>
            <Parallax speed={10}>
              <img
                src={image1}
                alt='image1'
                className={`text-with-paralax-images__container__images-container__image1-${layoutNumber}`}
              />
            </Parallax>
            <Parallax speed={15}>
              <img
                src={image2}
                alt='image2'
                className={`text-with-paralax-images__container__images-container__image2-${layoutNumber}`}
              />
            </Parallax>
            {image3 && (
              <Parallax speed={20}>
                <img
                  src={image3}
                  alt='image3'
                  className={`text-with-paralax-images__container__images-container__image3-${layoutNumber}`}
                />
              </Parallax>
            )}
            {image4 && (
              <Parallax speed={20}>
                <img
                  src={image4}
                  alt='image4'
                  className={`text-with-paralax-images__container__images-container__image4-${layoutNumber}`}
                />
              </Parallax>
            )}
          </div>
        </div>
      </div>
    </ParallaxProvider>
  );
};
export interface ParallaxItem {
  icon: string;
  title: string;
  body: string;
}

export default TextWithParalaxImages;

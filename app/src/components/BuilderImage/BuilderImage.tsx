import React, { useMemo, useRef } from "react";
import "./BuilderImage.scss";

export default function BuilderImage({
  imageModel,
  className,
}: {
  imageModel: { title: string; image: string; position?: string };
  className?: string;
}) {
  const imgRef = useRef(null);
  const imgWidth = useMemo(() => {
    if (!imgRef.current) return 0;
    const { clientWidth, clientHeight } = imgRef.current!;
    const size = clientWidth > clientHeight ? clientWidth : clientHeight;
    return Math.floor(size * 3);
  }, [imgRef.current]);
  return (
    <picture>
      <source srcSet={`${imageModel?.image}?format=webp&width=${imgWidth}`} type='image/webp' />
      <img
        ref={imgRef}
        src={`${imageModel?.image}?width=${imgWidth}`}
        className={`${className} builder-image__img--${imageModel?.position?.toLowerCase()}`}
        alt={imageModel?.title}
      />
    </picture>
  );
}

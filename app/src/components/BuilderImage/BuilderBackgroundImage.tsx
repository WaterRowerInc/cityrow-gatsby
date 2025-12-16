import React from "react";
import "./BuilderImage.scss";

export default function BuilderBackgroundImage({
  imageModel,
  contain,
  className,
  children,
}: {
  imageModel: { title: string; image: string; position?: string };
  contain?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={className}
      {...(imageModel?.image && {
        style: {
          backgroundImage: `url(${imageModel?.image}?format=webp`,
          backgroundSize: contain ? "contain" : "cover",
          backgroundPosition: imageModel?.position,
          backgroundRepeat: "no-repeat",
        },
      })}
    >
      {children}
    </div>
  );
}

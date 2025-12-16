import React from "react";

const CarouselImage = ({ imageUrl, children, contain }: { contain?: boolean; imageUrl: string; children?: any }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: contain ? "contain" : "cover",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default CarouselImage;

import React from "react";
import clsx from "classnames";
import "./Team.scss";
import { TeamType } from "./TeamType";
import BuilderImage from "../../../../components/BuilderImage/BuilderImage";

function TeamItem({ item }: { item: TeamType }) {
  return (
    <div className='team-carousel__content'>
      <div className='team-carousel__content__class-frame'>
        <BuilderImage
          className={`team-carousel__content__class-frame__image-section ${
            item.theme === "White" ? "team-carousel__content__class-frame__image-section--no-shadow" : "a"
          }`}
          imageModel={item?.imageModel}
        />
        <p
          className={clsx("team-carousel__content__class-frame__title-section", {
            "team-carousel__content__class-frame__title-section--light":
              item.theme === "White" || item.theme === "Blue",
          })}
        >
          {item.name}
        </p>
        <div
          className={clsx("team-carousel__content__class-frame__instagram-section", {
            "team-carousel__content__class-frame__instagram-section--light":
              item.theme === "White" || item.theme === "Blue",
          })}
        >
          <a href={`https://www.instagram.com/${item.instagram.slice(1)}/`}>{item.instagram}</a>
        </div>
      </div>
    </div>
  );
}

export default TeamItem;

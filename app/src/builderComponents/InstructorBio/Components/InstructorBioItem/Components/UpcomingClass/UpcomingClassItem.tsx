import React from "react";
import "./UpcomingClass.scss";
import { UpcomingClassType } from "./UpcomingClassType";

function UpcomingClassItem({ item }: { item: UpcomingClassType }) {
  return (
    <div className={"upcoming-class__container__"}>
      <div className={"upcoming-class__container__left-box__"}>
        <h4 className={"upcoming-class__container__left-box__day"}>{item.day?.slice(0, 3)}</h4>
        <h4 className={"upcoming-class__container__left-box__date"}>{item.date}</h4>
      </div>
      <div className={"upcoming-class__container__right-box__"}>
        <h4 className={"upcoming-class__container__right-box__name"}>{item.name}</h4>
        <div className={"upcoming-class__container__right-box__row__"}>
          <div className={"upcoming-class__container__right-box__row__date-duration__"}>
            <h4>{item.time}</h4>
            <h4 className={"upcoming-class__container__right-box__row__date-duration__middot"}>&middot;</h4>
            <h4>{item.duration}</h4>
          </div>
          <div className={"upcoming-class__container__right-box__row__badge"}>
            <div
              className={"upcoming-class__container__right-box__row__badge--item"}
              style={{ backgroundColor: item.badgeColor }}
            >
              {"."}
            </div>
            <h4 className={"upcoming-class__container__right-box__row__badge--text"}>{item.badgeText}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingClassItem;

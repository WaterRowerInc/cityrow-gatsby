import React from "react";

export const InfoField = ({
  title,
  detail,
  emptyMessage,
}: {
  title: string;
  detail?: string;
  emptyMessage?: string;
}) => {
  return (
    <div className={"profile-page__info-field__"}>
      <h6 className={"profile-page__info-field__title"}>{title.toUpperCase()}</h6>
      {detail ? (
        <h4 className={"profile-page__info-field__detail"}>{detail}</h4>
      ) : (
        <h4 className={"profile-page__info-field__detail-alt"}>{emptyMessage}</h4>
      )}
    </div>
  );
};

import * as React from "react";
import CTAButton from "../CTAButton/CTAButton";
import { useLocation } from "@reach/router";
import "./RowButtons.scss";

const RowButtons = ({
  ctas,
}: {
  ctas: {
    label: string;
    destination: string;
    variation: string;
  }[];
}) => {
  const location = useLocation();

  return (
    <>
      {ctas && (
        <div className={"row_buttons__cta_container"}>
          {ctas?.map((cta: any, index: number) => {
            return (
              <CTAButton
                key={`cta-content-${cta?.label}-${index}-${cta?.destination}`}
                goTo={
                  cta?.destination && cta?.destination !== "/get-notified-modal"
                    ? cta?.destination
                    : `${location.pathname}${location.search}`
                }
                text={cta?.label}
                variation={cta.variation}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default RowButtons;

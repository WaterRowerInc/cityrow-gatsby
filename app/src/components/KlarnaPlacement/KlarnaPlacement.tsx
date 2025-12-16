import React from "react";
import { parsePriceWithCurrencyToNumber } from "../../utils/formatUtils";

const getKlarnaPlacement = (price: number) => {
  return `<klarna-placement data-key="credit-promotion-auto-size" data-locale="en-US" data-purchase-amount="${
    price * 100
  }"></klarna-placement>`;
};

const KlarnaPlacement = ({ price }: { price: string }) => {
  React.useEffect(() => window.KlarnaOnsiteService.push({ eventName: "refresh-placements" }), [price]);
  const parsedPrice: number = parsePriceWithCurrencyToNumber(price);
  if (!parsedPrice || parsedPrice === 0) {
    return <div />;
  }
  const generatedHtml = getKlarnaPlacement(parsedPrice);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: generatedHtml,
      }}
    />
  );
};

export default KlarnaPlacement;

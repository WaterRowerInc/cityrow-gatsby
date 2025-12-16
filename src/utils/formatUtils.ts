export const formatPriceWithCurrency = (price: number, currency: string): string => {
  return `$${new Intl.NumberFormat(currency).format(price || 0)}`;
};

export const formatPriceWithCurrencyAndDecimals = (price: number, currency: string): string => {
  return `$${new Intl.NumberFormat(currency, { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(
    price || 0
  )}`;
};

export const toPascalCase = (word: string) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;

export const parsePriceWithCurrencyToNumber = (price: string): number => {
  return parseFloat(price.replace("$", "").replace(/,/g, ""));
};

export const roundNumberWithTwoDecimals = (value: number) => Number(`${Math.round(Number(`${value}e2`))}e-2`);

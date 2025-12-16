import React, { useEffect } from "react";
import "./Quantity.scss";

const Quantity = ({
  stock,
  stockTracking,
  onQuantitySelected,
}: {
  stock: number;
  stockTracking?: boolean;
  onQuantitySelected: (quantity: number) => void;
}) => {
  if (!stockTracking || !stock) return null;
  useEffect(() => {
    onQuantitySelected(1);
  }, []);

  return (
    <div className='quantity__container'>
      <h6 className='quantity__title'>Qty</h6>
      <select
        placeholder='Size'
        className='quantity__select'
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onQuantitySelected(Number.parseInt(e.target.value))}
      >
        {Array.from(Array(stock + 1).keys())
          .slice(1, 7)
          .map((quantity: number) => (
            <option key={quantity} value={quantity} className='quantity__option'>
              {quantity}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Quantity;

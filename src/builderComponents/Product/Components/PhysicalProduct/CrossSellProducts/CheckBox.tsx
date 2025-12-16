import React, { useRef, useState } from "react";
import "./CheckBox.scss";

const CheckBox = ({
  visible,
  onCheck,
  onUnCheck,
  productName,
}: {
  visible: boolean;
  productName: string;
  onCheck: () => void;
  onUnCheck: () => void;
}) => {
  if (!visible) return null;

  const checkBoxRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className='checkBox__container'>
      <label className='checkBox__wrapper'>
        <input
          ref={checkBoxRef}
          type='checkbox'
          onClick={() => {
            if (!isChecked) {
              onCheck();
            } else {
              onUnCheck();
            }
            setIsChecked(!isChecked);
          }}
        />
        <span className='checkBox__checkmark' />
        ADD {productName.toUpperCase()}
      </label>
    </div>
  );
};

export default CheckBox;

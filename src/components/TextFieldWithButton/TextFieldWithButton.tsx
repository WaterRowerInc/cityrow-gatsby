import * as React from "react";
import "./TextFieldWithButton.scss";

interface ArrowTextFieldProps {
  onSubmit: (value: string) => void;
  icon?: string;
  actionText?: string;
  transparent?: boolean;
  roundedCorner?: boolean;
  borderStyle?: string;
  smooth?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
}

function TextFieldWithButton({
  onSubmit,
  className,
  roundedCorner,
  borderStyle,
  smooth,
  transparent,
  placeholder,
  type = "text",
  icon,
  actionText,
}: ArrowTextFieldProps) {
  const [value, setValue] = React.useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleClick(): void {
    onSubmit(value);
    setValue("");
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSubmit(value);
      setValue("");
    }
  }

  return (
    <div className={className}>
      <div
        className={`arrow-text-field__wrapper${roundedCorner ? "--rounded" : smooth ? "--smooth" : ""} ${borderStyle}`}
      >
        <input
          className={`
              arrow-text-field__text-input
              ${transparent && "arrow-text-field__text-input--transparent"}
            `}
          onKeyPress={handleKeyPress}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          type={type}
          pattern={type === "email" ? "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/" : ""}
          required={type === "email"}
        />
        <div
          onClick={handleClick}
          className={`arrow-text-field__icon${
            smooth ? "--smooth" : ""
          } ${borderStyle} arrow-text-field__icon__clear-border`}
        >
          {icon ? <img src={icon} alt='Icon' /> : <div className='arrow-text-field__text'>{actionText}</div>}
        </div>
      </div>
    </div>
  );
}

export default TextFieldWithButton;

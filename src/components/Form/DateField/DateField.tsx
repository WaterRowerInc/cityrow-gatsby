import React from "react";
import "./DateField.scss";
import "../DropdownField/DropdownField.scss";
import { Dropdown } from "semantic-ui-react";
import { DropdownOptionType } from "../DropdownField/DropdownOptionType";

const DateField = ({
  day,
  dayOptions,
  givenError,
  inputDayAction,
  inputMonthAction,
  inputYearAction,
  label,
  month,
  width,
  year,
}: {
  day?: string;
  dayOptions?: DropdownOptionType[];
  givenError?: string;
  inputDayAction: (newValue: string, errorFound: string) => void;
  inputMonthAction: (newValue: string, errorFound: string) => void;
  inputYearAction: (newValue: string, errorFound: string) => void;
  label: string;
  month?: string;
  width: 100 | 85 | 50 | 30 | 15;
  year?: string;
}) => {
  const [storedDay, setStoredDay] = React.useState("");
  const [storedMonth, setStoredMonth] = React.useState("");
  const [storedYear, setStoredYear] = React.useState("");
  const currentDate = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"];
  const monthOptions = months.map((month: string, index: number) => ({ key: index + 1, text: month, value: month }));
  const yearOptions: {}[] = [];

  for (let i = 1920; i <= currentDate.getFullYear(); i++) {
    yearOptions.push({ key: i.toString(), value: i.toString(), text: i.toString() });
  }

  const setValue = (key, value) => {
    if (key === "day") {
      setStoredDay(value);
      inputDayAction(value, "");
    } else if (key === "month") {
      setStoredMonth(value);
      inputMonthAction(value, "");
    } else {
      setStoredYear(value);
      inputYearAction(value, "");
    }
  };
  return (
    <div className={`date-field__container__ date-field__size-${width}`}>
      <div className={"date-field__container__label-row__"}>
        <h4>{label}</h4>
      </div>
      <div className={"date-field__container__input-row__"}>
        <div className={"date-field__container__input-row__inside"}>
          <div className={"dropdown-field__container__ dropdown-field__size-30"}>
            <div className={"dropdown-field__container__input-row__"}>
              <Dropdown
                defaultValue={month}
                fluid={true}
                selection={true}
                search={true}
                selectOnBlur={false}
                icon={"chevron down"}
                options={monthOptions}
                onChange={(_, data) => setValue("month", data.value)}
              />
            </div>
          </div>
          <div className={"dropdown-field__container__ dropdown-field__size-30"}>
            <div className={"dropdown-field__container__input-row__"}>
              <Dropdown
                defaultValue={day}
                fluid={true}
                selection={true}
                search={true}
                selectOnBlur={false}
                icon={"chevron down"}
                options={dayOptions}
                onChange={(_, data) => setValue("day", data.value)}
              />
            </div>
          </div>
          <div className={"dropdown-field__container__ dropdown-field__size-30"}>
            <div className={"dropdown-field__container__input-row__"}>
              <Dropdown
                defaultValue={year}
                fluid={true}
                selection={true}
                search={true}
                options={yearOptions}
                selectOnBlur={false}
                icon={"chevron down"}
                onChange={(_, data) => setValue("year", data.value)}
              />
            </div>
          </div>
        </div>
        <h4 className={"date-field__container__input-row__error-label"}>{givenError}</h4>
      </div>
    </div>
  );
};

export default DateField;

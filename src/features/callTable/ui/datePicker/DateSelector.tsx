import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import "./DateSelector.css";
import IconCalendar from "./icons/IconCalendar";
import Right from "./icons/Right";
import Left from "./icons/Left";
import DatePicker from "react-datepicker";
import { SelectPeriodProps } from "../../model/types";
interface DateSelectorProps {
  selectPeriod: SelectPeriodProps;
  setSelectedPeriod: any;
  handleDateRange: (range: SelectPeriodProps) => void;
  startDate: Date | null;
  endDate: Date | null;
  handleDateChange: (date: Date | null, type: "start" | "end") => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectPeriod, setSelectedPeriod, handleDateRange, startDate, endDate, handleDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: SelectPeriodProps[] = [
    { name: "3 дня", value: "last3Days" },
    { name: "Неделя", value: "lastWeek" },
    { name: "Месяц", value: "lastMonth" },
    { name: "Год", value: "lastYear" },
    { name: "Указать даты", value: "custom" },
  ];

  const handleSelect = (option: SelectPeriodProps) => {
    console.log("options.name", option.name);
    handleDateRange(option);
    if (option.name === "Указать даты") {
      setSelectedPeriod(option);
    } else {
      setSelectedPeriod(option);
    }
    setIsOpen(false);
  };
  console.log("selectPeriod.name", selectPeriod.name);

  return (
    <div className="dropdown-container ">
      <div className=" picker_container" onClick={() => setIsOpen(!isOpen)}>
        {/* {customDate || selectedOption} */}
        <Left />

        <IconCalendar />

        <p className={`picker_container_text `}>{selectPeriod.name}</p>
        <Right />
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option.value}
              className={` ${selectPeriod.name === option.name ? "picker_container_text_active" : ""} `}
              onClick={option.value === "custom" ? undefined : () => handleSelect(option)}
            >
              {option.name}
              {option.value === "custom" && (
                <>
                  <div className={`custom-date-range ${selectPeriod.name === option.name ? "picker_container_text_active" : ""} `}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        handleDateChange(date, "start");
                      }}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="__.__.__"
                      dateFormat="dd-MM-yy"
                      className="custom-date-picker"
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        handleDateChange(date, "end");
                        setSelectedPeriod(option);
                        setIsOpen(false);
                      }}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="__.__.__"
                      dateFormat="dd-MM-yy"
                      minDate={startDate ?? undefined}
                      className="custom-date-picker"
                    />
                    <IconCalendar />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DateSelector;

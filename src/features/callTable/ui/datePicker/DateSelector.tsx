import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import "./DateSelector.css";
import IconCalendar from "./icons/IconCalendar";
import Right from "./icons/Right";
import Left from "./icons/Left";
interface DateSelectorProps {
  selectPeriod: string;
}
const DateSelector: React.FC<DateSelectorProps> = ({ selectPeriod }) => {
  return (
    <div className="picker_container">
      <Left/>

      <IconCalendar />

      <p className="picker_container_text">{selectPeriod}</p>
      <Right/>
    </div>
  );
};

export default DateSelector;

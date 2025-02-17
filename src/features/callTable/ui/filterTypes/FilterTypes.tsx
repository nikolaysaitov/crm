import React, { useState } from "react";
import "./FilterTypes.css";
import { FilterTypesProps, SelectPeriodProps } from "../../model/types";
import Down from "./icons/Down";

export default function FilterTypes({ types, setTypes }: FilterTypesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options: SelectPeriodProps[] = [
    { name: "Все типы", value: "all" },
    { name: "Входящие", value: "incoming" },
    { name: "Исходящие", value: "out" },
  ];

  const handleSelectType = (option: SelectPeriodProps) => {
    setTypes(option);
    setIsOpen(false);
  };
  return (
    <>
      <div className="dropdown-container_filter ">
        <div className="picker_container picker_container_filter" onClick={() => setIsOpen(!isOpen)}>
          <p className={`picker_container_text `}>{types.name}</p>
          <Down />
        </div>{" "}
        {isOpen && (
          <ul className="dropdown-menu_filter">
            {options.map((option) => (
              <li
                key={option.value}
              className={` ${types.name === option.name ? "picker_container_text_active" : ""} `}
              
                onClick={option.value === "custom" ? undefined : () => handleSelectType(option)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

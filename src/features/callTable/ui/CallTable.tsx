import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CallTable.css";
import { CallIcon } from "./icon/CallIcon";
import { Rating } from "./rating/Rating";
import DateSelector from "./datePicker/DateSelector";
import { formatPhoneNumber, getRandomString } from "../api/utils";
import FilterTypes from "./filterTypes/FilterTypes";
import { TypeCall } from "../model/types";
import Down from "./filterTypes/icons/Down";
import ClearFilters from "./filterTypes/icons/ClearFilters";
import Player from "./audio/Player";
interface SelectPeriodProps {
  name: string;
  value: string;
}
export default function CallTable() {
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate());
    return date;
  });
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectPeriod, setSelectPeriod] = useState<SelectPeriodProps>({ name: "3 дня", value: "last3Days" });
  const [page, setPage] = useState(1); // Страница
  const [limit] = useState(50); // Число записей на странице
  const [types, setTypes] = useState<TypeCall>({ name: "Все типы", value: "all" });
  const [sort, setSort] = useState("");

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getData = async ({ queryKey }: any) => {
    const [, dateStart, dateEnd, selectPeriod, types] = queryKey;
    const response = await fetch(
      `https://api.skilla.ru/mango/getList?date_start=${dateStart.toISOString().split("T")[0]}&date_end=${
        dateEnd.toISOString().split("T")[0]
      }&limit=${limit}&offset=${(page - 1) * limit}${sort !== "" ? `&sort_by=${sort}` : ""}`,
      {
        method: "POST",
        headers: { Authorization: "Bearer testtoken" },
        body: JSON.stringify({}),
      }
    );
    return response.json();
  };
  const { data: calls, isLoading } = useQuery({ queryKey: ["calls", startDate, endDate, page, limit, selectPeriod, types, sort], queryFn: getData });

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleDateRange = (range: SelectPeriodProps) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (range.value) {
      case "last3Days":
        startDate.setDate(today.getDate() - 3);
        setSelectPeriod(range);
        break;
      case "lastWeek":
        startDate.setDate(today.getDate() - 7);
        setSelectPeriod(range);
        break;
      case "lastMonth":
        startDate.setMonth(today.getMonth() - 1);
        setSelectPeriod(range);
        break;
      case "lastYear":
        startDate.setFullYear(today.getFullYear() - 1);
        setSelectPeriod(range);
        break;
      default:
        break;
    }

    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="table">
      <div className="header-table">
        <div className="header-table_filter_container">
          <FilterTypes types={types} setTypes={setTypes} />
          {sort && (
            <div className="header-table_clear" onClick={() => setSort("")}>
              <p>Сбросить фильтры</p>
              <ClearFilters />
            </div>
          )}
        </div>

        <DateSelector
          selectPeriod={selectPeriod}
          setSelectedPeriod={setSelectPeriod}
          handleDateRange={handleDateRange}
          startDate={startDate}
          endDate={endDate}
          handleDateChange={handleDateChange}
        />
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        calls && (
          <table className="call-table">
            <thead className="call-table_head">
              <tr>
                <th>Тип</th>
                <th className="call-table_filter" onClick={() => setSort("date")}>
                  Время
                  <Down />
                </th>
                <th>Сотрудник</th>
                <th>Звонок</th>
                <th>Источник</th>
                <th>Оценка</th>
                <th className="call-table_filter" onClick={() => setSort("duration")}>
                  Длительность
                  <Down />
                </th>
              </tr>
            </thead>
            <tbody>
              {calls?.results
                ?.filter((call: any) => {
                  if (types.value === "incoming") return call.in_out === 1;
                  if (types.value === "out") return call.in_out === 0;
                  return true; // Если "all", показываем все звонки
                })
                .map((call: any) => (
                  <tr key={call.id} className="call-table_row">
                    <td>
                      <CallIcon inOut={call.in_out} status={call.status} />
                    </td>

                    <td className="call-table_time">{call.date.substring(11, 16)}</td>
                    <td>
                      <div className="person-info">
                        <img src={call.person_avatar} alt="avatar" className="avatar" />
                      </div>
                    </td>
                    <td className="call-table_phone">{formatPhoneNumber(call.from_number)}</td>
                    <td className="call-table_sourses">{call.source || getRandomString()}</td>
                    <td>
                      <Rating time={call.time} />
                    </td>
                    <td className="call-table_player" style={call.time !== 0 ? { cursor: "pointer" } : {}}>
                      {call.time !== 0 && call.record ? (
                        <Player record={call.record} partnership_id={call.partnership_id} callTime={call.time} />
                      ) : (
                        call.time + "сек"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      )}
      <>
        {" "}
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Предыдущая
          </button>
          <span>Страница {page}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={calls?.results?.length < limit}>
            Следующая
          </button>
        </div>
      </>
    </div>
  );
}

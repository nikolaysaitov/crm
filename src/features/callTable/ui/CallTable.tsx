import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CallTable.css";
import { CallIcon } from "./icon/CallIcon";
import { Rating } from "./rating/Rating";
import DateSelector from "./datePicker/DateSelector";
import { formatPhoneNumber, getRandomString } from "../api/utils";

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
  const[selectPeriod, setSelectPeriod] = useState('3 дня')
  const [page, setPage] = useState(1); // Страница
  const [limit] = useState(50); // Число записей на странице
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getData = async ({ queryKey }: any) => {
    const [, dateStart, dateEnd] = queryKey;
    const response = await fetch(
      `https://api.skilla.ru/mango/getList?date_start=${dateStart.toISOString().split("T")[0]}&date_end=${
        dateEnd.toISOString().split("T")[0]
      }&limit=${limit}&offset=${(page - 1) * limit}`,
      {
        method: "POST",
        headers: { Authorization: "Bearer testtoken" },
        body: JSON.stringify({}),
      }
    );
    return response.json();
  };
  const { data: calls, isLoading } = useQuery({ queryKey: ["calls", startDate, endDate, page, limit], queryFn: getData });

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleDateRange = (range: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (range) {
      case "last3Days":
        startDate.setDate(today.getDate() - 3);
        setSelectPeriod('3 дня')
        break;
      case "lastWeek":
        startDate.setDate(today.getDate() - 7);
        setSelectPeriod('Неделя')
        break;
      case "lastMonth":
        startDate.setMonth(today.getMonth() - 1);
        setSelectPeriod('Месяц')
        break;
      case "lastYear":
        startDate.setFullYear(today.getFullYear() - 1);
        setSelectPeriod('Год')
        break;
      default:
        break;
    }

    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="table">
      <p className="text-xl font-semibold mb-4">Список звонков</p>
      <DateSelector selectPeriod={selectPeriod}/>
      {/* Выбор диапазона дат */}
      <div className="date-filters">
        <button onClick={() => handleDateRange("last3Days")}>Последние 3 дня</button>
        <button onClick={() => handleDateRange("lastWeek")}>Последняя неделя</button>
        <button onClick={() => handleDateRange("lastMonth")}>Последний месяц</button>
        <button onClick={() => handleDateRange("lastYear")}>Последний год</button>

        <div className="custom-date-range">
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, "start")}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Начальная дата"
            dateFormat="yyyy-MM-dd"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(date, "end")}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="Конечная дата"
            dateFormat="yyyy-MM-dd"
            minDate={startDate ?? undefined}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        calls && (
          <table className="call-table">
            <thead className="call-table_head">
              <tr>
                <th>Тип</th>
                <th>Время</th>
                <th>Сотрудник</th>
                <th>Звонок</th>
                <th>Источник</th>
                <th>Оценка</th>
                <th>Длительность</th>
              </tr>
            </thead>
            <tbody>
              {calls?.results?.map((call: any) => (
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
                  <td>{call.time} сек</td>
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

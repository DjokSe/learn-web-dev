import { buildCalendarGrid, dateKey, formatDate, formatMonth, isDateSelectable } from "../booking.js";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function Calendar({ year, month, today, selectedDay, onDayClick, onMonthChange }) {
  const days = buildCalendarGrid(year, month);
  const selectedKey = dateKey(selectedDay);

  return (
    <section className="month-panel" aria-labelledby="month-heading">
      <div className="month-header">
        <h2 className="panel-heading" id="month-heading" aria-live="polite">{formatMonth(year, month)}</h2>
        <div className="month-navigation" role="group" aria-label="Переключение месяцев">
          <button className="month-arrow" type="button" aria-label="Предыдущий месяц" onClick={() => onMonthChange(-1)}>‹</button>
          <button className="month-arrow" type="button" aria-label="Следующий месяц" onClick={() => onMonthChange(1)}>›</button>
        </div>
      </div>
      <div className="weekday-grid" aria-hidden="true">
        {weekdays.map((day) => <span className="weekday" key={day}>{day}</span>)}
      </div>
      <div className="date-grid" role="group" aria-labelledby="month-heading">
        {days.map((day, index) => {
          if (!day) return <span className="date-spacer" key={"empty-" + index} aria-hidden="true" />;
          const key = dateKey(day);
          const selected = key === selectedKey;
          return (
            <button
              key={key}
              className={selected ? "date-button date-button--selected" : "date-button"}
              type="button"
              aria-label={formatDate(day)}
              aria-pressed={selected}
              disabled={!isDateSelectable(day, today)}
              onClick={() => onDayClick(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

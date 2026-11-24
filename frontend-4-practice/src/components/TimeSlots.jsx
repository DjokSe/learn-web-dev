import { dateKey, formatDayHeading, formatInterval } from "../booking.js";

export default function TimeSlots({ date, result, selectedTime, onTimeClick, onRetry }) {
  const slots = result?.slots ?? [];
  const hasSlots = slots.some(({ available }) => available);

  return (
    <section className="time-panel" aria-labelledby="time-heading">
      <h2 className="panel-heading" id="time-heading">
        <time className="chosen-date" dateTime={dateKey(date)}>{formatDayHeading(date)}</time>
      </h2>
      <p className="time-instruction">Выберите время начала · 45 минут</p>
      {!result && <p className="load-message" role="status">Загрузка слотов…</p>}
      {result?.status === "error" && (
        <>
          <p className="load-message" role="alert">Не удалось загрузить слоты. Попробуйте ещё раз.</p>
          <button className="load-retry" type="button" onClick={onRetry}>Повторить</button>
        </>
      )}
      {result?.status === "success" && (hasSlots ? (
        <>
          <div className="time-grid" role="group" aria-label="Время начала визита">
            {slots.map(({ time, available }) => {
              const selected = time === selectedTime;
              let className = "time-button";
              if (selected) className += " time-button--selected";
              if (!available) className += " time-button--unavailable";
              return (
                <button
                  key={time}
                  className={className}
                  type="button"
                  disabled={!available}
                  aria-label={available ? time : time + ", занято"}
                  aria-pressed={selected}
                  onClick={() => onTimeClick(time)}
                >
                  {time}
                </button>
              );
            })}
          </div>
          <p className="selected-interval">
            {selectedTime ? "✓ " + formatInterval(selectedTime) + " · время выбрано" : "Выберите свободное время"}
          </p>
        </>
      ) : (
        <p className="no-slots" role="status">На этот день всё занято. Выберите другую дату.</p>
      ))}
      <p className="timezone-note">Время указано по Москве</p>
    </section>
  );
}

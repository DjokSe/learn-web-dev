import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BookingProgress from "./components/BookingProgress.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingBottomBar from "./components/BookingBottomBar.jsx";
import { dateKey, formatDate, isDateSelectable } from "./booking.js";
import { fetchToday, fetchSlots } from "./api.js";

function fromApiDate({ day, month, year }) {
  const date = new Date(year, month, day);
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    throw new Error("Некорректная дата от сервера");
  }
  return date;
}

export default function App() {
  const [today, setToday] = useState(null);
  const [todayError, setTodayError] = useState(false);
  const [todayAttempt, setTodayAttempt] = useState(0);
  const [visibleMonth, setVisibleMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotResult, setSlotResult] = useState(null);
  const [slotAttempt, setSlotAttempt] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let active = true;
    fetchToday()
      .then((data) => {
        if (!active) return;
        const date = fromApiDate(data);
        setToday(date);
        setSelectedDay(date);
        setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      })
      .catch(() => {
        if (active) setTodayError(true);
      });
    return () => { active = false; };
  }, [todayAttempt]);

  useEffect(() => {
    if (!selectedDay) return;
    let active = true;
    fetchSlots({
      day: selectedDay.getDate(),
      month: selectedDay.getMonth(),
      year: selectedDay.getFullYear(),
    })
      .then(({ date, slots }) => {
        if (!active) return;
        if (dateKey(fromApiDate(date)) !== dateKey(selectedDay) || !Array.isArray(slots)) {
          throw new Error("Сервер вернул слоты для другой даты или в неверном формате");
        }
        setSlotResult({ status: "success", slots });
      })
      .catch(() => {
        if (active) setSlotResult({ status: "error" });
      });
    // Ответ от прежнего дня не меняет слоты текущего дня.
    return () => { active = false; };
  }, [selectedDay, slotAttempt]);

  function retryToday() {
    setTodayError(false);
    setTodayAttempt((attempt) => attempt + 1);
  }

  function retrySlots() {
    setSlotResult(null);
    setSlotAttempt((attempt) => attempt + 1);
  }

  function changeMonth(offset) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  function selectDay(day) {
    if (!isDateSelectable(day, today) || dateKey(day) === dateKey(selectedDay)) return;
    setSelectedDay(day);
    setSelectedTime(null);
    setSlotResult(null);
    setConfirmed(false);
  }

  function selectTime(time) {
    setSelectedTime(time);
    setConfirmed(false);
  }

  const summary = selectedDay ? formatDate(selectedDay) + " • " + (selectedTime ?? "время не выбрано") : "";

  return (
    <div className="site-frame">
      <Header />
      <main className="appointment">
        <p className="eyebrow">Онлайн-запись / Шаг 3 из 5</p>
        <BookingProgress />
        <section className="visit-choice" aria-labelledby="page-heading">
          <p className="service-label">Мужская стрижка</p>
          <h1 className="page-heading" id="page-heading">Выберите удобное время</h1>
          <p className="visit-description">Дмитрий · 45 минут · 1 600 ₽</p>
          {!today ? (
            <div className="load-panel">
              {todayError ? (
                <>
                  <p className="load-message" role="alert">Не удалось загрузить календарь. Попробуйте ещё раз.</p>
                  <button className="load-retry" type="button" onClick={retryToday}>Повторить</button>
                </>
              ) : <p className="load-message" role="status">Загрузка…</p>}
            </div>
          ) : <>
          <div className="schedule-layout">
            <Calendar
              year={visibleMonth.getFullYear()}
              month={visibleMonth.getMonth()}
              today={today}
              selectedDay={selectedDay}
              onDayClick={selectDay}
              onMonthChange={changeMonth}
            />
            <TimeSlots date={selectedDay} result={slotResult} selectedTime={selectedTime} onTimeClick={selectTime} onRetry={retrySlots} />
          </div>
          <BookingBottomBar
            summary={summary}
            canContinue={selectedTime !== null}
            confirmed={confirmed}
            onContinue={() => setConfirmed(true)}
          />
          </>}
        </section>
      </main>
      <Footer />
    </div>
  );
}

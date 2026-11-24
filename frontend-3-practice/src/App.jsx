import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BookingProgress from "./components/BookingProgress.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingBottomBar from "./components/BookingBottomBar.jsx";
import { dateKey, formatDate, getSlotsForDay, getToday, isDateSelectable } from "./booking.js";

export default function App() {
  const [today] = useState(getToday);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlotsForDay(today, today));
  const [confirmed, setConfirmed] = useState(false);

  function changeMonth(offset) {
    const next = new Date(currentYear, currentMonth + offset, 1);
    setCurrentMonth(next.getMonth());
    setCurrentYear(next.getFullYear());
  }

  function selectDay(day) {
    if (!isDateSelectable(day, today) || dateKey(day) === dateKey(selectedDay)) return;
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlotsForDay(day, today));
    setConfirmed(false);
  }

  function selectTime(time) {
    setSelectedTime(time);
    setConfirmed(false);
  }

  const summary = formatDate(selectedDay) + " • " + (selectedTime ?? "время не выбрано");

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
          <div className="schedule-layout">
            <Calendar
              year={currentYear}
              month={currentMonth}
              today={today}
              selectedDay={selectedDay}
              onDayClick={selectDay}
              onMonthChange={changeMonth}
            />
            <TimeSlots date={selectedDay} slots={slots} selectedTime={selectedTime} onTimeClick={selectTime} />
          </div>
          <BookingBottomBar
            summary={summary}
            canContinue={selectedTime !== null}
            confirmed={confirmed}
            onContinue={() => setConfirmed(true)}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

"use strict";

// 1. Данные
const slotTimes = ["10:00", "11:30", "14:00", "15:30", "17:00", "19:00"];
const availabilityPatterns = [[2], [0, 3, 5], [], [1, 2, 4]];
const visitDuration = 45;
const studioDate = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow", year: "numeric", month: "numeric", day: "numeric",
});
const monthFormat = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const weekdayFormat = new Intl.DateTimeFormat("ru-RU", { weekday: "long" });
const dayMonthFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const todayParts = Object.fromEntries(studioDate.formatToParts(new Date()).map(({ type, value }) => [type, value]));
const today = new Date(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day));

// 2. Состояние
const state = {
  currentMonth: today.getMonth(),
  currentYear: today.getFullYear(),
  selectedDate: today,
  selectedTime: null,
  slots: [],
};

// 3. Чистые функции
function buildCalendarGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const length = Math.ceil((offset + days) / 7) * 7;
  return Array.from({ length }, (_, index) => {
    const day = index - offset + 1;
    return day >= 1 && day <= days ? new Date(year, month, day) : null;
  });
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateSelectable(date, firstBookableDate) {
  return dateKey(date) >= dateKey(firstBookableDate);
}

function getSlotsForDay(date, referenceDate) {
  // Стабильное учебное расписание: сегодня хотя бы один слот, следующие дни различаются.
  const utcDay = (value) => Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
  const offset = (utcDay(date) - utcDay(referenceDate)) / 86400000;
  const available = availabilityPatterns[offset % availabilityPatterns.length] ?? [];
  return slotTimes.map((time, index) => ({ time, available: available.includes(index) }));
}

function capitalize(text) {
  return text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
}

function formatInterval(start) {
  const [hours, minutes] = start.split(":").map(Number);
  const end = hours * 60 + minutes + visitDuration;
  const endHours = String(Math.floor(end / 60)).padStart(2, "0");
  const endMinutes = String(end % 60).padStart(2, "0");
  return `${start}–${endHours}:${endMinutes}`;
}

// 4. Отрисовка и обработчики
const calendar = document.querySelector(".date-grid");
const monthHeading = document.querySelector("#month-heading");
const chosenDate = document.querySelector(".chosen-date");
const timeGrid = document.querySelector(".time-grid");
const noSlots = document.querySelector(".no-slots");
const slotHint = document.querySelector("#slot-hint");
const summary = document.querySelector("#booking-summary");
const continueButton = document.querySelector("#continue-booking");
const feedback = document.querySelector(".booking-feedback");

function renderCalendar() {
  const { currentYear, currentMonth, selectedDate } = state;
  monthHeading.textContent = capitalize(monthFormat.format(new Date(currentYear, currentMonth, 1))).replace(/\s*г\.$/, "");
  calendar.innerHTML = buildCalendarGrid(currentYear, currentMonth).map((date) => {
    if (!date) return '<span class="date-spacer" aria-hidden="true"></span>';
    const selected = dateKey(date) === dateKey(selectedDate);
    const disabled = !isDateSelectable(date, today);
    return `<button class="date-button${selected ? " date-button--selected" : ""}" type="button"
      data-day="${date.getDate()}" aria-label="${dayFormat.format(date)}"
      aria-pressed="${selected}"${disabled ? " disabled" : ""}>${date.getDate()}</button>`;
  }).join("");
  calendar.querySelectorAll("button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const { selectedDate, selectedTime, slots } = state;
  chosenDate.dateTime = dateKey(selectedDate);
  chosenDate.textContent = `${dayMonthFormat.format(selectedDate)}, ${weekdayFormat.format(selectedDate)}`;
  const hasSlots = slots.some((slot) => slot.available);
  noSlots.hidden = hasSlots;
  slotHint.hidden = !hasSlots;
  timeGrid.hidden = !hasSlots;
  timeGrid.innerHTML = hasSlots ? slots.map(({ time, available }) => {
    const selected = time === selectedTime;
    const modifier = selected ? " time-button--selected" : available ? "" : " time-button--unavailable";
    return `<button class="time-button${modifier}" type="button" data-time="${time}"
      aria-pressed="${selected}"${available ? "" : ` disabled aria-label="${time}, занято"`}>${time}</button>`;
  }).join("") : "";
  timeGrid.querySelectorAll("button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", onTimeSlotClick);
  });
  slotHint.textContent = selectedTime ? `✓ ${formatInterval(selectedTime)} · время выбрано` : "Выберите свободное время";
}

function updateBottomBar() {
  const date = capitalize(dayFormat.format(state.selectedDate)).replace(/\s*г\.$/, "");
  summary.textContent = `${date} • ${state.selectedTime ?? "время не выбрано"}`;
  continueButton.disabled = state.selectedTime === null;
  feedback.hidden = true;
}

function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  const date = new Date(state.currentYear, state.currentMonth, day);
  if (!isDateSelectable(date, today) || dateKey(date) === dateKey(state.selectedDate)) return;
  state.selectedDate = date;
  state.selectedTime = null;
  state.slots = getSlotsForDay(date, today);
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  calendar.querySelector(`[data-day="${day}"]`).focus();
}

function onTimeSlotClick(event) {
  const { time } = event.currentTarget.dataset;
  if (!state.slots.some((slot) => slot.time === time && slot.available)) return;
  state.selectedTime = time;
  renderTimeSlots();
  updateBottomBar();
  timeGrid.querySelector(`[data-time="${time}"]`).focus();
}

function setupMonthNavigation() {
  function changeMonth(offset) {
    const month = new Date(state.currentYear, state.currentMonth + offset, 1);
    state.currentMonth = month.getMonth();
    state.currentYear = month.getFullYear();
    renderCalendar();
  }
  document.querySelector("#previous-month").addEventListener("click", () => changeMonth(-1));
  document.querySelector("#next-month").addEventListener("click", () => changeMonth(1));
}

// 5. Инициализация
function init() {
  state.slots = getSlotsForDay(state.selectedDate, today);
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  continueButton.addEventListener("click", () => {
    if (!state.selectedTime) return;
    feedback.textContent = `Вы выбрали визит: ${summary.textContent}. Это учебная запись.`;
    feedback.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", init);

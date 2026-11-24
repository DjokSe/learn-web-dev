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

export function buildCalendarGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const length = Math.ceil((offset + days) / 7) * 7;
  return Array.from({ length }, (_, index) => {
    const day = index - offset + 1;
    return day >= 1 && day <= days ? new Date(year, month, day) : null;
  });
}

export function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateSelectable(date, firstBookableDate) {
  return dateKey(date) >= dateKey(firstBookableDate);
}

export function getSlotsForDay(date, referenceDate) {
  // Стабильное учебное расписание: сегодня хотя бы один слот, следующие дни различаются.
  const utcDay = (value) => Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
  const offset = (utcDay(date) - utcDay(referenceDate)) / 86400000;
  const available = availabilityPatterns[offset % availabilityPatterns.length] ?? [];
  return slotTimes.map((time, index) => ({ time, available: available.includes(index) }));
}

export function capitalize(text) {
  return text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
}

export function formatInterval(start) {
  const [hours, minutes] = start.split(":").map(Number);
  const end = hours * 60 + minutes + visitDuration;
  const endHours = String(Math.floor(end / 60)).padStart(2, "0");
  const endMinutes = String(end % 60).padStart(2, "0");
  return `${start}–${endHours}:${endMinutes}`;
}


export function getToday(now = new Date()) {
  const parts = Object.fromEntries(studioDate.formatToParts(now).map(({ type, value }) => [type, value]));
  return new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}

export function formatMonth(year, month) {
  return capitalize(monthFormat.format(new Date(year, month, 1))).replace(/\s*г\.$/, "");
}

export function formatDate(date) {
  return capitalize(dayFormat.format(date)).replace(/\s*г\.$/, "");
}

export function formatDayHeading(date) {
  return dayMonthFormat.format(date) + ", " + weekdayFormat.format(date);
}

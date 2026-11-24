const visitDuration = 45;
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


export function formatMonth(year, month) {
  return capitalize(monthFormat.format(new Date(year, month, 1))).replace(/\s*г\.$/, "");
}

export function formatDate(date) {
  return capitalize(dayFormat.format(date)).replace(/\s*г\.$/, "");
}

export function formatDayHeading(date) {
  return dayMonthFormat.format(date) + ", " + weekdayFormat.format(date);
}

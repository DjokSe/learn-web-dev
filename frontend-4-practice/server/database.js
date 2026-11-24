const moscowDate = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const times = ["10:00", "11:30", "14:00", "15:30", "17:00", "19:00"];

function makeSlots(availableTimes) {
  return times.map((time) => ({ time, available: availableTimes.includes(time) }));
}

export const database = {
  get today() {
    const parts = Object.fromEntries(moscowDate.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    return { day: Number(parts.day), month: Number(parts.month) - 1, year: Number(parts.year) };
  },
  slotsEvenDay: makeSlots(["14:00"]),
  slotsOddDay: makeSlots(["10:00", "15:30", "19:00"]),
};

import { TZDate } from "@date-fns/tz";

const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

// e.g. "Samedi 24 octobre 2026 - 20h00"
export function parseFrenchDateTime(s: string, timeZone: string): Date {
  const match = s.toLowerCase().match(/(\d{1,2})\s+(\p{L}+)\s+(\d{4})\D+(\d{1,2})[h:](\d{2})/u);
  if (!match) {
    throw new Error(`Cannot parse date "${s}"`);
  }
  const [, day, monthName, year, hour, minute] = match;
  const month = months.indexOf(monthName);
  if (month === -1) {
    throw new Error(`Unknown month "${monthName}"`);
  }
  const date = new TZDate(Number(year), month, Number(day), Number(hour), Number(minute), timeZone);
  return new Date(date.getTime());
}

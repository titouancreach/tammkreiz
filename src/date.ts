import { DateTime, Effect, Option } from "effect";
import { InvalidDateError } from "./errors.ts";

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
export const parseFrenchDateTime = Effect.fn("parseFrenchDateTime")(function* (
  input: string,
  timeZone: string,
) {
  const match = input.toLowerCase().match(/(\d{1,2})\s+(\p{L}+)\s+(\d{4})\D+(\d{1,2})[h:](\d{2})/u);
  if (!match) {
    return yield* new InvalidDateError({ input });
  }
  const [, day, monthName, year, hour, minute] = match;
  const month = months.indexOf(monthName ?? "");
  if (month === -1) {
    return yield* new InvalidDateError({ input });
  }
  const zoned = DateTime.makeZoned(
    {
      year: Number(year),
      month: month + 1,
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute),
    },
    { timeZone, adjustForTimeZone: true },
  );
  if (Option.isNone(zoned)) {
    return yield* new InvalidDateError({ input });
  }
  return DateTime.toUtc(zoned.value);
});

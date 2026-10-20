// Wall-clock times displayed by tamm-kreiz.bzh (Europe/Paris) and the expected UTC instant.
export const dateCases: ReadonlyArray<readonly [input: string, expectedUtc: string]> = [
  // summer time (UTC+2)
  ["Samedi 13 juin 2026 - 20h30", "2026-06-13T18:30:00.000Z"],
  ["Samedi 24 octobre 2026 - 20h00", "2026-10-24T18:00:00.000Z"],
  // winter time (UTC+1)
  ["Samedi 5 décembre 2026 - 21h00", "2026-12-05T20:00:00.000Z"],
  ["Vendredi 16 janvier 2026 - 21h30", "2026-01-16T20:30:00.000Z"],
  // the evening before / after the DST switches
  ["Samedi 28 mars 2026 - 21h00", "2026-03-28T20:00:00.000Z"],
  ["Dimanche 29 mars 2026 - 15h00", "2026-03-29T13:00:00.000Z"],
  ["Samedi 24 octobre 2026 - 23h00", "2026-10-24T21:00:00.000Z"],
  ["Dimanche 25 octobre 2026 - 15h00", "2026-10-25T14:00:00.000Z"],
  // local midnight is the previous day in UTC
  ["Jeudi 1 janvier 2026 - 00h30", "2025-12-31T23:30:00.000Z"],
  // end of month / leap day
  ["Samedi 31 octobre 2026 - 21h00", "2026-10-31T20:00:00.000Z"],
  ["Mardi 29 février 2028 - 20h00", "2028-02-29T19:00:00.000Z"],
  // every month name with an accent or special character
  ["Samedi 15 août 2026 - 22h00", "2026-08-15T20:00:00.000Z"],
  ["Samedi 7 février 2026 - 20h45", "2026-02-07T19:45:00.000Z"],
  // single digit hour, uppercase, extra spaces
  ["SAMEDI  3  OCTOBRE  2026 - 9h05", "2026-10-03T07:05:00.000Z"],
];

export const invalidDateCases: ReadonlyArray<string> = [
  "demain soir",
  "Samedi 24 brumaire 2026 - 20h00",
  "",
];

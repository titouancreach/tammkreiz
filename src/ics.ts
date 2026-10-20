import { DateTime, Effect } from "effect";
import * as ics from "ics";
import type { CalendarEvent } from "./domain.ts";
import { IcsError } from "./errors.ts";

export const buildIcs = Effect.fn("buildIcs")(function* (event: CalendarEvent) {
  const now = yield* DateTime.now;
  const { year, month, day, hour, minute } = DateTime.toPartsUtc(event.start);
  const attributes: ics.EventAttributes & { timestamp: number } = {
    start: [year, month, day, hour, minute],
    startInputType: "utc",
    startOutputType: "utc",
    duration: { hours: event.durationHours },
    title: event.title,
    description: event.description,
    location: event.location,
    url: event.url,
    uid: event.url,
    timestamp: DateTime.toEpochMillis(now),
  };
  const { error, value } = ics.createEvent(attributes);
  if (error || !value) {
    return yield* new IcsError({ error: error ?? "Empty ics" });
  }
  return value;
});

import { assert, describe, it } from "@effect/vitest";
import { DateTime } from "effect";
import { CalendarEvent } from "./domain.ts";
import { buildGoogleCalendarUrl } from "./google.ts";

const fields = {
  title: "Fest Noz à Melgven",
  start: DateTime.makeUnsafe("2026-10-24T18:00:00Z"),
  durationHours: 4,
  description: "<strong>Prix: </strong> 10€ & 8€",
  location: "Salle polyvalente 29140 Melgven",
  url: "https://www.tamm-kreiz.bzh/evenement/74109/evenement",
};
const event = new CalendarEvent(fields);

describe("buildGoogleCalendarUrl", () => {
  it("targets the google calendar event template", () => {
    const url = new URL(buildGoogleCalendarUrl(event));
    assert.strictEqual(url.origin + url.pathname, "https://calendar.google.com/calendar/render");
    assert.strictEqual(url.searchParams.get("action"), "TEMPLATE");
  });

  it("sets start and end dates in UTC from the duration", () => {
    const url = new URL(buildGoogleCalendarUrl(event));
    assert.strictEqual(url.searchParams.get("dates"), "20261024T180000Z/20261024T220000Z");
  });

  it("handles an event ending the next day", () => {
    const url = new URL(
      buildGoogleCalendarUrl(
        new CalendarEvent({ ...fields, start: DateTime.makeUnsafe("2026-10-24T21:30:00Z") }),
      ),
    );
    assert.strictEqual(url.searchParams.get("dates"), "20261024T213000Z/20261025T013000Z");
  });

  it("encodes title, details and location", () => {
    const raw = buildGoogleCalendarUrl(event);
    assert.notMatch(raw, /[ <>€]/);
    const url = new URL(raw);
    assert.strictEqual(url.searchParams.get("text"), event.title);
    assert.strictEqual(url.searchParams.get("details"), event.description);
    assert.strictEqual(url.searchParams.get("location"), event.location);
  });
});

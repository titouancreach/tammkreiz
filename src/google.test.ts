import assert from "node:assert/strict";
import { test } from "node:test";
import { buildGoogleCalendarUrl } from "./google.ts";

const event = {
  title: "Fest Noz à Melgven",
  start: new Date("2026-10-24T18:00:00Z"),
  durationHours: 4,
  details: "<strong>Prix: </strong> 10€ & 8€",
  location: "Salle polyvalente 29140 Melgven",
};

test("should target the google calendar event template", () => {
  const url = new URL(buildGoogleCalendarUrl(event));
  assert.equal(url.origin + url.pathname, "https://calendar.google.com/calendar/render");
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
});

test("should set start and end dates in UTC from the duration", () => {
  const url = new URL(buildGoogleCalendarUrl(event));
  assert.equal(url.searchParams.get("dates"), "20261024T180000Z/20261024T220000Z");
});

test("should handle an event ending the next day", () => {
  const url = new URL(
    buildGoogleCalendarUrl({ ...event, start: new Date("2026-10-24T21:30:00Z") }),
  );
  assert.equal(url.searchParams.get("dates"), "20261024T213000Z/20261025T013000Z");
});

test("should encode title, details and location", () => {
  const raw = buildGoogleCalendarUrl(event);
  assert.doesNotMatch(raw, /[ <>€]/);
  const url = new URL(raw);
  assert.equal(url.searchParams.get("text"), event.title);
  assert.equal(url.searchParams.get("details"), event.details);
  assert.equal(url.searchParams.get("location"), event.location);
});

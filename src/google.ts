import { DateTime } from "effect";
import type { CalendarEvent } from "./domain.ts";

function formatUtc(date: DateTime.Utc): string {
  return DateTime.formatIso(date)
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const end = DateTime.add(event.start, { hours: event.durationHours });
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatUtc(event.start)}/${formatUtc(end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

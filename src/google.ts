export type GoogleCalendarEvent = {
  title: string;
  start: Date;
  durationHours: number;
  details: string;
  location: string;
};

function formatUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl(event: GoogleCalendarEvent): string {
  const end = new Date(event.start.getTime() + event.durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatUtc(event.start)}/${formatUtc(end)}`,
    details: event.details,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

import { Effect } from "effect";
import { parseFrenchDateTime } from "./date.ts";
import { CalendarEvent } from "./domain.ts";
import { buildGoogleCalendarUrl } from "./google.ts";
import { buildIcs } from "./ics.ts";
import { EventPage } from "./page.ts";
import { renderArtistes, renderPrice } from "./render.ts";
import { removeAccents } from "./string.ts";

export const program = Effect.gen(function* () {
  const page = yield* EventPage;
  if (!(yield* page.isEventPage)) {
    return;
  }

  const raw = yield* page.read;
  const event = new CalendarEvent({
    title: raw.title,
    start: yield* parseFrenchDateTime(raw.dateTime, "Europe/Paris"),
    durationHours: 4,
    description: `${renderPrice(raw.price)}<br>${renderArtistes([...raw.artists])}`,
    location: raw.location,
    url: raw.url,
  });
  yield* Effect.logDebug("event", event);

  const icsContent = yield* buildIcs(event);
  yield* page.addActionButton({
    href: `data:text/calendar;charset=UTF-8,${encodeURIComponent(icsContent)}`,
    download: `${removeAccents(event.title)}.ics`,
    icon: "download-alt",
    label: "Télécharger le fichier agenda",
  });
  yield* page.addActionButton({
    href: buildGoogleCalendarUrl(event),
    newTab: true,
    icon: "calendar",
    label: "Ajouter à Google Agenda",
  });
});

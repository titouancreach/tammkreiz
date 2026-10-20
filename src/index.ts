import * as ics from "ics";
import { parseFrenchDateTime } from "./date.ts";
import { buildGoogleCalendarUrl } from "./google.ts";
import { renderArtistes, renderPrice } from "./render.ts";
import { removeAccents } from "./string.ts";
import type { Artist, PracticalInformation } from "./types.ts";

const durationHours = 4;

function renderDescription(info: PracticalInformation, artists: Artist[]): string {
  return `${renderPrice(info.price)}<br>${renderArtistes(artists)}`;
}

function generateIcs(title: string, info: PracticalInformation, artists: Artist[]): string {
  const { dateTime } = info;
  const { error, value } = ics.createEvent({
    start: [
      dateTime.getUTCFullYear(),
      dateTime.getUTCMonth() + 1,
      dateTime.getUTCDate(),
      dateTime.getUTCHours(),
      dateTime.getUTCMinutes(),
    ],
    startInputType: "utc",
    startOutputType: "utc",
    duration: { hours: durationHours },
    title,
    description: renderDescription(info, artists),
    location: info.location,
    url: window.location.href,
  });

  if (error || !value) {
    throw error ?? new Error("Empty ics");
  }
  return value;
}

function findByText<T extends Element>(
  root: ParentNode,
  selector: string,
  text: string,
): T | undefined {
  return [...root.querySelectorAll<T>(selector)].find((e) => e.textContent?.includes(text));
}

function hasPracticalInfosBlock(): boolean {
  return !!findByText(document, ".blockheader > h2", "Infos pratiques");
}

function getTitle(): string {
  return document.querySelector(".introblock.eventintro h1")?.textContent ?? "";
}

function getArtists(): Artist[] {
  const artistsElements = document.querySelectorAll(
    "div.eventartists > div.blockcontent > div > div > ul > li",
  );

  return [...artistsElements].map((e) => e.textContent?.trim() ?? "").filter((s) => !!s); // trailing empty li?
}

function normalizeString(s: string): string {
  return s
    .trim()
    .replace("\n", "")
    .replace(/\s\s+/g, " ") // multiple spaces by 1 space
    .replace(/ /g, " "); // remove nbsp
}

function getPracticalsInfos(): PracticalInformation {
  const practicalInformationElement = document.querySelector(
    "div.sidebareventinfos > div.blockcontent",
  );
  if (!practicalInformationElement) {
    throw new Error("Cannot find the practical information block");
  }

  const getValue = (label: string) =>
    findByText(practicalInformationElement, "h3, h4", label)?.nextElementSibling?.textContent ?? "";

  return {
    dateTime: parseFrenchDateTime(normalizeString(getValue("Date et heure")), "Europe/Paris"),
    price: normalizeString(getValue("Prix")),
    location: normalizeString(getValue("Lieu")),
  };
}

function appendActionButton(html: string): void {
  const actionsHeader = findByText(
    document,
    "div.blockitem.sidebareventcommunity.sidebarblock > div.blockheader",
    "Actions",
  );

  actionsHeader?.parentElement
    ?.querySelector(":scope > div.blockcontent")
    ?.insertAdjacentHTML("beforeend", html);
}

function renderActionButton(attributes: string, icon: string, label: string): string {
  return `<a ${attributes} class="btn btn-default btn-lg btn-communaute" style="margin: 4px 0">
        <span style="color: black; font-size: 2em" class="glyphicon glyphicon-${icon}" aria-hidden="true"></span>
        <span style="color: black; font-size: 2em">${label}</span>
     </a>`;
}

function createDownloadButton(title: string, icsString: string): void {
  const href = `data:text/calendar;charset=UTF-8,${encodeURIComponent(icsString)}`;

  const filename = removeAccents(title);

  appendActionButton(
    renderActionButton(
      `href="${href}" download="${filename}.ics"`,
      "download-alt",
      "Télécharger le fichier agenda",
    ),
  );
}

function createGoogleCalendarButton(
  title: string,
  info: PracticalInformation,
  artists: Artist[],
): void {
  const href = buildGoogleCalendarUrl({
    title,
    start: info.dateTime,
    durationHours,
    details: renderDescription(info, artists),
    location: info.location,
  }).replaceAll("&", "&amp;");

  appendActionButton(
    renderActionButton(
      `href="${href}" target="_blank" rel="noopener"`,
      "calendar",
      "Ajouter à Google Agenda",
    ),
  );
}

console.log("Starting Tamkreiz extension...");

if (hasPracticalInfosBlock()) {
  try {
    const artists = getArtists();
    const title = getTitle();
    const practicalInfos = getPracticalsInfos();

    console.log(practicalInfos);

    const s = generateIcs(title, practicalInfos, artists);
    console.log(s);
    createDownloadButton(title, s);
    createGoogleCalendarButton(title, practicalInfos, artists);
  } catch (e) {
    console.error(
      `An error occured in the tam-kreiz chrome extension. Please report to the author: ${e}`,
    );
  }
}

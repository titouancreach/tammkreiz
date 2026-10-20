import { Effect, Layer } from "effect";
import * as Context from "effect/Context";
import { type ActionButton, RawEvent } from "./domain.ts";
import { MissingElementError } from "./errors.ts";

function normalizeString(s: string): string {
  return s
    .trim()
    .replace("\n", "")
    .replace(/\s\s+/g, " ") // multiple spaces by 1 space
    .replace(/ /g, " "); // remove nbsp
}

function findByText(root: ParentNode, selector: string, text: string): Element | undefined {
  return [...root.querySelectorAll(selector)].find((e) => e.textContent?.includes(text));
}

function renderActionButton(button: ActionButton): string {
  const attributes = [
    `href="${button.href.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`,
    button.download === undefined ? "" : `download="${button.download}"`,
    button.newTab ? `target="_blank" rel="noopener"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<a ${attributes} class="btn btn-default btn-lg btn-communaute" style="margin: 4px 0">
        <span style="color: black; font-size: 2em" class="glyphicon glyphicon-${button.icon}" aria-hidden="true"></span>
        <span style="color: black; font-size: 2em">${button.label}</span>
     </a>`;
}

export class EventPage extends Context.Service<
  EventPage,
  {
    readonly isEventPage: Effect.Effect<boolean>;
    readonly read: Effect.Effect<RawEvent, MissingElementError>;
    readonly addActionButton: (button: ActionButton) => Effect.Effect<void, MissingElementError>;
  }
>()("@tammkreiz/EventPage") {
  static readonly make = (document: Document, url: string) => {
    const isEventPage = Effect.sync(
      () => !!findByText(document, ".blockheader > h2", "Infos pratiques"),
    );

    const read = Effect.gen(function* () {
      const infos = document.querySelector("div.sidebareventinfos > div.blockcontent");
      if (!infos) {
        return yield* new MissingElementError({ element: "Infos pratiques" });
      }
      const valueOf = (label: string) =>
        normalizeString(findByText(infos, "h3, h4", label)?.nextElementSibling?.textContent ?? "");

      return new RawEvent({
        title: document.querySelector(".introblock.eventintro h1")?.textContent ?? "",
        artists: [
          ...document.querySelectorAll("div.eventartists > div.blockcontent > div > div > ul > li"),
        ]
          .map((e) => e.textContent?.trim() ?? "")
          .filter((s) => !!s), // trailing empty li?
        dateTime: valueOf("Date et heure"),
        price: valueOf("Prix"),
        location: valueOf("Lieu"),
        url,
      });
    });

    const addActionButton = Effect.fn("EventPage.addActionButton")(function* (
      button: ActionButton,
    ) {
      const container = findByText(
        document,
        "div.blockitem.sidebareventcommunity.sidebarblock > div.blockheader",
        "Actions",
      )?.parentElement?.querySelector(":scope > div.blockcontent");
      if (!container) {
        return yield* new MissingElementError({ element: "Actions" });
      }
      container.insertAdjacentHTML("beforeend", renderActionButton(button));
    });

    return EventPage.of({ isEventPage, read, addActionButton });
  };

  static readonly layer = Layer.sync(EventPage, () =>
    EventPage.make(document, window.location.href),
  );
}

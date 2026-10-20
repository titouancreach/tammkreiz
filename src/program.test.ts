// @vitest-environment happy-dom
import { assert, beforeEach, describe, it } from "@effect/vitest";
import { Effect, Layer } from "effect";
import { TestClock } from "effect/testing";
import { EventPage } from "./page.ts";
import { program } from "./program.ts";
import { eventPageHtml, otherPageHtml } from "./test/eventPage.fixture.ts";

const url = "https://www.tamm-kreiz.bzh/evenement/74109/evenement";
const testLayer = Layer.sync(EventPage, () => EventPage.make(document, url));

const actionLinks = () =>
  [...document.querySelectorAll<HTMLAnchorElement>(".sidebareventcommunity a")].map((a) => ({
    label: a.textContent?.trim().replace(/\s+/g, " "),
    href: a.getAttribute("href") ?? "",
    download: a.getAttribute("download"),
    target: a.getAttribute("target"),
  }));

const icsOf = (href: string) =>
  decodeURIComponent(href.replace("data:text/calendar;charset=UTF-8,", "")).replace(
    /\r\n[ \t]/g,
    "",
  );

describe("program", () => {
  beforeEach(() => {
    document.body.innerHTML = eventPageHtml;
  });

  it.effect("does nothing on a page that is not an event", () =>
    Effect.gen(function* () {
      document.body.innerHTML = otherPageHtml;
      yield* program;
      assert.deepStrictEqual(actionLinks(), []);
    }).pipe(Effect.provide(testLayer)),
  );

  it.effect("adds the ics download and google calendar buttons", () =>
    Effect.gen(function* () {
      yield* program;
      const [ics, google] = actionLinks();
      assert.strictEqual(ics?.label, "Télécharger le fichier agenda");
      assert.strictEqual(ics?.download, "Fest Noz a Melgven le Samedi  24 octobre 2026.ics");
      assert.strictEqual(google?.label, "Ajouter à Google Agenda");
      assert.strictEqual(google?.target, "_blank");
    }).pipe(Effect.provide(testLayer)),
  );

  it.effect("generates the ics in UTC with a deterministic stamp and uid", () =>
    Effect.gen(function* () {
      yield* TestClock.setTime(Date.UTC(2026, 9, 20, 15, 32, 27));
      yield* program;
      const content = icsOf(actionLinks()[0]?.href ?? "");
      assert.include(content, "DTSTART:20261024T180000Z");
      assert.include(content, "DURATION:PT4H");
      assert.include(content, "DTSTAMP:20261020T153227Z");
      assert.include(content, `UID:${url}`);
      assert.include(content, "SUMMARY:Fest Noz à Melgven le Samedi  24 octobre 2026");
      assert.include(content, "LOCATION:Salle polyvalente 29140 Melgven");
    }).pipe(Effect.provide(testLayer)),
  );

  it.effect("prefills google calendar with the event", () =>
    Effect.gen(function* () {
      yield* program;
      const params = new URL(actionLinks()[1]?.href ?? "").searchParams;
      assert.strictEqual(params.get("text"), "Fest Noz à Melgven le Samedi  24 octobre 2026");
      assert.strictEqual(params.get("dates"), "20261024T180000Z/20261024T220000Z");
      assert.strictEqual(params.get("location"), "Salle polyvalente 29140 Melgven");
      assert.strictEqual(
        params.get("details"),
        "<strong>Prix: </strong> 10€ (sur place) 8€ (prévente)<br><strong>Artistes:</strong><ul><li>Blue Glaz</li><li>Kaféhin</li></ul>",
      );
    }).pipe(Effect.provide(testLayer)),
  );

  it.effect("fails with InvalidDateError when the date cannot be parsed", () =>
    Effect.gen(function* () {
      document.querySelector(".detail_item")!.textContent = "bientôt";
      const error = yield* Effect.flip(program);
      assert.strictEqual(error._tag, "InvalidDateError");
      assert.deepStrictEqual(actionLinks(), []);
    }).pipe(Effect.provide(testLayer)),
  );

  it.effect("fails with MissingElementError when the actions block is missing", () =>
    Effect.gen(function* () {
      document.querySelector(".sidebareventcommunity")!.remove();
      const error = yield* Effect.flip(program);
      assert.strictEqual(error._tag, "MissingElementError");
    }).pipe(Effect.provide(testLayer)),
  );
});

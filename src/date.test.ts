import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFrenchDateTime } from "./date.ts";

test("should parse a date in Europe/Paris during summer time", () => {
  const date = parseFrenchDateTime("Samedi 13 juin 2026 - 20h30", "Europe/Paris");
  assert.equal(date.toISOString(), "2026-06-13T18:30:00.000Z");
});

test("should parse a date in Europe/Paris during winter time", () => {
  const date = parseFrenchDateTime("Samedi 5 décembre 2026 - 21h00", "Europe/Paris");
  assert.equal(date.toISOString(), "2026-12-05T20:00:00.000Z");
});

test("should throw on an unparsable date", () => {
  assert.throws(() => parseFrenchDateTime("demain soir", "Europe/Paris"));
});

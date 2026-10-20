import assert from "node:assert/strict";
import { test } from "node:test";
import { removeAccents } from "./string.ts";

test("should remove accents to a string", () => {
  // some random french words
  assert.equal(removeAccents("été"), "ete");
  assert.equal(removeAccents("à"), "a");
  assert.equal(removeAccents("maïs"), "mais");
  assert.equal(removeAccents("août"), "aout");
});

test("Should not transform a string if there is no accents in it", () => {
  assert.equal(removeAccents("titouan"), "titouan");
});

test("Should take the case into account", () => {
  assert.equal(removeAccents("Été"), "Ete");
  assert.equal(removeAccents("ÉTÉ"), "ETE");
  assert.equal(removeAccents("été"), "ete");
  assert.equal(removeAccents("éTé"), "eTe");
});

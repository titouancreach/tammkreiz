import { assert, it as test } from "@effect/vitest";
import { removeAccents } from "./string.ts";

test("should remove accents to a string", () => {
  // some random french words
  assert.strictEqual(removeAccents("été"), "ete");
  assert.strictEqual(removeAccents("à"), "a");
  assert.strictEqual(removeAccents("maïs"), "mais");
  assert.strictEqual(removeAccents("août"), "aout");
});

test("Should not transform a string if there is no accents in it", () => {
  assert.strictEqual(removeAccents("titouan"), "titouan");
});

test("Should take the case into account", () => {
  assert.strictEqual(removeAccents("Été"), "Ete");
  assert.strictEqual(removeAccents("ÉTÉ"), "ETE");
  assert.strictEqual(removeAccents("été"), "ete");
  assert.strictEqual(removeAccents("éTé"), "eTe");
});

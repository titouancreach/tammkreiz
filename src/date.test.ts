import { assert, describe, it } from "@effect/vitest";
import { DateTime, Effect } from "effect";
import { dateCases, invalidDateCases } from "./date.cases.ts";
import { parseFrenchDateTime } from "./date.ts";

describe("parseFrenchDateTime", () => {
  for (const [input, expectedUtc] of dateCases) {
    it.effect(`parses "${input}" as ${expectedUtc}`, () =>
      Effect.gen(function* () {
        const date = yield* parseFrenchDateTime(input, "Europe/Paris");
        assert.strictEqual(DateTime.formatIso(date), expectedUtc);
      }),
    );
  }

  for (const input of invalidDateCases) {
    it.effect(`fails with InvalidDateError on "${input}"`, () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(parseFrenchDateTime(input, "Europe/Paris"));
        assert.strictEqual(error._tag, "InvalidDateError");
        assert.strictEqual(error.input, input);
      }),
    );
  }
});

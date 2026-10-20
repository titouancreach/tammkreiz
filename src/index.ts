import { BrowserRuntime } from "@effect/platform-browser";
import { Effect } from "effect";
import { EventPage } from "./page.ts";
import { program } from "./program.ts";

program.pipe(
  Effect.provide(EventPage.layer),
  Effect.catch((error) =>
    Effect.logError(
      "An error occured in the tam-kreiz chrome extension. Please report to the author",
      error,
    ),
  ),
  BrowserRuntime.runMain,
);

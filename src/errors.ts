import { Schema } from "effect";

export class MissingElementError extends Schema.TaggedError<
  MissingElementError,
  { readonly brand: unique symbol }
>()("MissingElementError", { element: Schema.String }) {}

export class InvalidDateError extends Schema.TaggedError<
  InvalidDateError,
  { readonly brand: unique symbol }
>()("InvalidDateError", { input: Schema.String }) {}

export class IcsError extends Schema.TaggedError<IcsError, { readonly brand: unique symbol }>()(
  "IcsError",
  {
    error: Schema.Defect(),
  },
) {}

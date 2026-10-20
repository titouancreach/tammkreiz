import { Schema } from "effect";

export type Artist = string;

export class RawEvent extends Schema.Class<RawEvent, { readonly brand: unique symbol }>("RawEvent")(
  {
    title: Schema.String,
    artists: Schema.Array(Schema.String),
    dateTime: Schema.String,
    price: Schema.String,
    location: Schema.String,
    url: Schema.String,
  },
) {}

export class CalendarEvent extends Schema.Class<CalendarEvent, { readonly brand: unique symbol }>(
  "CalendarEvent",
)({
  title: Schema.String,
  start: Schema.DateTimeUtc,
  durationHours: Schema.Finite,
  description: Schema.String,
  location: Schema.String,
  url: Schema.String,
}) {}

export type ActionButton = {
  readonly href: string;
  readonly label: string;
  readonly icon: string;
  readonly download?: string;
  readonly newTab?: boolean;
};

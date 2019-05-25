import moment from "moment";

export type Artist = string;

export type PracticalInformation = {
  dateTime: moment.Moment;
  price: string;
  location: string;
};

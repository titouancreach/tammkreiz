import $ from "jquery";
import moment from "moment";
import "moment/locale/fr";

function debugString(a: string, b: string) {
  const max = Math.min(a.length, b.length);

  for (let i = 0; i < max; i++) {
    console.log("a[i] === b[i]", a[i], b[i], a[i] === b[i]);
  }
}

type Artist = string;

type PracticalInformation = {
  dateTime: moment.Moment;
  price: string;
  location: string;
};

function hasPracticalInfosBlock(): boolean {
  return !!$(".blockheader > h2:contains(Infos pratiques)").length;
}

function getArtists(): Artist[] {
  const artistsElement = $(
    "div.eventartists > div.blockcontent > div > div > ul > li"
  );

  const groupes = $(artistsElement)
    .map(function() {
      return this.textContent;
    })
    .map(function() {
      return this.trim();
    })
    .filter(function() {
      return !!this;
    })
    .toArray();

  return groupes;
}

function normalizeString(s: string): string {
  return s
    .trim()
    .replace("\n", "")
    .replace(/\s\s+/g, " ") // multiple spaces by 1 space
    .replace(/\u00a0/g, " "); // remove nbsp
}

function getPracticalsInfos(): PracticalInformation {
  const practicalInformationElement = $(
    "div.sidebareventinfos > div.blockcontent"
  );

  const dateTime = $(practicalInformationElement)
    .find(":contains(Date et heure)")
    .next()
    .text();

  const price = $(practicalInformationElement)
    .find(":contains(Prix)")
    .next()
    .text();

  const location = $(practicalInformationElement)
    .find(":contains(Lieu)")
    .next()
    .text();

  const momentDateTime = moment(normalizeString(dateTime), "LLL", "fr");

  return {
    dateTime: momentDateTime,
    price: normalizeString(price),
    location: normalizeString(location)
  };
}

$(document).ready(() => {
  if (!hasPracticalInfosBlock()) {
    return;
  }
  console.log("This page can be parsed");

  const artists = getArtists();
  console.log("Artists are ", artists);

  const practicalInfos = getPracticalsInfos();
  console.log("DateTime is ", practicalInfos.dateTime.format());
  console.log("price is ", practicalInfos.price);
  console.log("location is", practicalInfos.location);
});

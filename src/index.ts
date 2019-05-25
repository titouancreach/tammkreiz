import $ from "jquery";

type Artist = string;

function hasInfosPratiquesBlock(): boolean {
  return !!$(".blockheader>h2:contains(Infos pratiques)").length;
}

function getArtists(): Artist[] {
  const groupesDiv = $(
    "#page_content > div > div:nth-child(3) > div.eventartists > div.blockcontent > div > div > ul > li"
  );

  const groupes = $(groupesDiv)
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

$(document).ready(() => {
  if (!hasInfosPratiquesBlock()) {
    return;
  }

  const artists = getArtists();

  console.log("Artists are", artists);
  console.log("This page can be parsed !!");
});

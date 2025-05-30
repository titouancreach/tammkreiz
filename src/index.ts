import $ from "jquery";
import moment from "moment";
import "moment/locale/fr";
import "moment-timezone";

// @ts-ignore
import * as ics from "ics";

import type { PracticalInformation, Artist } from "./types";
import { renderArtistes, renderPrice } from "./render";
import { removeAccents } from "./string";
import { Base64 } from "js-base64";

function generateIcs(
	title: string,
	info: PracticalInformation,
	artists: Artist[],
): Promise<string> {
	const { dateTime } = info;
	const utcDateTime = dateTime.utc();
	const event = {
		start: [
			utcDateTime.year(),
			utcDateTime.month() + 1,
			utcDateTime.date(),
			utcDateTime.hour(),
			utcDateTime.minute(),
		] as ics.DateArray,
		duration: { hours: 4 },
		title,
		description: `${renderPrice(info.price)}<br>${renderArtistes(artists)}`,
		location: info.location,
		url: window.location.href,
	};

	return new Promise((resolve, reject) => {
		ics.createEvent(event, (error: Error | undefined, value: string) => {
			if (error) {
				reject(error);
			} else {
				resolve(value);
			}
		});
	});
}

function hasPracticalInfosBlock(): boolean {
	return !!$(".blockheader > h2:contains(Infos pratiques)").length;
}

function getTitle(): string {
	const titleElement = $(".introblock.eventintro h1");
	return titleElement.text();
}

function getArtists(): Artist[] {
	const artistsElement = $(
		"div.eventartists > div.blockcontent > div > div > ul > li",
	);

	const groupes = $(artistsElement)
		.map(function () {
			return this.textContent;
		})
		.map(function () {
			return this.trim();
		})
		.filter(function () {
			return !!this; // trailing empty li?
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
		"div.sidebareventinfos > div.blockcontent",
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

	const momentDateTime = moment.tz(
		normalizeString(dateTime),
		"LLL",
		"Europe/Paris",
		"fr",
	);

	return {
		dateTime: momentDateTime,
		price: normalizeString(price),
		location: normalizeString(location),
	};
}

function createDownloadButton(title: string, icsString: string): void {
	const b64 = Base64.encode(icsString);
	const href = `data:text/calendar;charset=UTF-8;base64,${b64}`;

	const filename = removeAccents(title);

	$(
		"div.blockitem.sidebareventcommunity.sidebarblock:has(div.blockheader:contains(Actions)) > div.blockcontent",
	).append(
		`<a href="${href}" download="${filename}.ics" class="btn btn-default btn-lg btn-communaute" style="margin: 4px 0">
        <span style="color: black; font-size: 2em" class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
        <span style="color: black; font-size: 2em">Télécharger le fichier agenda</span>
     </a>`,
	);
}

$(() => {
	console.log("Starting Tamkreiz extension...");

	if (!hasPracticalInfosBlock()) {
		return;
	}

	const artists = getArtists();
	const title = getTitle();
	const practicalInfos = getPracticalsInfos();

	console.log(practicalInfos);

	generateIcs(title, practicalInfos, artists)
		.then((s) => {
			console.log(s);
			return s;
		})
		.then((s) => {
			createDownloadButton(title, s);
		})
		.catch((e) => {
			console.error(
				`An error occured in the tam-kreiz chrome extension. Please report to the author: ${e}`,
			);
		});
});

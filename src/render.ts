import { Artist } from "./types";

export function renderPrice(price: string): string {
  return `<strong>Price: </strong> ${price}`;
}

export function renderArtistes(artists: Artist[]): string {
  return `<strong>Artists:</strong><ul>${artists
    .map(a => `<li>- ${a}</li>`)
    .join("")}</ul>`;
}

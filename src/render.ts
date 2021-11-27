import { Artist } from "./types";

export function renderPrice(price: string): string {
  return `<strong>Prix: </strong> ${price}`;
}

export function renderArtistes(artists: Artist[]): string {
  return `<strong>Artistes:</strong><ul>${artists
    .map(a => `<li>${a}</li>`)
    .join("")}</ul>`;
}

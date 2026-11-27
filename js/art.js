// Placeholder drawings: flat blocks only, no final art yet.
// Each returns SVG markup for js/dom.js svg(). Shapes are deliberately rough; labels stay out of the pictures.

const INK = "#3b3631", PAPER = "#e9e2d3", MID = "#b9b0a0";

/** Station silhouettes for the wall calendar, keyed by the `shape` field of each station in the episode content. */
export function stationShape(shape) {
  const ground = `<rect x="0" y="86" width="200" height="4" fill="${INK}"/>`;
  const body = {
    // long block with a central tower
    hanoi: `<rect x="20" y="50" width="160" height="36" fill="${MID}"/><rect x="85" y="28" width="30" height="58" fill="${INK}" opacity=".55"/>`,
    // yellow-walled block
    haiphong: `<rect x="30" y="44" width="140" height="42" fill="#d9b84a"/><rect x="30" y="38" width="140" height="8" fill="${INK}" opacity=".5"/>`,
    // pink block with a clock face
    hue: `<rect x="40" y="40" width="120" height="46" fill="#d99aa5"/><circle cx="100" cy="54" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="2"/><path d="M100 54v-6M100 54h5" stroke="${INK}" stroke-width="2"/>`,
    // red-tiled roof, three arches
    nhatrang: `<rect x="35" y="52" width="130" height="34" fill="${MID}"/><path d="M28 54 L100 32 L172 54Z" fill="#b5523b"/>` +
      [60, 100, 140].map((x) => `<path d="M${x - 10} 86 v-14 a10 10 0 0 1 20 0 v14Z" fill="${INK}" opacity=".55"/>`).join(""),
    // three pointed roof cones in a row on one block
    dalat: `<rect x="30" y="58" width="140" height="28" fill="${MID}"/>` +
      [55, 100, 145].map((x) => `<path d="M${x - 24} 60 L${x} 18 L${x + 24} 60Z" fill="${INK}" opacity=".6"/>`).join(""),
    // flat long block
    saigon: `<rect x="15" y="56" width="170" height="30" fill="${MID}"/><rect x="15" y="52" width="170" height="5" fill="${INK}" opacity=".5"/>`,
  }[shape] || "";
  return `<svg viewBox="0 0 200 92" role="img" aria-hidden="true">${body}${ground}</svg>`;
}

/** The photo the lottery seller sends: an old lady on a bench before a three-coned roof, a short two-car train. */
export function photoDalat() {
  return `<svg viewBox="0 0 240 150" role="img" aria-hidden="true">
  <rect width="240" height="150" fill="#cfc8b8"/>
  <rect x="40" y="62" width="160" height="40" fill="${MID}"/>
  ${[70, 120, 170].map((x) => `<path d="M${x - 28} 64 L${x} 18 L${x + 28} 64Z" fill="${INK}" opacity=".55"/>`).join("")}
  <rect x="0" y="102" width="240" height="48" fill="#a99f8d"/>
  <rect x="150" y="96" width="34" height="16" rx="3" fill="#6d7f6a"/><rect x="186" y="96" width="34" height="16" rx="3" fill="#6d7f6a"/>
  <rect x="38" y="118" width="54" height="5" fill="${INK}"/><rect x="42" y="123" width="4" height="10" fill="${INK}"/><rect x="84" y="123" width="4" height="10" fill="${INK}"/>
  <circle cx="64" cy="100" r="6" fill="${INK}"/><path d="M56 118 q8 -18 16 0Z" fill="${INK}"/>
  </svg>`;
}

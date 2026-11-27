// Grey storyboard panels: flat blocks and silhouettes, no faces, no words inside the picture (texts are live HTML).
// All share one frame, 320 x 220. Rough on purpose: they test the telling, not the drawing.
// Marks that repeat so the reader can follow them: the tied box (parcel 47), the striped cuff (whoever writes the
// letter), the hat (the lady selling drinks), the pale little figure (the child).
const G = { d: "#35332f", k: "#55524c", m: "#6b6861", l: "#a5a198", p: "#d9d5cb", w: "#f7f4ec" };
const EDGE = `stroke="${G.d}" stroke-width="2"`;

const r = (x, y, w, h, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
const line = (d, c, w, extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const at = (x, y, s, inner) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;

const box = (x, y, w, h, f = G.l) => r(x, y, w, h, f, EDGE) + r(x + w * 0.42, y, w * 0.16, h * 0.4, G.m);
/** Parcel 47: the only pale box, tied with string, a plain knot and a torn label (no bow: it would read as a gift). */
const tied = (x, y, w, h) => r(x, y, w, h, G.w, EDGE) + line(`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`, G.d, 3)
  + line(`M${x + w / 2 - 5} ${y + h / 2 + 8}l5 -8l6 9`, G.d, 3)
  + `<path d="M${x + w * 0.1} ${y + h * 0.62}h${w * 0.28}l-3 4l4 4l-3 ${h * 0.12}h-${w * 0.25}Z" fill="${G.l}"/>`;
/** A standing figure, no face: feet at (0, 0), about 100 tall. */
const body = (f, edge = "") => `<circle cx="0" cy="-84" r="14" fill="${f}" ${edge}/><path d="M-20 0 L-22 -50 Q-20 -67 0 -67 Q20 -67 22 -50 L20 0Z" fill="${f}" ${edge}/>`;
const hat = (f) => `<path d="M-30 -84 L0 -114 L30 -84Z" fill="${f}" ${EDGE}/>`;
const child = (x, y, s) => at(x, y, s, body(G.w, EDGE));
/** A closed hand round something, seen from the side. */
const fist = (x, y, turn, f = G.l) => `<g transform="translate(${x} ${y}) rotate(${turn})"><rect x="-17" y="-15" width="34" height="30" rx="10" fill="${f}" ${EDGE}/>`
  + line("M-8 -13v13M1 -13v13M9 -13v13", G.d, 1.6) + `</g>`;
const cuff = (x, y, turn, len) => `<g transform="translate(${x} ${y}) rotate(${turn})">` + r(0, -22, len, 44, G.k, EDGE)
  + [8, 24, 40].map((v) => r(v, -21, 8, 42, G.w)).join("") + `</g>`;
/** A sheet of handwriting. */
const sheet = (x, y, w, h, n) => r(x, y, w, h, G.w, EDGE)
  + Array.from({ length: n }, (_, i) => line(`M${x + 12} ${y + 18 + i * 22}q4 -7 8 0t8 0t8 0t8 0` + (w > 100 ? "t8 0t8 0t8 0" : ""), G.m, 2)).join("");

const floor = () => r(0, 0, 320, 220, G.p) + r(0, 186, 320, 34, G.l);
/** An office shredder: a sheet half way into the slot, strips and a heap below. */
const shredder = (x, y, s) => at(x, y, s, sheet(12, -54, 56, 60, 2) + r(0, 0, 80, 46, G.d, EDGE) + r(8, 4, 64, 5, G.w)
  + r(6, 46, 68, 40, G.w, EDGE) + Array.from({ length: 9 }, (_, i) => line(`M${11 + i * 7} 47q4 10 0 20t0 17`, G.m, 2.5)).join("")
  + `<path d="M-14 92 Q40 66 96 92Z" fill="${G.w}" ${EDGE}/>` + line("M0 88l14 -6M24 88l10 -10M48 86l12 -6M66 88l10 -3", G.m, 2));
/** The trolley; `full` also carries the tied box, else its place on top is empty. */
const trolley = (x, y, s, full) => at(x, y, s, line("M0 0H140M0 0L-14 -70", G.d, 5) + `<circle cx="24" cy="12" r="10" fill="${G.d}"/><circle cx="116" cy="12" r="10" fill="${G.d}"/>`
  + box(4, -46, 46, 44) + box(52, -46, 42, 44, G.m) + box(96, -46, 42, 44) + box(8, -86, 42, 38, G.m) + (full ? tied(90, -90, 48, 42) : ""));

/** A limb drawn as a thick stroke with a dark edge. */
const limb = (d, f, w) => line(d, G.d, w + 4) + line(d, f, w);

/** An open hand held out flat, fingers to the left (asking for something). */
const palm = (x, y, f) => r(x, y - 13, 30, 26, f, `rx="9" ${EDGE}`) + limb(`M${x + 2} ${y - 8}l-20 -5M${x} ${y}h-24M${x + 2} ${y + 8}l-20 5`, f, 6)
  + limb(`M${x + 16} ${y - 12}l-6 -14`, f, 6);

const FINGERS = "M90 88L122 62M96 94L136 84M96 102L134 110M90 110L120 132M76 82L88 50";
const ART = {
  cart: () => floor() + trolley(34, 176, 1.05, true) + shredder(216, 96, 0.98),
  lift: () => floor() + shredder(236, 108, 0.82) + trolley(124, 176, 0.72, false)
    + at(78, 204, 1.5, body(G.k)) + tied(14, 106, 62, 52) + limb("M86 126L54 152", G.m, 15) + fist(50, 154, 0),
  // Tín keeps the box on his far side. Chị Hằng stands at the right, a whole figure (a lone hand coming in from the edge
  // belongs to the letter's writer alone), her open hand out for the box; the shredder waits behind her.
  refuse: () => floor() + shredder(262, 100, 0.72)
    + at(244, 204, 1.45, body(G.m)) + limb("M226 122L190 128", G.m, 13) + palm(178, 128, G.l)
    + at(96, 204, 1.5, body(G.k)) + tied(4, 108, 66, 56) + limb("M84 126L60 142", G.k, 15) + fist(58, 144, 0),
  van: () => r(0, 0, 320, 220, G.p) + r(0, 178, 320, 42, G.l) + r(112, 18, 150, 150, G.k, EDGE) + r(126, 32, 122, 120, G.d)
    + `<path d="M112 18L70 32V178L112 168ZM262 18L304 32V178L262 168Z" fill="${G.m}" ${EDGE}/><circle cx="134" cy="176" r="14" fill="${G.d}"/><circle cx="240" cy="176" r="14" fill="${G.d}"/>`
    + box(128, 36, 58, 56) + box(188, 36, 58, 56, G.m) + box(128, 94, 58, 56, G.m) + r(190, 96, 54, 52, "none", `stroke="${G.w}" stroke-width="3" stroke-dasharray="6 5"`)
    + tied(14, 150, 68, 56) + r(54, 164, 34, 42, G.w, EDGE) + line("M60 176h20M60 186h20M60 196h12", G.m, 2),
  // The striped cuff comes in from the left here and in "apart": the same arm, so the same person.
  writing: () => r(0, 0, 320, 220, G.m) + sheet(126, 18, 150, 184, 4) + cuff(100, 164, 146, 160)
    + line("M202 102L134 142", G.d, 7) + fist(122, 150, -34, G.w),
  apart: () => r(0, 0, 320, 220, G.p) + [[168, 0.8], [300, 0.8]].map(([x, s]) => at(x, 92, s, body(G.l))).join("")
    + [200, 248, 298].map((x, i) => at(x, 216, 1.75 + (i % 2) * 0.12, body(G.k))).join("")
    + child(232, 208, 1.02) + limb("M220 150L178 134", G.w, 9)
    + line("M190 190H154M196 176H166M188 204H146", G.d, 3)
    + cuff(64, 96, 180, 150) + limb("M66 96H88", G.w, 30) + limb(FINGERS, G.w, 10) + line("M70 96H88", G.w, 26),
  glass: () => floor() + r(16, 128, 78, 8, G.d) + line("M26 136V196M84 136V196", G.d, 5)
    + [22, 46, 70].map((x) => `<path d="M${x} 104h16l-3 23h-10Z" fill="${G.w}" ${EDGE}/>`).join("")
    + at(138, 200, 1.35, body(G.k) + hat(G.l)) + limb("M156 124L190 138", G.k, 12)
    + child(258, 200, 0.86) + limb("M246 148L214 142M250 156L214 153", G.w, 7)
    + `<path d="M188 120h26l-5 38h-16Z" fill="${G.w}" ${EDGE}/><path d="M190 134h22l-3 24h-16Z" fill="${G.l}"/>`,
  // The child's other hand is taken by a hand that comes in from outside the frame: someone we never see.
  giver: () => floor() + at(84, 204, 1.45, body(G.k) + hat(G.l)) + limb("M104 124L138 158", G.k, 12)
    + child(164, 204, 0.82) + limb("M152 156L140 159M176 156L189 159", G.w, 7)
    + limb("M330 150L206 158", G.l, 14) + fist(199, 159, 4, G.l),
  slip: () => r(0, 0, 320, 220, G.k) + r(150, 10, 162, 124, G.p, EDGE) + trolley(176, 116, 0.5, false) + shredder(258, 78, 0.5)
    + r(0, 176, 320, 44, G.d) + tied(24, 82, 136, 110) + r(72, 98, 78, 88, G.w, EDGE) + r(98, 90, 26, 14, G.m, EDGE)
    + [120, 138, 156, 174].map((y) => line(`M84 ${y}h54`, G.l, 2, `stroke-dasharray="4 5"`)).join(""),
};

export const PANEL_IDS = Object.keys(ART);

/** SVG markup of a panel (decorative here: the caller gives the description). */
export function panelMarkup(id) {
  return `<svg viewBox="0 0 320 220" aria-hidden="true" focusable="false">${ART[id] ? ART[id]() : ""}</svg>`;
}

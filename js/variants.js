// Versions of the opening, chosen by ?v= in the address: "a" (default) the episode as it is; "b" the short text;
// "c" the same short text with grey panels. Each version keeps its own saved progress.

/** The version asked for in the address; anything unknown is "a". */
export function pickVariant(search) {
  let v = null;
  try { v = new URLSearchParams(search || "").get("v"); } catch { /* bad query */ }
  return v === "b" || v === "c" ? v : "a";
}

/** The opening beat to show: the one saved (a reload comes back to it), kept inside the beats there are. */
export function introStep(ep, state) {
  const n = ep.introBeats?.length || 0;
  const k = Math.floor(Number(state?.intro)) || 0;
  return n ? Math.min(Math.max(k, 0), n - 1) : 0;
}

/**
 * How a story card sits around the slip's own moment: "moment" for its first lines (the slip shown on its own, the rest
 * dimmed), "beside" for the lines that follow (they talk about the slip, so the card moves to the top and leaves the
 * slip and its bar in sight), null for any other card.
 */
export function arrivalPlace(ep, lines) {
  const said = (ep.slip?.arrive || []).map((l) => l[1]);
  if (!lines?.length || !said.length) return null;
  if (lines[0][1] === said[0]) return "moment";
  return lines.some((l) => said.includes(l[1])) ? "beside" : null;
}

/**
 * Tín's line on how the player's guess went, said once the guessed-about slip line is written right; null otherwise.
 * The guess itself never counts for anything: it only changes this one line.
 */
export function guessAck(ep, state, id, result) {
  const g = ep.guess;
  if (!g || result !== "ok" || id !== g.line || state.guess == null) return null;
  return ["Tín", g.ack[state.guess] ?? g.ack.unsure];
}

/** A copy of the episode with the short opening laid over it. Version "a" gets the episode itself, untouched. */
export function applyVariant(ep, short, v) {
  if (v === "a") return ep;
  const noPanel = (list) => list.filter((b) => v === "c" || b.t !== "panel");
  const label = ep.objects.label;
  const beats = v === "b" && short.introB ? short.introB : short.intro;
  const threads = ep.threads.map((x) => x.id !== ep.clerkThread ? x
    : { ...x, messages: [{ ...x.messages[0], text: short.clerkFirst }, ...x.messages.slice(1)] });
  return {
    ...ep,
    variant: v,
    storageKey: ep.storageKey + "." + v,
    codePrefix: ep.codePrefix.replace(/-$/, v.toUpperCase() + "-"),
    // The opening in beats, each with its lines and the button that moves on; `intro` keeps the plain words said.
    // Version B may tell the opening in its own beats (`introB`): words and the player's acts stand in for the panels.
    intro: beats.flatMap((x) => x.lines.map((line) => line[1])),
    // `lead`: one line just above the act button, saying the act is the player's to do (not part of the story text).
    introBeats: beats.map((x) => ({ lines: x.lines, act: x.act || null, lead: x.lead || null })),
    introPanels: v === "c" ? short.intro.map((x) => x.panel) : null,
    seenAtStart: short.seenAtStart,
    howTo: short.howTo,
    panelAlt: short.alt,
    // The desk shows only what the story has given a reason to look at: no greyed "not needed yet" objects.
    hideDim: true,
    bubbles: short.bubbles,
    // One more note between "read the letter" and the slip: the player folds the letter, and only then the slip appears.
    todo: ep.todo.map((e, i) => (short.todo[i] ? { ...e, text: short.todo[i] } : e))
      .flatMap((e, i) => (i === 1 ? [e, { need: ["read:label", "read:letter:" + short.letter.length], target: "letter", text: short.foldTodo }] : [e])),
    threads,
    objects: {
      ...ep.objects,
      label: { ...label, blocks: [...label.blocks.slice(0, -1), { ...label.blocks.at(-1), text: short.labelLast }] },
      // An object may come to the desk later than in the default (`lit`: the flags that bring it).
      ...Object.fromEntries(Object.entries(short.lit || {}).map(([id, lit]) => [id, { ...ep.objects[id], lit }])),
      // The province table may carry its own name in a short version (so it is not mixed up with the slip).
      provinces: { ...ep.objects.provinces, title: short.provincesTitle || ep.objects.provinces.title },
      letter: { ...ep.objects.letter, parts: short.letter.map(noPanel), full: ep.objects.letter.parts, fold: short.fold },
    },
    // Chị Hằng's note on the table, read right under its title instead of at its foot (rows and columns as they are).
    provinces: short.yearNote ? {
      ...ep.provinces,
      head: [ep.provinces.head[0], ...ep.provinces.foot.map((b) => ({ ...b, text: short.yearNote })), ...ep.provinces.head.slice(1)],
      foot: [],
    } : ep.provinces,
    // A guess asked before the province table first shows (never scored; see guessAck).
    guess: short.guess || null,
    // `stagesSaid`: what the three stages are, said where the slip first shows (no answer in it).
    slip: { ...ep.slip, arrive: short.arrive, arrivePanel: v === "c" ? short.slipPanel : null, stagesSaid: short.stagesSaid },
  };
}

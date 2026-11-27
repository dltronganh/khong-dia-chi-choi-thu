// The episode loop: a three-stage forwarding slip, checked one line at a time. Pure (no DOM), unit tested.
// Stages come from ep.slip.stages; a stage opens when every line of the one before is right. A right line plays a
// story beat (answers.beats[id]) and may open the next stage; a wrong one gets a line of its own and costs nothing.
// A beat line is [who, text] or [who, text, target]: a target turns the card's button into a way there (todoEntry).
import { checkField } from "./answer.js";
import { setFlag } from "./flow.js";
import { normalizeText } from "./text.js";

/** Number of the stage being worked on: 0 = no slip yet, 1..n = open stage, n + 1 = every line done. */
export function stageNo(ep, state) {
  if (state.flags.slip == null) return 0;
  const i = ep.slip.stages.findIndex((s) => s.lines.some((id) => !state.done[id]));
  return i < 0 ? ep.slip.stages.length + 1 : i + 1;
}

/** Lines the player can fill now (lines filled by the story, `auto`, never count). */
export function openLines(ep, state) {
  const n = stageNo(ep, state);
  if (n < 1 || n > ep.slip.stages.length) return [];
  return ep.slip.stages[n - 1].lines.filter((id) => !state.done[id] && !fieldOf(ep, id).auto);
}

export function fieldOf(ep, id) {
  return ep.slip.fields.find((f) => f.id === id);
}

/**
 * Tín's sticky note: the last entry whose flags are all set, as { text, target }. `target` says where the note's
 * button goes: an object id ("label", "provinces"), "phone:<thread>", or "act:<action>" ("act:post:group", "act:send").
 */
export function todoEntry(ep, flags) {
  let hit = null;
  for (const e of ep.todo) if (e.need.every((f) => flags[f] != null)) hit = e;
  return hit ? { text: hit.text, target: hit.target || null } : { text: "", target: null };
}

export function todoText(ep, flags) {
  return todoEntry(ep, flags).text;
}

/** True when an object on the desk is lit: no `lit`, or any of its flags is set. */
export function isLit(o, flags) {
  return !o.lit || [].concat(o.lit).some((f) => flags[f] != null);
}

/** Every line is right, the parcel waits for the player to press "Send" (sendParcel). */
export function readyToSend(ep, state) {
  return stageNo(ep, state) > ep.slip.stages.length && !state.delivered;
}

/** The player presses "Send": the boss signs, the tag is cut. Returns the beat lines (empty if already sent). */
export function sendParcel(ep, ans, state, now) {
  if (!readyToSend(ep, state)) return [];
  state.delivered = true; state.deliveredAt = now;
  setFlag(state.flags, "delivered", now);
  return [...(ans.beats.signed || [])];
}

/** True when the action a target stands for has already been done ("act:post:<thread>", "act:send"). */
export function actionDone(ep, state, target) {
  if (target === "act:send") return !!state.delivered;
  if (!target?.startsWith("act:post:")) return false;
  const th = ep.threads.find((x) => x.id === target.slice(9));
  return !!th?.post && state.flags[th.post] != null;
}

/** Lines of a beat still worth saying: an invitation to do something already done is dropped. */
export function liveLines(ep, state, lines) {
  return lines.filter((l) => !actionDone(ep, state, l[2]));
}

/** A tapped word in the episode's own spelling (the taps list entry), or the word as it is. */
export function tapWord(ep, word) {
  const w = normalizeText(word);
  for (const list of Object.values(ep.taps)) { const hit = list.find((x) => normalizeText(x) === w); if (hit) return hit; }
  return word;
}

/** The kind of a tappable word ("province", "name", ...), or null. */
export function kindOf(ep, word) {
  const w = normalizeText(word);
  for (const [kind, list] of Object.entries(ep.taps)) if (list.some((x) => normalizeText(x) === w)) return kind;
  return null;
}

const cache = new Map();
function tapRegex(ep, kinds) {
  const key = ep.storageKey + "|" + kinds.join(",");
  if (!cache.has(key)) {
    const words = kinds.flatMap((k) => ep.taps[k] || []).sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    cache.set(key, words.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${words.join("|")})(?![\\p{L}\\p{N}])`, "giu") : null);
  }
  return cache.get(key);
}

/**
 * Splits a text into plain parts and tappable words of the given kinds: [{ text }, { text, kind }, ...].
 * Case is ignored ("Bà Ga" matches "bà Ga"); a word only matches whole (no "Ga" inside "Giang").
 */
export function splitTaps(ep, text, kinds) {
  const re = kinds.length ? tapRegex(ep, kinds) : null;
  if (!re) return [{ text }];
  const out = [];
  let last = 0;
  re.lastIndex = 0;
  for (let m; (m = re.exec(text));) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], kind: kindOf(ep, m[0]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Kinds of the lines open now: the words worth making tappable. */
export function openKinds(ep, state) {
  return [...new Set(openLines(ep, state).map((id) => fieldOf(ep, id).kind))];
}

/**
 * Writes `value` on line `id` and checks it. Updates state (slip, done, wrongs, flags) and returns
 * { result: "ok" | "near" | "wrong" | "empty", beats: [[who, text], ...], finished }.
 */
export function applyAnswer(ep, ans, state, id, value, now) {
  const def = ans.fields[id];
  const r = checkField(def, value);
  if (r.result === "empty") return { result: "empty", beats: [], finished: false };
  if (r.result !== "ok") {
    state.wrongs[id] = (state.wrongs[id] || 0) + 1;
    return { result: r.result, beats: [["Tín", r.result === "near" ? r.msg : def.miss]], finished: false, wrongs: state.wrongs[id] };
  }
  const beats = [];
  const done = (lineId, text) => {
    state.slip[lineId] = text; state.done[lineId] = true;
    setFlag(state.flags, "ok:" + lineId, now);
    setFlag(state.flags, "firstOk", now);
    beats.push(...(ans.beats[lineId] || []));
  };
  // A right line shows its standard form ("Bà Ga", not what was typed: "ba ga"), when the answer file gives one.
  done(id, def.canon ?? value);
  if (stageNo(ep, state) >= 2) setFlag(state.flags, "stage:2", now);
  if (stageNo(ep, state) >= 3 && setFlag(state.flags, "stage:3", now)) beats.push(...(ans.beats.stage3 || []));
  // Lines the story fills by itself once the line before them is right (the province of the delivery place).
  for (const f of ep.slip.fields) {
    const stage = ep.slip.stages.find((s) => s.lines.includes(f.id));
    if (f.auto && !state.done[f.id] && stage.lines.every((x) => x === f.id || state.done[x])) done(f.id, ans.autoD);
  }
  // Every line right: the slip is full, and the parcel waits for the player to press "Send" (sendParcel).
  const finished = stageNo(ep, state) > ep.slip.stages.length;
  if (finished && setFlag(state.flags, "slip:full", now)) beats.push(...(ans.beats.ready || []));
  return { result: "ok", beats, finished };
}

/** Hint log tiers besides 1..3: the clerk rewords his last hint, repeats it, or says what to read first. */
export const REWORDED = 4;
export const REPEATED = 5;
export const PRE_HINT = 8;
/**
 * Tiers 6 and 7 are tiers 1 and 2 said another way, while something the usual hint mentions has not been shown yet
 * (answers.hintsEarly[id] = { until: flag, hints: [tier 1, tier 2] }): a hint never quotes a message not yet arrived.
 */
export const EARLY = 6;

/** The real tier (1..3) an ask counts as, or 0 for asks that use up nothing. */
export function realTier(tier) {
  if (tier >= 1 && tier <= 3) return tier;
  if (tier === EARLY || tier === EARLY + 1) return tier - EARLY + 1;
  return 0;
}

/** The tier the clerk answers with when asked about line `id` now. */
export function nextHintTier(ans, state, id) {
  const pre = ans.hintsPre?.[id];
  if (pre && state.flags[pre.needs] == null) return PRE_HINT;
  const asked = state.hints[id] || 0;
  const early = ans.hintsEarly?.[id];
  if (asked < 3 && early && state.flags[early.until] == null && asked < early.hints.length) return EARLY + asked;
  if (asked < 3) return asked + 1;
  const repeats = state.hintLog.filter(([f, t]) => f === id && (t === REWORDED || t === REPEATED)).length;
  return repeats % 2 === 0 ? REWORDED : REPEATED;
}

/** Records one ask in the state (the hint log is what the phone shows). */
export function recordHint(state, id, tier) {
  state.hintLog.push([id, tier]);
  if (realTier(tier)) state.hints[id] = Math.max(state.hints[id] || 0, realTier(tier));
}

/**
 * The clerk's replies, one per ask in the log. Never word for word the same as an earlier reply without saying so:
 * a repeated "read this first" starts with clerk.again; past tier 3 he rewords, then repeats with clerk.again.
 */
export function hintReplies(ep, ans, hintLog) {
  const said = new Set();
  return hintLog.map(([id, tier]) => {
    let text;
    if (tier === PRE_HINT) text = ans.hintsPre[id].text;
    else if (tier === REWORDED) text = ep.clerk.reworded + ans.hintsAgain[id];
    else if (tier === REPEATED) text = ep.clerk.again + ans.hints[id][2];
    else if (tier === EARLY || tier === EARLY + 1) text = ans.hintsEarly[id].hints[tier - EARLY];
    else text = ans.hints[id][tier - 1];
    if (tier === PRE_HINT && said.has(text)) text = ep.clerk.again + text;
    else said.add(text);
    return text;
  });
}

// Saved progress of one episode in the browser (localStorage). The game must still work when storage is blocked
// (private mode, previews), so every access is wrapped and failures fall back to memory only.
import { realTier } from "./loop.js";

/** A brand new game. */
export function fresh() {
  return {
    v: 2,
    started: false,
    intro: 0,         // short versions: the opening beat on screen (0-based), so a reload comes back to it
    opened: {},       // objectId -> true once read
    flags: {},        // event name -> first time (ms), see js/flow.js
    readCount: {},    // threadId -> number of messages the player has seen (for the unread badge)
    terms: [],        // notebook words, in the order found
    notes: "",        // free notebook text
    slip: {},         // fieldId -> value written on the slip line (right ones only stay)
    done: {},         // fieldId -> true once the line is right
    wrongs: {},       // fieldId -> wrong tries
    letterPart: 0,    // letter parts read (0..3); the slip appears after the last
    reading: null,    // short versions: "letter" while the letter is open, so a reload opens it again at the part reached
    beats: [],        // story lines shown but not yet dismissed ([who, text] pairs): a reload shows them again
    why: null,        // feedback builds (?pt=1): why the player thinks the slip must be filled, asked before it appears
    hints: {},        // fieldId -> real hint tiers given (0..3)
    hintLog: [],      // [fieldId, tier] in the order asked (js/loop.js tiers; the replies show in the phone)
    lookups: [],      // ledger queries typed (last 20)
    eggs: {},         // easter egg id -> true
    delivered: false,
    startedAt: null,
    deliveredAt: null,
  };
}

/** Saved data read back: fields added later take their defaults; anything unreadable starts fresh. */
export function migrate(data) {
  return data && typeof data === "object" && data.v === 2 ? { ...fresh(), ...data } : fresh();
}

/** Storage wrapper: `backend` is localStorage in the game, a fake in tests. */
export function makeStore(key, backend) {
  const state = fresh();
  return {
    state,
    load() {
      let data = null;
      try { const raw = backend?.getItem(key); if (raw) data = JSON.parse(raw); } catch { /* blocked or corrupt */ }
      Object.keys(state).forEach((k) => delete state[k]);
      Object.assign(state, migrate(data));
      return state;
    },
    save() {
      if (!backend) return false;
      try { backend.setItem(key, JSON.stringify(state)); return true; } catch { return false; }
    },
    reset() {
      try { backend?.removeItem(key); } catch { /* ignore */ }
      Object.keys(state).forEach((k) => delete state[k]);
      Object.assign(state, fresh());
    },
  };
}

/** localStorage, or null when even touching it throws. */
export function browserStorage() {
  try { return window.localStorage; } catch { return null; }
}

/** Adds words to the notebook (no duplicates, ignoring upper / lower case: "Ga Huế" = "ga Huế"). Returns the words that were new. */
export function addTerms(state, words) {
  const added = [];
  const same = (a, b) => a.toLocaleLowerCase("vi") === b.toLocaleLowerCase("vi");
  for (const w of words || []) if (!state.terms.some((x) => same(x, w))) { state.terms.push(w); added.push(w); }
  return added;
}

// ---------- progress code (Safari may wipe localStorage after 7 days without a visit) ----------
// Each language has its own prefix (episode content `codePrefix`): notebook words are indices into that
// language's vocabulary, so a code only loads in the language that made it.
const CODE_PREFIX = "KDC2-";

/**
 * A short text the player can copy and paste back later. Only what cannot be rebuilt is kept: story flags (names
 * only: every flag becomes "long ago", so delayed messages are already there after an import), notebook words as
 * indices into `vocab` (all words the episode can give), slip values and the hint log.
 * Opened objects, eggs, right lines, letter parts, "started" and "delivered" are rebuilt from the flags. Free notes are not included.
 */
export function exportCode(state, vocab, prefix = CODE_PREFIX) {
  const data = {
    f: Object.keys(state.flags),
    t: state.terms.map((w) => vocab.indexOf(w)).filter((n) => n >= 0),
    s: state.slip,
    h: state.hintLog.map(([f, tier]) => f + tier).join(""),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return prefix + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Reads a progress code back into a full state, or null when the code is not valid. */
export function importCode(code, vocab, prefix = CODE_PREFIX) {
  try {
    const s = String(code || "").trim();
    if (!s.startsWith(prefix)) return null;
    const b64 = s.slice(prefix.length).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64 + "===".slice((b64.length + 3) % 4)), (c) => c.charCodeAt(0));
    const d = JSON.parse(new TextDecoder().decode(bytes));
    if (!d || !Array.isArray(d.f)) return null;
    const st = fresh();
    d.f.forEach((name) => {
      if (typeof name !== "string") return;
      st.flags[name] = 0;
      if (/^read:[a-z]+$/i.test(name)) st.opened[name.slice(5)] = true;
      if (name.startsWith("ok:")) st.done[name.slice(3)] = true;
      const part = name.match(/^read:letter:(\d)$/);
      if (part) st.letterPart = Math.max(st.letterPart, Number(part[1]));
    });
    st.started = "start" in st.flags;
    st.delivered = "delivered" in st.flags;
    if (st.opened.twig) st.eggs.twig = true;
    if (Array.isArray(d.t)) st.terms = d.t.map((n) => vocab[n]).filter(Boolean);
    if (d.s && typeof d.s === "object") for (const [k, v] of Object.entries(d.s)) if (typeof v === "string") st.slip[k] = v;
    for (const [, f, tier] of String(d.h || "").matchAll(/([A-Z])(\d)/g)) {
      st.hintLog.push([f, Number(tier)]);
      // Only real hint tiers use up a hint (reworded, repeated and "read this first" do not; js/loop.js realTier).
      if (realTier(Number(tier))) st.hints[f] = Math.max(st.hints[f] || 0, realTier(Number(tier)));
    }
    return st;
  } catch { return null; }
}

/** Every notebook word an episode can give, in a fixed order (the progress code stores indices into it). */
export function episodeVocab(ep) {
  const out = [];
  const add = (list) => (list || []).forEach((w) => { if (!out.includes(w)) out.push(w); });
  Object.entries(ep.objects).forEach(([id, o]) => { add(o.terms); add(ep[id]?.terms); });
  ep.ledger.entries.forEach((e) => add(e.terms));
  ep.threads.forEach((t) => t.messages.forEach((m) => { add(m.terms); add(m.backTerms); }));
  Object.values(ep.taps || {}).forEach(add);  // words tapped onto the slip also land in the notebook
  return out;
}

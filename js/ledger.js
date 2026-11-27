// Keyword search in the old clerk's ledger ("sổ nhập kho"). Pure, unit tested.
// The ledger is the game's lookup tool (no fixed path): the player types a place, province, item or parcel number.
// Lenient: accents, case and spaces ignored; small typos allowed on longer words.
import { normalizeText, editDistance, typoBudget } from "./text.js";

/** True when a normalized query hits one normalized keyword. */
export function keyMatches(q, key) {
  if (!q || !key) return false;
  if (q === key) return true;
  // A query that contains a whole keyword ("ben pha can tho" contains "cantho"), or a keyword that starts with the query.
  if (key.length >= 3 && q.includes(key)) return true;
  if (q.length >= 3 && key.startsWith(q)) return true;
  const budget = typoBudget(Math.min(q.length, key.length));
  return budget > 0 && editDistance(q, key, budget) <= budget;
}

/** Entries matching the query, in ledger order. An empty query finds nothing. */
export function searchLedger(entries, query) {
  const q = normalizeText(query);
  if (!q) return [];
  return entries.filter((e) => e.keys.some((k) => keyMatches(q, normalizeText(k))));
}

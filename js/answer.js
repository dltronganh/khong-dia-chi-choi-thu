// Checking one line of the forwarding slip ("phiếu chuyển tiếp"). Pure: no DOM, no storage. Unit tested.
// The answers come from the episode's answers.js (lightly obfuscated, see decode below). Shape of one field:
//   { type: "text", accept: ["Cần Thơ", ...], near: [{ values: ["Hậu Giang"], msg: "..." }] }
//   { type: "text", ..., words: [["ga"], ["da lat", "dalat"]], not: ["trai mat"] }
//     (every group needs one phrase as whole words, and no `not` phrase may appear)
//   { type: "number", accept: [2010, 2010], near: [{ values: [2011], msg: "..." }] }
// Every field also has `miss`: the line said for a wrong answer that is not a known near miss (js/loop.js).
// Optional `canon`: the standard form written on the slip once the line is right ("Bà Ga" for a typed "ba ga").
import { normalizeText, parseYear, wordsOf, hasPhrase } from "./text.js";

/** Result of one field: "empty", "ok", "near" (with msg) or "wrong". */
export function checkField(def, value) {
  if (def.type === "number") {
    const n = parseYear(value);
    if (Number.isNaN(n)) return normalizeText(value) ? { result: "wrong" } : { result: "empty" };
    if (n >= def.accept[0] && n <= def.accept[1]) return { result: "ok" };
    const near = (def.near || []).find((r) => r.values.includes(n));
    return near ? { result: "near", msg: near.msg } : { result: "wrong" };
  }
  const v = normalizeText(value);
  if (!v) return { result: "empty" };
  if (def.accept.some((a) => normalizeText(a) === v)) return { result: "ok" };
  // Optional word rule: every group needs one of its phrases as whole words ("ga xe lửa Đà Lạt").
  // `not` lists phrases that make the answer wrong even when the word groups match ("Cần Thơ, Hậu Giang").
  if (def.words) {
    const w = wordsOf(value);
    const banned = (def.not || []).some((p) => hasPhrase(w, p));
    if (!banned && def.words.every((group) => group.some((p) => hasPhrase(w, p)))) return { result: "ok" };
  }
  const near = (def.near || []).find((r) => r.values.some((x) => normalizeText(x) === v));
  return near ? { result: "near", msg: near.msg } : { result: "wrong" };
}

/**
 * Reverses the light obfuscation of tools/encode_answers.ps1 (UTF-8 bytes XOR key, then base64).
 * Not security: it only keeps answers from being read at a glance in the page source.
 */
export function decode(b64, key) {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const k = new TextEncoder().encode(key);
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= k[i % k.length];
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Text helpers shared by answer checking and ledger search. Pure functions, unit tested (tests/tests.js).

/** Lower-case letters and digits only, Vietnamese accents removed (đ → d), for lenient comparison. */
export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Levenshtein distance, stopping early once it is certainly above `max`. */
export function editDistance(a, b, max = Infinity) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Typos allowed for a normalized word of this length: none below 4 letters, one up to 7, two from 8. */
export function typoBudget(length) {
  return length < 4 ? 0 : length < 8 ? 1 : 2;
}

/** A year typed by the player: the last 4-digit number ("24.4.2010" → 2010, "năm 2010" → 2010), else the first number. */
export function parseYear(value) {
  const nums = String(value ?? "").match(/\d+/g);
  if (!nums) return NaN;
  const four = nums.filter((n) => n.length === 4);
  return Number(four.length ? four[four.length - 1] : nums[0]);
}

/** Words of a text, accents removed, lower case ("Ga Đà Lạt!" → ["ga", "da", "lat"]). */
export function wordsOf(value) {
  return String(value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d")
    .toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

/** True when the words of `phrase` appear consecutively in `words`. */
export function hasPhrase(words, phrase) {
  const p = wordsOf(phrase);
  for (let i = 0; i + p.length <= words.length; i++) if (p.every((w, j) => words[i + j] === w)) return true;
  return false;
}

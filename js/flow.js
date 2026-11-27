// Story flags: which phone threads and messages have arrived. Pure, unit tested.
// Events set flags in the saved state as timestamps (ms), e.g. flags["read:label"] = 1732... .
// A thread or message lists conditions; it is visible when ANY of them holds: [{ flag: "ok:E" }, ...].
// No conditions (or an empty list) = visible from the start. Nothing arrives on a timer: every message follows
// something the player did.

/** True when one of the conditions holds for these flags. */
export function conditionsMet(when, flags) {
  if (!when || when.length === 0) return true;
  return when.some((c) => flags[c.flag] != null);
}

/** Threads that have started, each with the messages that have arrived so far. */
export function visibleThreads(threads, flags) {
  return threads
    .filter((t) => conditionsMet(t.when, flags))
    .map((t) => ({ ...t, messages: t.messages.filter((m) => conditionsMet(m.when, flags)) }));
}

/** Sets a flag once (keeps the first time). Returns true when it is new. */
export function setFlag(flags, name, now) {
  if (flags[name] != null) return false;
  flags[name] = now;
  return true;
}

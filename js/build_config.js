// Build settings. The repo copy keeps every switch off; tools/publish_pages.ps1 -Feedback turns `feedback` on in the
// copy it publishes (it rewrites the line below, so keep it exactly "feedback: false,").
export const BUILD = {
  feedback: true,
};

/**
 * Whether the feedback questions are on: the "why fill in the slip" question before the slip appears and the
 * timings in the notebook. `?pt=1` forces them on, `?pt=0` forces them off, otherwise the build setting decides.
 */
export function feedbackMode(search, build = BUILD) {
  let v = null;
  try { v = new URLSearchParams(search || "").get("pt"); } catch { /* bad query */ }
  if (v === "1") return true;
  if (v === "0") return false;
  return !!build.feedback;
}

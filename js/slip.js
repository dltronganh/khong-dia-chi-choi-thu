// The forwarding slip: three stages along the recipient's life (1996 → leaving the ferry → 2026), checked one line at
// a time (js/loop.js). The slip bar at the bottom of every screen shows the open line(s) and the "ask" button; the
// Slip tab shows the whole slip. Also the delivery scene (story layer 3: comic frames).
import { h, svg, mount } from "./dom.js";
import { photoDalat } from "./art.js";
import { openLines, stageNo, fieldOf, kindOf, readyToSend } from "./loop.js";
import { todoNote } from "./desk.js";
import { t } from "./i18n.js";

/**
 * The bar above the tabs (or at the bottom of an open document): what is being filled in now. One row and one "ask"
 * button (N7): when two lines are open they show as two chips, and the ask button follows the chosen chip.
 * Once every line is right the bar holds the "Send" button instead (N6).
 */
export function renderSlipBar(game, host) {
  const { ep, state } = game;
  if (state.started && readyToSend(ep, state)) {
    host.hidden = false;
    mount(host, h("div.inner.ready",
      h("p.bar-head", t("sendHead")),
      h("div.bar-line", h("span.bar-label", h("span", t("sendSub"))),
        h("button.btn.send", { type: "button", onclick: () => game.send() }, t("send")))));
    return;
  }
  const open = state.started ? openLines(ep, state) : [];
  host.hidden = open.length === 0;
  if (!open.length) { mount(host); return; }
  const n = stageNo(ep, state);
  if (!open.includes(game.barLine)) game.barLine = open[0];
  const id = game.barLine;
  const f = fieldOf(ep, id);
  const pick = (x) => { game.barLine = x; renderSlipBar(game, host); };
  mount(host, h("div.inner",
    // A short version names the stage too ("Stage 1 of 3: 1996 · ferry"), so the count says what it counts.
    h("p.bar-head", `${t("filling")} · ${t("stage")(n, ep.slip.stages.length)}` + (ep.slip.stagesSaid && ep.slip.stages[n - 1] ? ": " + ep.slip.stages[n - 1].label : "")),
    open.length > 1 ? h("div.bar-chips", { role: "group" }, open.map((x) =>
      h("button.chip" + (x === id ? ".on" : ""), { type: "button", "aria-pressed": x === id ? "true" : "false", onclick: () => pick(x) }, fieldOf(ep, x).short))) : null,
    h("div.bar-line",
      h("button.bar-label", { onclick: () => game.go("slip") }, h("b", f.label), h("span", t("kindHint")[f.kind])),
      h("button.btn.small.ask" + (game.blink === id ? ".blink" : ""), { onclick: () => game.askHint(id) }, askLabel(ep)))));
}

/** "Ask Ông Thuận"; a short version also says on the button who he is. */
function askLabel(ep) {
  return ep.variant ? [t("askClerk"), h("small.ask-who", t("askClerkWho"))] : t("askClerk");
}

export function renderSlip(game, view) {
  const { ep, state } = game;
  if (state.flags.slip == null) { mount(view, todoNote(game), h("h2", ep.slip.title), h("p.hint-line", ep.slip.notYet)); return; }
  const n = stageNo(ep, state);
  const open = openLines(ep, state);
  mount(view,
    todoNote(game),
    h("div.paper.slip",
      h("h2.slip-title", ep.slip.title),
      recipientCard(game),
      h("ol.stages", ep.slip.stages.map((s, i) => h("li" + (i + 1 < n ? ".done" : i + 1 === n ? ".now" : ".later"),
        h("span.dot", i + 1 < n ? "✓" : String(i + 1)), h("span", stageLabel(game, s, i))))),
      ep.slip.stages.map((s, i) => h("div.stage" + (i + 1 > n ? ".later" : ""),
        s.lines.map((id) => line(game, fieldOf(ep, id), open.includes(id), i + 1 > n)))),
      readyToSend(ep, state) ? h("button.btn.send", { type: "button", onclick: () => game.send() }, t("send")) : null,
      state.delivered ? h("button.btn", { onclick: () => game.showEnding() }, t("reviewDelivery")) : null));
}

function stageLabel(game, s, i) {
  const st = game.state;
  if (i === 1) return (st.done.B ? st.slip.B.match(/\d{4}/)?.[0] ?? st.slip.B : "?") + " · " + s.label;
  if (i === 2) return s.label + " · " + (st.done.C ? st.slip.C : "?");
  return s.label;
}

/** Who the parcel is for: what the label says, then the name people used, then her photo. */
function recipientCard(game) {
  const { ep, state } = game;
  const name = state.done.E ? state.slip.E.replace(/^\p{Ll}/u, (c) => c.toUpperCase()) : ep.slip.recipient;
  const face = state.flags["read:photoBack"] != null ? svg(photoDalat(), "face") : h("div.silhouette", { "aria-hidden": "true" });
  return h("div.recipient", face, h("div", h("p.meta", ep.slip.recipientLabel), h("p.hand", name)));
}

function line(game, f, isOpen, later) {
  const { state } = game;
  if (state.done[f.id]) return h("div.line.done", h("p.meta", f.label), h("p.hand", h("span.ok", "✓ "), state.slip[f.id]));
  if (later || !isOpen) return h("div.line.later", h("p.meta", f.label), h("p", "… ", h("span.meta", t("later"))));
  const words = state.terms.filter((w) => kindOf(game.ep, w) === f.kind);
  const input = h("input", { placeholder: f.placeholder, autocomplete: "off", inputmode: f.numeric ? "numeric" : null, "aria-label": f.label });
  // Typing and pressing "Write it" is already a decision: no second "write it?" card (QA N-1). Tapped words still ask.
  const typed = h("form.search", { hidden: true, onsubmit: (e) => { e.preventDefault(); if (input.value.trim()) game.answer(f.id, input.value.trim()); } },
    input, h("button.btn.small", { type: "submit" }, t("write")));
  return h("div.line.open",
    h("p", h("b", f.label)),
    h("p.meta", t("kindHint")[f.kind]),
    h("p.meta", t("fromNotebook")),
    words.length ? h("div.chips", words.map((w) => h("button.chip", { type: "button", onclick: () => game.confirm(w, f.id) }, w))) : h("p.meta", t("noTerms")),
    h("div.row",
      h("button.btn.ghost.small.dark", { type: "button", onclick: () => { typed.hidden = !typed.hidden; if (!typed.hidden) input.focus(); } }, t("typeIt")),
      h("button.btn.small" + (game.blink === f.id ? ".blink" : ""), { type: "button", onclick: () => game.askHint(f.id) }, askLabel(ep))),
    typed);
}

/** The delivery scene, shown after the slip is signed. */
export function showEnding(game) {
  const e = game.ans.ending;
  game.openSheet(e.title, () => [
    e.frames.map((f, i) => h("div.frame",
      h("p.scene", `${t("frame")(i + 1)} ${f.scene}`),
      f.lines.map(([who, text]) => h("p", who ? h("b", who + ": ") : null, text)))),
    h("div.paper", e.after.map((x) => h("p", x)), h("p.hand", e.ledgerLine)),
    h("div.shelf", game.ep.shelf.delivered),
    h("div.intro", h("p", e.next)),
    h("button.btn", { onclick: () => game.go("desk") }, t("toDesk")),
  ], null, "ending");
}

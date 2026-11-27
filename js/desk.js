// The desk in the back room (story layer 1: objects) and the notebook.
// The parcel sits in the middle with its red tag; the other objects light up when the story gives a reason.
// Every object opens in the reading sheet; opening sets the flag "read:<id>" and adds its words to the notebook.
// Words that fit the open slip line can be tapped in any text (tx below).
import { h, svg, mount } from "./dom.js";
import { stationShape } from "./art.js";
import { panelMarkup } from "./panels.js";
import { searchLedger } from "./ledger.js";
import { exportCode, importCode, episodeVocab } from "./store.js";
import { splitTaps, openKinds, todoEntry, stageNo, isLit, readyToSend } from "./loop.js";
import { t } from "./i18n.js";

/** A text with the words that fit an open slip line turned into tap buttons. */
export function tx(game, text) {
  return splitTaps(game.ep, String(text), openKinds(game.ep, game.state)).map((p) => p.kind
    ? h("button.tap", { type: "button", onclick: (e) => { e.stopPropagation(); game.tap(p.text, p.kind); } }, p.text)
    : p.text);
}

/** The name on a sticky-note or beat button: the object or thread as it is named on screen, or the action itself. */
export function targetLabel(game, target) {
  if (target === "act:post:group") return t("postGroup");
  if (target === "act:send") return t("send");
  if (target === "ending") return t("reviewDelivery");
  if (target.startsWith("phone:")) return t("openThing")(game.ep.threads.find((x) => x.id === target.slice(6))?.name ?? t("phone"));
  return t("openThing")(game.ep.objects[target]?.title ?? target);
}

/** What on screen a target lives in: "phone", "box" (for the box items), an object id, or "send". */
export function goesTo(game, target) {
  if (!target) return null;
  if (target === "act:post:group" || target.startsWith("phone:")) return "phone";
  if (target === "act:send") return "send";
  if (target === "ending") return null;
  return game.ep.objects.box.children.includes(target) ? "box" : target;
}

/**
 * True when the player is already where the target points (the note then shows no button). Posting is an action, not a
 * place: its button stays on the note even inside the group, so it is in sight at the top on short screens (QA V-1).
 */
export function isHere(game, target) {
  if (target === "act:post:group") return false;
  if (game.sheetId && game.sheetId === target) return true;
  const th = target.startsWith("phone:") ? target.slice(6) : null;
  return !game.sheetId && game.tab === "phone" && th != null && game.thread === th;
}

/**
 * Tín's sticky note: what to do right now (never the answer), with a button to where it points (N1).
 * `slim`: the version on top of an open sheet (N2). It stays low, so the object stays readable on a small phone:
 * up to three lines of text, or one line plus the button. A tap on the text shows all of it.
 */
export function todoNote(game, slim = false) {
  const { text, target } = todoEntry(game.ep, game.state.flags);
  if (!text) return null;
  // "Send" has its own big button on the desk and in the slip bar: the note only says it.
  // One such button at a time: none on the desk while a sheet (with its own note) is open.
  const under = !slim && typeof document !== "undefined" && document.body.classList.contains("sheet-open");
  const go = target && target !== "act:send" && !isHere(game, target) && !under
    ? h("button.btn.small.note-go", { type: "button", onclick: () => game.goTarget(target) }, targetLabel(game, target) + " →")
    : null;
  if (!slim) return h("div.note", h("span.note-title", t("todoTitle")), h("p", text), go);
  const words = h("button.note-text", { type: "button", "aria-expanded": "false", onclick: () => {
    words.setAttribute("aria-expanded", String(words.classList.toggle("open")));
  } }, h("span", text));
  return h("div.note.slim" + (go ? ".with-go" : ""), words, go);
}

export function renderDesk(game, view) {
  const { ep, state } = game;
  const flags = state.flags;
  // The first messages of the boss and the clerk show here, on the desk, until the slip appears.
  let bubbles = null;
  if (flags.slip == null) {
    // A short version shows fewer (`bubbles`: [thread, how many]); the rest wait, unread, in the phone.
    const msgs = (ep.bubbles || [["boss", 2], [ep.clerkThread, 2]]).flatMap(([id, n]) => {
      state.readCount[id] = Math.max(state.readCount[id] || 0, n);
      return ep.threads.find((x) => x.id === id).messages.slice(0, n);
    });
    bubbles = h("div.chat.bubbles", msgs.map((m) => h("div.msg", h("span.who", m.from), m.text)));
    // A short version already said these in its opening: they wait in the phone as read.
    (ep.seenAtStart || []).forEach(([id, n]) => { state.readCount[id] = Math.max(state.readCount[id] || 0, n); });
    game.save();
  }
  const stage = stageNo(ep, state);
  const ready = readyToSend(ep, state);
  const aim = goesTo(game, todoEntry(ep, flags).target);
  // A short version puts the desk object the note points at right under the note, wide, so the slip bar at the bottom
  // of a small phone never sits over it (the parcel already sits there).
  const up = ep.variant && deskIds(game).includes(aim) ? aim : null;
  mount(view,
    todoNote(game),
    up ? tile(game, up, null, ".wide") : null,
    h("button.parcel" + (!state.opened.box || game.light === "box" ? ".new" : "") + (aim === "box" ? ".target" : ""), { onclick: () => openObject(game, "box") },
      aim === "box" && ep.variant ? h("small.aim-tag", t("aimTag")) : null,
      h("b", ep.objects.box.title), h("span", ep.objects.box.sub),
      h("span.tag" + (state.delivered ? ".go" : ""), state.delivered ? game.ans.tagGo : ep.boxTag)),
    // N6: a full slip waits for the player to press "Send"; the boss signs only then.
    ready ? h("button.btn.send", { type: "button", onclick: () => game.send() }, t("send")) : null,
    flags.slip != null ? h("button.tile.slip.wide", { onclick: () => game.go("slip") },
      h("b", ep.slip.title), h("span", stage <= ep.slip.stages.length ? t("stage")(stage, ep.slip.stages.length) : ready ? t("readySend") : t("reviewDelivery")),
      // A short version says what the stages are, until the first one is done.
      ep.slip.stagesSaid && stage === 1 ? h("span.stages-said", ep.slip.stagesSaid) : null) : null,
    bubbles,
    // `hideDim` (short versions): objects the story has not lit yet stay off the desk.
    ...deskTiles(game, up),
    // A short version asks its feedback question here, away from the end of the letter.
    game.pt && ep.variant && flags.slip != null && state.why == null ? h("div", { style: "margin-top:16px" }, whyBox(game, t("ptWhyDesk"), () => game.refresh())) : null);
}

/** The desk's title and its objects; nothing at all while a short version has no object to show yet. */
function deskTiles(game, skip = null) {
  const ids = deskIds(game).filter((id) => id !== skip);
  return ids.length ? [h("h2", game.ep.deskTitle), h("div.grid", ids.map((id) => tile(game, id)))] : [];
}

/** The desk objects on show (`hideDim`, short versions: only those the story has lit). */
function deskIds(game) {
  return game.ep.hideDim ? game.ep.desk.filter((id) => isLit(game.ep.objects[id], game.state.flags)) : game.ep.desk;
}

function tile(game, id, parent = null, extra = "") {
  const o = game.ep.objects[id];
  // `lit`: a flag, or a list of flags (any one lights it: the calendar after the photo, or once the place is right).
  const lit = isLit(o, game.state.flags);
  const fresh = !game.state.opened[id];
  const cls = !lit ? ".dim" : (fresh || game.light === id) && !(o.kind === "egg" || id === "gift") ? ".new" : "";
  // The object the sticky note points at gets a dashed outline (inside the box too).
  const aim = todoEntry(game.ep, game.state.flags).target === id ? ".target" : "";
  return h("button.tile.plain" + cls + aim + extra, { onclick: () => openObject(game, id, parent) },
    // A short version says what the outline means: the sticky note points here.
    aim && game.ep.variant ? h("small.aim-tag", t("aimTag")) : null,
    h("b", o.title), h("span", lit ? o.sub || "" : game.ep.dimLine));
}

/** Opens one object of the episode. Closing a box item goes back to the box (`parent`). */
export function openObject(game, id, parent = null) {
  const o = game.ep.objects[id];
  game.state.opened[id] = true;
  if (game.light === id) game.light = null;
  game.collect([...(o.terms || []), ...(game.ep[id]?.terms || [])]);
  game.flag("read:" + id);
  if (o.kind === "letter" && game.state.letterPart < 1) { game.state.letterPart = 1; game.flag("read:letter:1"); }
  // A short version remembers that the letter is open until the sheet closes or shows something else (resumeReading).
  game.state.reading = o.kind === "letter" && game.ep.variant ? id : null;
  game.save();
  const build = {
    box: () => boxBody(game, o),
    doc: () => h("div.paper", blocks(game, o.blocks)),
    letter: () => letterBody(game, o),
    egg: () => eggBody(game, id, o),
    ledger: () => ledgerBody(game),
    calendar: () => calendarBody(game),
    provinces: () => provincesBody(game),
  }[o.kind];
  game.openSheet(o.title, build, parent ? () => openObject(game, parent) : null, id);
}

function boxBody(game, o) {
  return [h("div.paper", o.blocks ? blocks(game, o.blocks) : null),
    h("div.box-items", o.children.map((cid) => tile(game, cid, "box")))];
}

/**
 * Text blocks of a document: { t: "p" | "hand" | "brother" | "brotherBold" | "stamp" | "smudge" | "pencil" | "meta", text }.
 * "brother" marks the letter writer's own handwriting: a stand-in style for now; the final art draws it.
 */
export function blocks(game, list) {
  return list.map((b) => b.t === "panel"
    ? h("figure.panel-fig", { role: "img", "aria-label": game.ep.panelAlt[b.id] }, svg(panelMarkup(b.id), "panel-art"))
    : b.t === "stamp" ? h("div", h("span.stamp", b.text)) : h("p." + (b.t === "p" ? "plain" : b.t), tx(game, b.text)));
}

let fullLetter = false;
/** The letter, one part at a time. After the last part the slip appears (feedback builds ask "why" first). */
function letterBody(game, o) {
  const st = game.state;
  const n = Math.min(st.letterPart, o.parts.length);
  let fold = null;
  // With the whole letter open, the excerpts step aside so nothing is read twice.
  // A short version prints the excerpts (said once at the top); the whole letter keeps the writer's own hand (its shape is a clue).
  const out = o.full && fullLetter ? [] : [h("div.paper" + (o.full ? ".printed" : ""),
    o.full ? h("p.meta.print-note", t("letterPrinted")) : null, o.parts.slice(0, n).map((p, i) => partMark(blocks(game, p), i + 1)))];
  if (n < o.parts.length) {
    out.push(h("button.btn", { onclick: () => { st.letterPart = n + 1; game.flag("read:letter:" + (n + 1)); game.save(); game.refreshSheet(); } }, t("readOn")));
  } else if (st.flags.slip == null) {
    if (o.fold) fold = h("button.btn.fold", { onclick: () => foldLetter(game) }, o.fold);
    else if (game.pt && st.why == null) out.push(whyBox(game));
    else revealSlip(game);
  }
  // A short version shows excerpts, read one way only ("read on"); once they are all read, the whole letter as written
  // is one tap away (it stays shown while open). Opening it also counts as reading it all.
  // It is the lesser choice: a plain link at the top of the letter, far from the button that ends the letter.
  if (o.full && (n >= o.parts.length || fullLetter)) {
    out.unshift(h("button.letter-full", { type: "button", onclick: () => {
      fullLetter = !fullLetter;
      if (fullLetter) while (st.letterPart < o.parts.length) game.flag("read:letter:" + ++st.letterPart);
      game.save(); game.refreshSheet();
    } }, t(fullLetter ? "letterShort" : "letterFull")));
    if (fullLetter) out.push(h("div.paper.as-written", o.full.map((p) => blocks(game, p))));
  }
  if (fold) out.push(fold);
  return out;
}

/** Marks where a letter part starts, so a reload can bring the reader back to it. */
function partMark(list, no) {
  if (list[0]?.setAttribute) list[0].setAttribute("data-part", String(no));
  return list;
}

/**
 * A short version after a reload: the letter that was open opens again at the part last reached (its start in sight),
 * instead of leaving the player on the desk with a note that says the letter is finished. Returns true when it did.
 */
export function resumeReading(game) {
  const st = game.state;
  if (!game.ep.variant || !st.started || st.reading !== "letter" || st.flags.slip != null) return false;
  openObject(game, "letter", "box");
  const n = Math.min(st.letterPart, game.ep.objects.letter.parts.length);
  const at = typeof document === "undefined" ? null : document.querySelector(`#sheet [data-part="${n}"]`);
  if (n > 1 && at) at.scrollIntoView({ block: "start" });
  return true;
}

/**
 * The player folds the letter: the slip is flagged before the desk is drawn, so the desk never shows, even for a frame,
 * the note that still asks to fold it; the slip's own moment starts at once.
 */
export function foldLetter(game) {
  game.flag("slip");
  game.save();
  game.go("desk");
  game.beat(game.ep.slip.arrive);
}

function revealSlip(game) {
  game.flag("slip");
  game.save();
  setTimeout(() => { game.refresh(); game.beat(game.ep.slip.arrive); }, 0);
}

/** Feedback question, asked before the slip appears (the answer stays in this browser, shown in the notebook). */
function whyBox(game, ask = t("ptWhy"), after = () => game.refreshSheet()) {
  const area = h("textarea.notes", { "aria-label": ask, style: "min-height:80px" });
  const done = (text) => { game.state.why = text; game.save(); after(); };
  return h("div.paper.pt", h("p", h("b", ask)), area,
    h("div.row", h("button.btn", { onclick: () => done(area.value.trim()) }, t("ptSave")),
      h("button.btn.ghost.dark", { onclick: () => done("") }, t("ptSkip"))));
}

function eggBody(game, id, o) {
  if (!game.state.eggs[id]) { game.state.eggs[id] = true; game.save(); }
  return h("div.paper", blocks(game, o.blocks));
}

/** The ledger as the player can search it now: after delivery Tín adds the reply letter on the last page. */
export function ledgerEntries(game) {
  const { ledger } = game.ep;
  if (!game.state.delivered || !ledger.afterDelivery) return ledger.entries;
  const extra = { ...ledger.afterDelivery, lines: [game.ans.ending.ledgerLine] };
  return [...ledger.entries, extra];
}

function ledgerBody(game) {
  const { ledger } = game.ep;
  const st = game.state;
  const results = h("div");
  // The pencilled "47" on the label is the way in: offered in the box until the player has looked it up.
  const first = game.ledgerQ ?? (st.flags["lookup:47"] == null && st.flags["read:label"] != null ? "47" : "");
  const input = h("input", { type: "search", value: first, placeholder: ledger.placeholder, "aria-label": t("keyword"), autocomplete: "off" });
  const show = (q) => {
    const found = searchLedger(ledgerEntries(game), q);
    mount(results, found.length
      ? found.map((e) => h("div.entry", h("p.hand", h("span.no", e.no ? t("entryNo")(e.no) : "—"), h("span.meta", e.date)),
          e.lines.map((line) => h("p.hand", tx(game, line)))))
      : h("p.meta", ledger.empty));
  };
  const run = () => {
    const q = input.value.trim();
    if (!q) return;
    game.ledgerQ = q;
    st.lookups = [...st.lookups, q].slice(-20);
    const found = searchLedger(ledgerEntries(game), q);
    found.forEach((e) => { game.collect(e.terms); game.flag("lookup:" + e.id); });
    game.save();
    show(q);
  };
  if (game.ledgerQ) show(game.ledgerQ);
  return h("div.paper",
    blocks(game, ledger.cover),
    h("form.search", { onsubmit: (e) => { e.preventDefault(); run(); } }, input, h("button.btn", { type: "submit" }, t("lookup"))),
    results);
}

function calendarBody(game) {
  const c = game.ep.calendar;
  const pinned = game.state.flags["read:photoBack"] != null && c.pinned ? h("div.paper.pinned", blocks(game, c.pinned)) : null;
  return [pinned, h("div.paper", blocks(game, c.cover)),
    // A six-sheet wall calendar: each sheet covers two months.
    c.stations.map((s, i) => h("div.paper.station",
      h("p.meta", t("months")(2 * i + 1, 2 * i + 2)), h("h3", tx(game, s.name)), svg(stationShape(s.shape)), h("p", tx(game, s.text))))];
}

function provincesBody(game) {
  const p = game.ep.provinces, g = game.ep.guess, st = game.state;
  // A short version asks for a guess the first time the table is opened for the slip; any answer shows the table.
  // Nothing is written on the slip and nothing is scored: the table is still where the answer is read.
  const asking = g && st.flags.slip != null && !st.done[g.line];
  if (asking && st.guess == null) {
    return h("div.paper.guess", h("p", h("b", "Tín: "), g.ask),
      h("div.guess-opts", g.options.map(([k, label]) => h("button.btn" + (k === "unsure" ? ".ghost.dark" : ""),
        { type: "button", onclick: () => { st.guess = k; game.save(); game.refreshSheet(); } }, label))));
  }
  const said = asking && g.said[st.guess] ? h("p.guess-said", h("b", "Tín: "), g.said[st.guess]) : null;
  const table = (rows) => h("table.prov", h("thead", h("tr", p.cols.map((c) => h("th", c)))),
    h("tbody", rows.map((r) => h("tr", r.map((cell, i) => h("td", { "data-col": p.cols[i] }, tx(game, cell)))))));
  const back = game.provBack;
  const flip = h("button.btn.small", { onclick: () => { game.provBack = !back; game.refreshSheet(); } }, back ? t("hideBack") : t("flipBack"));
  return [said, back
    ? h("div.paper", h("p", h("b", p.backTitle)), table(p.back), flip)
    : h("div.paper", blocks(game, p.head), table(p.rows), blocks(game, p.foot), flip)];
}

export function renderNotebook(game, view) {
  const { state, ep } = game;
  const notes = h("textarea.notes", { "aria-label": t("notesLabel"), placeholder: t("notesPlaceholder"), value: state.notes });
  notes.addEventListener("input", () => { state.notes = notes.value; game.save(); });
  let armed = false;
  const reset = h("button.btn.ghost.small", {
    onclick: () => {
      if (!armed) { armed = true; reset.textContent = t("resetArm"); return; }
      game.store.reset(); game.state = game.store.state; game.go("desk");
    },
  }, t("reset"));
  const eggs = Object.keys(state.eggs).length;
  mount(view,
    h("h2", t("notebookTitle")),
    h("p.hint-line", t("notebookHint")),
    ep.nameNote ? h("div.paper.names", { style: "margin-bottom:12px" }, ep.nameNote.map((p) => h("p", p))) : null,
    h("div.paper",
      state.terms.length ? h("div.chips", state.terms.map((w) => h("span.chip", w))) : h("p.meta", t("nothingYet")),
      h("p.meta", { style: "margin-top:12px" }, t("ownNotes")), notes),
    h("h2", t("shelfTitle")),
    h("div.shelf", state.delivered ? ep.shelf.delivered : ep.shelf.empty,
      eggs ? h("p.meta", `${ep.shelf.eggLabel} ${eggs}/5`) : null),
    game.pt ? ptBox(game) : null,
    codeBox(game),
    h("p", { style: "margin-top:16px" }, reset));
}

/** Feedback timings (minutes from "open the box"), wrong tries and hints per line, and the "why" answer. */
export function ptReport(game) {
  const { flags, wrongs, hintLog } = game.state;
  const t0 = flags.start;
  const marks = t("ptMarks");
  const lines = Object.keys(marks).filter((k) => flags[k] != null && t0 != null)
    .map((k) => `${marks[k]}: ${t("minutes")(((flags[k] - t0) / 60000).toFixed(1))}`);
  const per = (o) => Object.entries(o).map(([k, v]) => `${k}=${v}`).join(" ") || "-";
  const asks = {};
  hintLog.forEach(([f]) => { asks[f] = (asks[f] || 0) + 1; });
  lines.push(`${t("ptWrongs")}: ${per(wrongs)}`, `${t("ptHints")}: ${per(asks)}`, `${t("ptWhyLabel")}: ${game.state.why ?? "-"}`);
  if (game.ep.variant) lines.unshift(`${t("ptVersion")}: ${game.ep.variant.toUpperCase()}`);
  return lines.join("\n");
}

function ptBox(game) {
  return h("div.paper.pt", { style: "margin-top:16px" }, h("p.meta", t("ptTitle")),
    h("textarea.notes", { readOnly: true, value: ptReport(game), "aria-label": t("ptTitle"), style: "min-height:150px" }));
}

/** Progress code: browsers may wipe saved progress (Safari after 7 days away), so the player can copy a code. */
function codeBox(game) {
  const out = h("input", { readOnly: true, "aria-label": t("codeOut"), value: "" });
  const inp = h("input", { "aria-label": t("codeIn"), placeholder: t("codePlaceholder")(game.ep.codePrefix) });
  const msg = h("p.meta", { "aria-live": "polite" });
  return h("div.paper", { style: "margin-top:16px" },
    h("p.meta", t("codeAbout")),
    h("div.search", out, h("button.btn.small", { type: "button", onclick: () => {
      out.value = exportCode(game.state, episodeVocab(game.ep), game.ep.codePrefix); out.select();
      msg.textContent = t("codeSelect");
      try { navigator.clipboard?.writeText(out.value).then(() => { msg.textContent = t("codeCopied"); }, () => {}); } catch { /* no clipboard */ }
    } }, t("codeMake"))),
    h("div.search", { style: "margin-top:8px" }, inp, h("button.btn.small", { type: "button", onclick: () => {
      const st = importCode(inp.value, episodeVocab(game.ep), game.ep.codePrefix);
      if (!st) { msg.textContent = t("codeBad"); return; }
      st.notes = game.state.notes;
      game.ep.threads.forEach((x) => { st.readCount[x.id] = 999; });  // messages before the code count as read
      Object.keys(game.state).forEach((k) => delete game.state[k]);
      Object.assign(game.state, st);
      game.save(); game.go("desk");
    } }, t("codeLoad"))),
    msg);
}

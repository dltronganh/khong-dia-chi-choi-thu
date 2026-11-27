// Entry point: loads the episode, its encoded answers and the saved progress, then wires the four tabs
// (desk, phone, notebook, slip), the reading sheet, the slip bar at the bottom and the story beats.
// Views live in desk.js, phone.js, slip.js; the loop rules (stages, checking a line, hints) in loop.js.
import { LANG, pickLang, otherLangHref, t } from "./i18n.js";
import { decode } from "./answer.js";
import { feedbackMode } from "./build_config.js";
import { makeStore, browserStorage, addTerms } from "./store.js";
import { setFlag } from "./flow.js";
import { h, svg, mount } from "./dom.js";
import { pickVariant, applyVariant, guessAck, introStep, arrivalPlace } from "./variants.js";
import { panelMarkup } from "./panels.js";
import { renderDesk, renderNotebook, openObject, todoNote, targetLabel, goesTo, resumeReading } from "./desk.js";
import { renderPhone, unreadCount } from "./phone.js";
import { renderSlip, renderSlipBar, showEnding } from "./slip.js";
import { applyAnswer, openLines, fieldOf, nextHintTier, recordHint, hintReplies, tapWord, todoEntry, sendParcel, liveLines } from "./loop.js";

// Episode texts and answers in the player's language (English versions live in episodes/<ep>/en/).
pickLang();
const dir = "../episodes/ep01/" + (LANG === "vi" ? "" : LANG + "/");
const { EP: BASE } = await import(dir + "content.js");
const variant = pickVariant(location.search);
const EP = variant === "a" ? BASE : applyVariant(BASE, (await import(dir + "variants.js")).SHORT, variant);
const { SECRET, SECRET_KEY } = await import(dir + "answers.js");
document.title = t("title") + (variant === "a" ? "" : " " + variant.toUpperCase());
document.querySelector(".topbar h1").textContent = t("room");
mount(document.getElementById("lang"), h("a.lang-link", { href: otherLangHref(), lang: LANG === "vi" ? "en" : "vi" }, t("langSwitch")));

// A short version marks the page, so its own layout rules never touch the default version.
if (EP.variant) document.body.classList.add("v-short");

let feedback = false;
try { feedback = feedbackMode(location.search); } catch { /* no location */ }

const store = makeStore(EP.storageKey, browserStorage());
const game = {
  ep: EP,
  ans: decode(SECRET, SECRET_KEY),
  store,
  state: store.load(),
  pt: feedback,      // feedback build: asks "why fill in the slip" before it appears, shows timings in the notebook
  tab: "desk",
  thread: null,      // open phone thread id
  sheetId: null,     // object open in the reading sheet (the sticky note hides a button to where you already are)
  light: null,       // object the clerk's first hint points at (glows until opened)
  blink: null,       // slip line whose "ask" button blinks once (after two wrong tries)
  now: () => Date.now(),
  save: () => store.save(),
};

/** Records a story event once. */
game.flag = (name) => { if (setFlag(game.state.flags, name, game.now())) game.save(); };
/** Adds words to the notebook. */
game.collect = (words) => { if (addTerms(game.state, words).length) game.save(); };
game.go = (tab) => {
  if (game.closeSheet) game.closeSheet(true);
  game.tab = tab; game.thread = tab === "phone" ? game.thread : null; render(); window.scrollTo(0, 0);
};
game.render = () => render();

/**
 * Goes where a sticky note or a story beat points (js/loop.js todoEntry): opens an object (a box item opens inside the
 * box), a phone thread, the delivery scene, or does one of the two story actions the player owns: posting in the ferry
 * group and sending the parcel. Nothing else changes: the player can still go anywhere.
 */
game.goTarget = (target) => {
  if (!target) return;
  if (target === "act:post:group") return game.post("group");
  if (target === "act:send") return game.send();
  if (target === "ending") return game.showEnding();
  if (target.startsWith("phone:")) { game.thread = target.slice(6); game.go("phone"); return; }
  if (EP.objects[target]) openObject(game, target, EP.objects.box.children.includes(target) ? "box" : null);
};

/** The player posts Tín's question in a phone thread (the ferry group): the replies follow, the thread opens. */
game.post = (id) => {
  const th = EP.threads.find((x) => x.id === id);
  if (!th?.post) return;
  game.flag(th.post);
  game.thread = id;
  game.go("phone");
  if (beatQueue.length) showBeat();  // a card still inviting to post goes away
};

/** The player presses "Send": the boss signs, the tag is cut, then the delivery scene. */
game.send = () => {
  const beats = sendParcel(EP, game.ans, game.state, game.now());
  if (!beats.length) return;
  game.save();
  game.refresh();
  if (beatQueue.length) showBeat();  // a card still inviting to send goes away
  game.beat(beats, () => game.showEnding());
};

// ---------- reading sheet ----------
/** Opens the reading sheet over the current tab. `build` returns the body; it runs again on every refresh. */
/**
 * While a sheet is open, what lies under it can be neither pressed nor read out, so the sticky-note button under the
 * sheet is never mistaken for the one on top of it. The default version keeps its slip bar in use over the sheet.
 */
function behindSheet(on) {
  document.querySelectorAll(EP.variant ? ".app, .tabs, #slipbar" : ".app, .tabs").forEach((el) => { el.inert = on; });
  // Some readers list hidden buttons all the same: the desk's own note button goes while the sheet's note is on top.
  if (on) document.querySelectorAll(".app .note-go").forEach((b) => b.remove());
}
game.openSheet = (title, build, onClose, id = null) => {
  const host = document.getElementById("sheet");
  const body = h("div.body");
  // The sticky note stays in sight on top of every sheet, as one slim strip (N2).
  const fill = () => {
    mount(body, todoNote(game, true), build());
    // A short version says how to write on the slip here, where the dotted words are, until the first line is written.
    if (EP.howTo && game.state.flags.slip != null && !Object.keys(game.state.done).length && body.querySelector(".tap")) {
      const first = body.querySelector(".paper");
      if (first) first.before(h("p.howto", EP.howTo));
    }
  };
  const close = (quiet) => {
    behindSheet(false);
    if (game.state.reading) { game.state.reading = null; game.save(); }
    mount(host); document.body.classList.remove("sheet-open"); game.closeSheet = null; game.refreshSheet = null; game.sheetId = null;
    if (!quiet) { render(); onClose?.(); }
  };
  game.sheetId = id;
  game.closeSheet = close;
  game.refreshSheet = () => { const panel = body.parentElement; const y = panel?.scrollTop; fill(); if (panel) panel.scrollTop = y; };
  const panel = h("div.panel", { role: "dialog", "aria-label": title },
    h("div.bar", h("b", title), h("button.btn.ghost.small", { onclick: () => close() }, t("close"))), body);
  mount(host, h("div.sheet", { onclick: (e) => {
    // The strip under a docked fold button is part of the letter, not the dark outside: a tap there does not close it.
    if (e.target.classList.contains("sheet") && !e.target.querySelector(".btn.fold")) close();
  } }, panel));
  document.body.classList.add("sheet-open");
  behindSheet(true);
  fill();
  updateBar();
  return panel;
};
game.showEnding = () => showEnding(game);

/** Re-draws everything that depends on the state: the open sheet, the tab, the slip bar. */
game.refresh = () => { game.refreshSheet?.(); render(); };

// ---------- story beats and the confirm card ----------
const beatQueue = [];
/** Saves the lines still waiting, so a reload in the middle of a beat does not lose them (QA N-8). */
function keepBeats() { game.state.beats = beatQueue.flatMap((b) => b.lines); game.save(); }
/**
 * Shows lines one card at a time ([[who, text], ...]); `then` runs after the last one. A line may carry a target
 * ([who, text, target]): its card then has a button that goes there, and a "Later" button.
 */
game.beat = (lines, then) => {
  // At most two lines per card, so a long beat reads as a few short ones.
  const idle = beatQueue.length === 0;
  for (let i = 0; i < lines.length; i += 2) beatQueue.push({ lines: lines.slice(i, i + 2), then: i + 2 >= lines.length ? then : null });
  keepBeats();
  if (!lines.length) then?.();
  if (idle && lines.length) showBeat();
};
function showBeat() {
  const host = document.getElementById("beat");
  const cur = beatQueue[0];
  document.body.classList.remove("arrive-on", "arrive-beside");
  if (!cur) { mount(host); return; }
  const next = () => { beatQueue.shift(); keepBeats(); cur.then?.(); showBeat(); };
  // The player may have posted or sent from the note while this card waited.
  cur.lines = liveLines(EP, game.state, cur.lines);
  if (!cur.lines.length) { next(); return; }
  // The slip's own panel goes with the first lines said when it appears (found by text, so a reload keeps it).
  const place = arrivalPlace(EP, cur.lines);
  const arrive = place === "moment";
  const art = EP.slip.arrivePanel && arrive ? EP.slip.arrivePanel : null;
  // While the slip's own moment is on screen, a short version keeps the slip bar out of sight under it (it comes next).
  document.body.classList.toggle("arrive-on", arrive);
  // The lines after it talk about the slip: a short version shows them at the top, so the slip and its bar stay readable.
  document.body.classList.toggle("arrive-beside", place === "beside");
  let target = cur.lines.map((l) => l[2]).filter(Boolean).at(-1);
  // Already there (reading the ferry group when Cô Tư writes again): a plain "Next" is enough.
  if (target === "phone:" + game.thread && game.tab === "phone" && !game.sheetId && !document.body.classList.contains("sheet-open")) target = null;
  mount(host, h("div.beat-card", { role: "status", "aria-live": "polite" },
    art ? h("figure.panel-fig", { role: "img", "aria-label": EP.panelAlt[art] }, svg(panelMarkup(art), "panel-art")) : null,
    cur.lines.map(([who, text]) => h("p" + (who ? "" : ".meta"), who ? h("b", who + ": ") : null, text)),
    target
      ? h("div.row", h("button.btn" + (target === "act:send" ? ".send" : ""), { onclick: () => { next(); game.goTarget(target); } }, targetLabel(game, target)),
          h("button.btn.ghost.dark", { onclick: next }, t("notNow")))
      : h("button.btn", { onclick: next }, t("next"))));
  host.querySelector("button")?.focus({ preventScroll: true });
}

/** A tapped word: goes to the notebook, then asks before writing it on the open line of its kind. */
game.tap = (word, kind) => {
  game.collect([tapWord(EP, word)]);  // the episode's own spelling, so "Ga Huế" in a heading is the same word as "ga Huế"
  const id = openLines(EP, game.state).find((x) => fieldOf(EP, x).kind === kind);
  if (!id) return;
  game.confirm(word, id);
};
game.confirm = (word, id) => {
  const host = document.getElementById("beat");
  if (beatQueue.length) return;
  const close = () => mount(host);
  mount(host, h("div.beat-card",
    h("p", t("confirm")(word, fieldOf(EP, id).short)),
    h("div.row", h("button.btn", { onclick: () => { close(); game.answer(id, word); } }, t("write")),
      h("button.btn.ghost.dark", { onclick: close }, t("cancel")))));
  host.querySelector("button")?.focus({ preventScroll: true });
};

/** Writes a value on a slip line and plays what follows. */
game.answer = (id, value) => {
  const r = applyAnswer(EP, game.ans, game.state, id, value, game.now());
  if (r.result === "empty") return;
  game.barLine = id;  // the slip bar shows the line just written on (N7)
  if (r.wrongs === 2) game.blink = id;
  if (r.result === "ok" && game.blink === id) game.blink = null;
  game.save();
  game.refresh();
  // A short version: Tín says how the player's guess before the province table went (nothing else hangs on it).
  const ack = guessAck(EP, game.state, id, r.result);
  game.beat(ack ? [ack, ...r.beats] : r.beats);
};

/** Asks the clerk about a line; his reply shows where the player is and stays in his phone thread. */
game.askHint = (id) => {
  const st = game.state;
  const tier = nextHintTier(game.ans, st, id);
  recordHint(st, id, tier);
  if (tier === 1 && game.ans.hintLight?.[id]) game.light = game.ans.hintLight[id];
  if (game.blink === id) game.blink = null;
  const replies = hintReplies(EP, game.ans, st.hintLog);
  st.readCount[EP.clerkThread] = (st.readCount[EP.clerkThread] || 0) + 2;
  game.save();
  game.refresh();
  game.beat([[EP.clerk.name, replies[replies.length - 1]]]);
};

// ---------- tabs and views ----------
const TABS = ["desk", "phone", "notebook", "slip"].map((id) => [id, t("tabs")[id]]);

function updateTabs() {
  const unread = unreadCount(game);
  // The Phone tab gets the dashed outline when the sticky note points into the phone and you are elsewhere.
  const toPhone = game.state.started && game.tab !== "phone" && goesTo(game, todoEntry(EP, game.state.flags).target) === "phone";
  mount(document.getElementById("tabs"), TABS.map(([id, label]) =>
    h("button.tab" + (game.tab === id ? ".active" : "") + (id === "phone" && toPhone ? ".target" : ""), { onclick: () => game.go(id), "aria-current": game.tab === id ? "page" : null },
      // A short version names what each tab holds, in a second line (the default keeps one word).
      EP.variant ? h("span.tab-name", label, h("span.tab-sub", t("tabSubs")[id])) : label,
      id === "phone" && unread ? h("span.badge", { "aria-label": t("unread")(unread) }, unread) : null)));
}

function updateBar() {
  const bar = document.getElementById("slipbar");
  renderSlipBar(game, bar);
  // The page keeps room at its foot for the bar's real height (short versions read it: css --barh).
  document.documentElement.style.setProperty("--barh", (bar.hidden ? 0 : bar.offsetHeight) + "px");
}

function render() {
  const view = document.getElementById("view");
  document.getElementById("sub").textContent = EP.subtitle;
  if (!game.state.started) { renderIntro(view); updateTabs(); updateBar(); return; }
  if (game.tab === "desk") renderDesk(game, view);
  else if (game.tab === "phone") renderPhone(game, view);
  else if (game.tab === "notebook") renderNotebook(game, view);
  else renderSlip(game, view);
  updateTabs();
  updateBar();
}

/**
 * A short version's opening: one beat at a time, each with its own button (the first one is the player lifting the box).
 * Version C shows a grey panel above the words; version B the same words alone. Nothing moves on its own.
 */
let introFresh = false;
function introBeats() {
  const beats = EP.introBeats;
  const n = beats.length;
  // The beat on screen is saved, so a reload comes back to it (the page footer says progress is kept).
  const i = introStep(EP, game.state);
  const to = (k) => {
    introFresh = k > i; game.state.intro = k; game.save(); render();
    (document.querySelector(".strip-nav .go") || document.querySelector(".intro > .btn"))?.focus({ preventScroll: true });
  };
  const words = h("div.beat-words", beats[i].lines.map(([who, text]) => h("p" + (who ? "" : ".meta"), who ? h("b", who + ": ") : null, text)));
  const frame = EP.introPanels
    ? h("figure.panel-fig" + (introFresh ? ".fresh" : ""),
      h("div", { role: "img", "aria-label": EP.panelAlt[EP.introPanels[i]] }, svg(panelMarkup(EP.introPanels[i]), "panel-art")),
      h("figcaption", words))
    : h("div.paper.beat-paper", words);
  introFresh = false;
  const last = i === n - 1;
  return h("div.strip", h("div", { "aria-live": "polite" }, frame),
    h("div.row.strip-nav",
      i > 0 ? h("button.btn.ghost", { onclick: () => to(i - 1) }, t("panelBack")) : null,
      h("span.small", `${i + 1}/${n}`),
      // A line just above the act, saying it is the player's to do (short versions only).
      !last && beats[i].lead ? h("p.act-lead", beats[i].lead) : null,
      // A full-width button on its own line, so the player's act reads as something to press, not a caption.
      last ? null : h("button.btn.go", { onclick: () => to(i + 1) }, beats[i].act || t("next"))));
}

function renderIntro(view) {
  const at = introStep(EP, game.state);
  const ready = !EP.introBeats || at === EP.introBeats.length - 1;
  mount(view, h("div.intro",
    EP.introBeats ? introBeats() : EP.intro.map((p) => h("p.hook", p)),
    // The name note and the build note once, on the first beat: repeated on every beat they read as part of each screen.
    EP.nameNote && (!EP.introBeats || at === 0) ? h("div.paper.names", EP.nameNote.map((p) => h("p", p))) : null,
    !ready ? null : h("button.btn" + (EP.variant ? ".go.start" : ""), {
      onclick: () => {
        game.state.started = true; game.state.startedAt = game.now(); game.flag("start"); game.save(); game.go("desk");
        // A short version opens the box at once: the button says "open the box", so no second tap on the desk for it.
        if (EP.variant) openObject(game, "box");
      },
    }, t("start")),
    !EP.introBeats || at === 0 ? h("p.small", t(EP.variant && !EP.introPanels ? "introSmallText" : "introSmall")) : null));
}

render();
// A short version left in the middle of the letter: back to that part, not to the desk.
resumeReading(game);
// Lines that were waiting when the page was closed or reloaded (the delivery scene stays one tap away in the slip).
if (game.state.started && game.state.beats?.length) game.beat(game.state.beats.slice());

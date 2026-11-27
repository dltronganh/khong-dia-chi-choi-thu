// Tín's phone (story layer 2): threads with the manager, the retired clerk (the hint channel), the watch shop and the
// ferry group. Messages arrive by story flags (js/flow.js). The clerk's thread also keeps every hint asked from the slip
// bar (js/loop.js decides the tier). Words that fit the open slip line can be tapped in messages.
// A thread with `post` (the ferry group) holds Tín's question as a draft until the player presses the post button.
import { h, svg, mount } from "./dom.js";
import { photoDalat } from "./art.js";
import { visibleThreads } from "./flow.js";
import { hintReplies, fieldOf, todoEntry } from "./loop.js";
import { tx, todoNote } from "./desk.js";
import { t } from "./i18n.js";

/** Visible threads; the clerk's thread also carries the hint conversation. */
export function threadsNow(game) {
  return visibleThreads(game.ep.threads, game.state.flags).map((x) =>
    x.id === game.ep.clerkThread ? { ...x, messages: [...x.messages, ...hintMessages(game)] } : x);
}

function hintMessages(game) {
  const replies = hintReplies(game.ep, game.ans, game.state.hintLog);
  return game.state.hintLog.flatMap(([id], i) => [
    { from: "me", text: game.ep.clerk.ask.replace("{field}", fieldOf(game.ep, id).short) },
    { from: game.ep.clerk.name, text: replies[i] }]);
}

/** True when a thread's question is still a draft, waiting for the player to post it. */
export function draftWaiting(game, th) {
  return !!th.post && game.state.flags[th.post] == null;
}

/** Number of messages not yet seen, across threads (a draft waiting to be posted counts as one). */
export function unreadCount(game) {
  if (!game.state.started) return 0;
  return threadsNow(game).reduce((n, x) => n + (draftWaiting(game, x) ? 1 : Math.max(0, x.messages.length - (game.state.readCount[x.id] || 0))), 0);
}

/** Tín's question before it is posted, with the post button (N9). */
function draftCard(game, th) {
  const raw = game.ep.threads.find((x) => x.id === th.id);
  const text = raw.messages.find((m) => m.from === "me" && (m.when || []).some((c) => c.flag === th.post))?.text;
  return h("div.draft",
    h("p.meta", t("draft")),
    text ? h("div.msg.me.unsent", text) : null,
    h("button.btn", { type: "button", onclick: () => game.post(th.id) }, t("postGroup")));
}

export function renderPhone(game, view) {
  const threads = threadsNow(game);
  const open = threads.find((th) => th.id === game.thread);
  if (!open) {
    mount(view, todoNote(game), h("h2", t("phone")),
      h("div.threads", threads.map((th) => {
        const unread = draftWaiting(game, th) ? 1 : th.messages.length - (game.state.readCount[th.id] || 0);
        const aim = todoTargetThread(game) === th.id ? ".target" : "";
        return h("button.thread-btn" + aim, { onclick: () => { game.thread = th.id; game.render(); } },
          h("span.thread-name", h("b", th.name), th.sub ? h("span.meta", th.sub) : null),
          unread > 0 ? h("span.badge", { style: "position:static" }, unread) : h("span.meta", t("msgCount")(th.messages.length)));
      })));
    return;
  }
  const draft = draftWaiting(game, open);
  game.state.readCount[open.id] = open.messages.length;
  open.messages.forEach((m) => game.collect(m.terms));
  // "Seen" only once there is something to read: the clerk's "read the group first" waits for the replies.
  if (open.messages.length) game.flag("seen:" + open.id);
  game.save();
  mount(view,
    todoNote(game),
    h("p", h("button.btn.ghost.small", { onclick: () => { game.thread = null; game.render(); } }, t("backThreads"))),
    h("h2", open.name),
    open.sub ? h("p.hint-line", open.sub) : null,
    h("div.chat", open.messages.map((m) => message(game, m, open.marks))),
    draft ? draftCard(game, open) : null);
}

/** The thread the sticky note points into, if any. */
function todoTargetThread(game) {
  const tg = todoEntry(game.ep, game.state.flags).target || "";
  return tg.startsWith("phone:") ? tg.slice(6) : tg === "act:post:group" ? "group" : null;
}

/** Sender line: the name, plus a small red tag for a sender who moves the story on (N4: "remembers her"). */
function who(m, marks) {
  const mark = marks?.[m.from];
  return h("span.who", m.from, mark ? [" ", h("span.mark", mark)] : null);
}

function message(game, m, marks) {
  const me = m.from === "me";
  if (m.photo) {
    const shown = game.state.flags["read:photoBack"] != null && game.photoOpen !== false;
    const back = h("p.hand", { hidden: !shown }, tx(game, m.back));
    // The sticky note says "turn the photo over": the button gets the same dashed outline as the objects (QA N-3).
    const aim = game.state.flags["stage:3"] != null && game.state.flags["read:photoBack"] == null ? ".target" : "";
    const flip = h("button.btn.small" + aim, {
      onclick: () => {
        const open = back.hidden;
        game.photoOpen = open;
        if (open) { game.collect(m.backTerms); game.flag("read:photoBack"); }
        game.render();
      },
    }, shown ? t("hideBack") : t("flipBack"));
    return h("div.msg.photo", who(m, marks), svg(photoDalat()), h("p.meta", m.caption), back, flip);
  }
  return h("div.msg" + (me ? ".me" : ""), me ? null : who(m, marks), tx(game, m.text));
}

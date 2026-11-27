// Tiny DOM helpers. h("div.card", { onclick }, child, "text") builds elements without innerHTML (no escaping bugs).

/** Creates an element. `tag` may carry classes: "button.tab.active". Props starting with "on" become listeners. */
export function h(tag, props, ...children) {
  const [name, ...classes] = tag.split(".");
  const el = document.createElement(name || "div");
  if (classes.length) el.className = classes.join(" ");
  if (props && (typeof props !== "object" || props instanceof Node || Array.isArray(props))) {
    children.unshift(props);
    props = null;
  }
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className += (el.className ? " " : "") + v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k in el && k !== "list") el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

/** An SVG element from markup we write ourselves (placeholder drawings only, never player text). */
export function svg(markup, cls = "") {
  const wrap = document.createElement("div");
  wrap.className = "art " + cls;
  wrap.innerHTML = markup;
  return wrap;
}

/** Replaces the content of a container. */
export function mount(container, ...children) {
  container.replaceChildren();
  append(container, children);
}

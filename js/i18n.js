// Interface language: Vietnamese (default) or English. Holds every interface string; episode texts live in
// episodes/<ep>/content.js (English: episodes/<ep>/en/content.js). The language comes from ?lang= in the address,
// else Vietnamese. No choice is remembered: a plain link always opens in Vietnamese, the main audience.

export const LANGS = ["vi", "en"];

/** Current language. A live binding: setLang() changes it for every importer. */
export let LANG = "vi";

/** Sets the language and the <html lang> attribute. Unknown codes fall back to Vietnamese. */
export function setLang(code) {
  LANG = LANGS.includes(code) ? code : "vi";
  if (typeof document !== "undefined") document.documentElement.lang = LANG;
  return LANG;
}

/** Picks the language from the address (?lang=en), else Vietnamese. */
export function pickLang() {
  let code = null;
  try { code = new URLSearchParams(location.search).get("lang"); } catch { /* no location */ }
  setLang(code || "vi");
  return LANG;
}

/** Address of this page in the other language. */
export function otherLangHref() {
  const p = new URLSearchParams(location.search);
  p.set("lang", LANG === "vi" ? "en" : "vi");
  return "?" + p;
}

const DICT = {
  vi: {
    title: "Không địa chỉ — bản thử",
    room: "Phòng sau",
    langSwitch: "English",
    close: "Đóng",
    tabs: { desk: "Bàn", phone: "Điện thoại", notebook: "Sổ tay", slip: "Phiếu" },
    unread: (n) => `${n} tin mới`,
    start: "Mở hộp",
    introSmall: "Bản thử thô: hình là khối tạm, chưa có âm thanh. Phần đã chơi được lưu trong trình duyệt này.",
    introSmallText: "Bản thử thô, chưa có âm thanh. Phần đã chơi được lưu trong trình duyệt này.",
    keyword: "Từ khoá",
    lookup: "Tra",
    entryNo: (n) => `Số ${n}`,
    months: (a, b) => `Tháng ${a} – ${b}`,
    notesLabel: "Ghi chú",
    notesPlaceholder: "Ghi gì cũng được…",
    resetArm: "Bấm lần nữa để xoá hết và chơi lại từ đầu",
    reset: "Chơi lại từ đầu",
    notebookTitle: "Sổ tay của Tín",
    notebookHint: "Tên người, tên nơi, ngày tháng bạn đã đọc sẽ tự ghi vào đây. Khi điền phiếu, dòng đang điền gợi lại những chữ hợp với nó.",
    nothingYet: "Chưa có gì.",
    ownNotes: "Ghi chú riêng:",
    shelfTitle: "Kệ: bảo tàng những món đồ trở về",
    codeOut: "Mã lưu",
    codeIn: "Dán mã lưu",
    codePlaceholder: (p) => `Dán mã ${p}… vào đây`,
    codeAbout: "Mã lưu: nếu lâu không mở game, trình duyệt có thể tự xoá phần đã chơi. Chép mã này cất đi, khi cần thì dán lại để chơi tiếp.",
    codeSelect: "Chọn và chép mã này.",
    codeCopied: "Đã chép mã.",
    codeMake: "Tạo mã",
    codeBad: "Mã không đọc được. Kiểm lại xem đã chép đủ chưa.",
    codeLoad: "Nhập mã",
    phone: "Điện thoại",
    msgCount: (n) => `${n} tin`,
    backThreads: "‹ Các cuộc trò chuyện",
    flipBack: "Lật mặt sau",
    hideBack: "Ẩn mặt sau",
    reviewDelivery: "Xem lại cảnh giao hàng",
    noTerms: "Sổ tay chưa có chữ nào cùng loại.",
    frame: (i) => `Khung ${i}.`,
    toDesk: "Về bàn",
    next: "Tiếp",
    readOn: "Đọc tiếp",
    panelBack: "Quay lại",
    letterFull: "Xem nguyên văn cả lá thư (chữ tay)",
    letterShort: "Ẩn nguyên văn lá thư",
    // Short versions only: the excerpts are printed; the whole letter keeps the writer's own hand.
    letterPrinted: "Chép lại bằng chữ in. Nét chữ thật ở nguyên văn.",
    tabSubs: { desk: "đồ vật", phone: "tin nhắn", notebook: "chữ đã gom", slip: "chuyển tiếp" },
    ptVersion: "Bản",
    write: "Ghi",
    cancel: "Thôi",
    confirm: (word, line) => `Ghi “${word}” vào dòng “${line}”?`,
    filling: "Đang điền",
    stage: (n, total) => `Chặng ${n}/${total}`,
    askClerk: "Hỏi ông Thuận",
    // Short versions: who he is, said on the button itself.
    askClerkWho: "ông giữ kho cũ, chỉ chỗ nhìn",
    // Short versions: what the outline on an object means (the sticky note points here).
    aimTag: "Việc bây giờ",
    typeIt: "Gõ tay",
    kindHint: { province: "chạm một tên tỉnh có gạch chấm", name: "chạm vào cái tên người quen gọi bà", year: "chạm một ngày hay một năm", station: "chạm một nhà ga" },
    fromNotebook: "Từ sổ tay:",
    later: "mở sau",
    todoTitle: "Việc bây giờ",
    openSlip: "Xem phiếu",
    openThing: (name) => `Mở: ${name}`,
    postGroup: "Đăng hỏi nhóm bến phà",
    draft: "Tín soạn sẵn câu hỏi, chưa đăng:",
    send: "Gửi đi",
    sendHead: "Phiếu đủ dòng",
    sendSub: "Bấm Gửi đi để chị Hằng ký",
    readySend: "Đủ dòng, chờ gửi",
    notNow: "Để sau",
    ptWhy: "Một câu hỏi nhỏ (trước khi phiếu hiện): theo bạn, vì sao Tín phải điền phiếu cho bưu kiện này?",
    ptWhyDesk: "Một câu hỏi nhỏ, trả lời lúc nào cũng được: theo bạn, vì sao Tín không để hộp 47 bị xay?",
    ptSave: "Ghi lại",
    ptSkip: "Bỏ qua",
    ptTitle: "Mốc thời gian (chép gửi người hỏi)",
    ptMarks: { slip: "Phiếu hiện", firstOk: "Câu đúng đầu tiên", "ok:A": "Xong dòng tỉnh 1996", "post:group": "Đăng hỏi nhóm bến phà", "ok:E": "Xong dòng tên", "ok:B": "Xong dòng năm rời bến", "ok:C": "Xong dòng nơi giao", "slip:full": "Phiếu đủ dòng", delivered: "Bấm Gửi đi" },
    minutes: (m) => `phút ${m}`,
    ptWrongs: "Sai mỗi dòng",
    ptHints: "Hỏi ông Thuận",
    ptWhyLabel: "Vì sao điền phiếu",
  },
  en: {
    title: "Không địa chỉ (No Address) — test build",
    room: "The back room",
    langSwitch: "Tiếng Việt",
    close: "Close",
    tabs: { desk: "Desk", phone: "Phone", notebook: "Notebook", slip: "Slip" },
    unread: (n) => (n === 1 ? "1 new message" : `${n} new messages`),
    start: "Open the box",
    introSmall: "Rough test build: placeholder shapes, no sound yet. Progress is saved in this browser.",
    introSmallText: "Rough test build, no sound yet. Progress is saved in this browser.",
    keyword: "Keyword",
    lookup: "Look up",
    entryNo: (n) => `No. ${n}`,
    months: (a, b) => `Months ${a}–${b}`,
    notesLabel: "Notes",
    notesPlaceholder: "Write anything…",
    resetArm: "Tap again to erase all progress",
    reset: "Start over",
    notebookTitle: "Tín's notebook",
    notebookHint: "Names, places and dates you read or tap land here. On the Slip tab, the line you are filling in shows the ones that fit.",
    nothingYet: "Nothing yet. Names, places and dates you read will land here.",
    ownNotes: "Your own notes:",
    shelfTitle: "Shelf: a museum of things that found their way home",
    codeOut: "Progress code",
    codeIn: "Paste a progress code",
    codePlaceholder: (p) => `Paste a ${p}… code here`,
    codeAbout: "Progress code: browsers may erase saved progress if you stay away a long time. Copy this code somewhere safe and paste it back when needed.",
    codeSelect: "Select and copy this code.",
    codeCopied: "Code copied.",
    codeMake: "Make code",
    codeBad: "Can't read that code. Check you copied all of it.",
    codeLoad: "Load code",
    phone: "Phone",
    msgCount: (n) => (n === 1 ? "1 message" : `${n} messages`),
    backThreads: "‹ All chats",
    flipBack: "Turn it over",
    hideBack: "Turn it back",
    reviewDelivery: "See the delivery again",
    noTerms: "Nothing of that kind in the notebook yet.",
    frame: (i) => `Panel ${i}.`,
    toDesk: "Back to the desk",
    next: "Next",
    readOn: "Read on",
    panelBack: "Back",
    letterFull: "See the whole letter as written (handwritten)",
    letterShort: "Hide the whole letter",
    letterPrinted: "Copied out in print. The writer's own hand is in the whole letter.",
    tabSubs: { desk: "objects", phone: "messages", notebook: "words kept", slip: "forwarding" },
    ptVersion: "Version",
    write: "Write it",
    cancel: "Never mind",
    confirm: (word, line) => `Write “${word}” on the line “${line}”?`,
    filling: "Filling in",
    stage: (n, total) => `Stage ${n} of ${total}`,
    askClerk: "Ask Ông Thuận",
    askClerkWho: "the old storeman, shows where to look",
    aimTag: "To do now",
    typeIt: "Type it",
    kindHint: { province: "tap a province name with a dotted underline", name: "tap the name people knew her by", year: "tap a date or a year", station: "tap a station" },
    fromNotebook: "From your notebook:",
    later: "later",
    todoTitle: "Right now",
    openSlip: "See the slip",
    openThing: (name) => `Open: ${name}`,
    postGroup: "Ask the ferry group",
    draft: "Tín's question, written but not posted yet:",
    send: "Send it off",
    sendHead: "Slip complete",
    sendSub: "Tap Send it off for Chị Hằng to sign",
    readySend: "All lines filled, ready to send",
    notNow: "Later",
    ptWhy: "A quick question (before the slip appears): why do you think Tín has to fill in a slip for this parcel?",
    ptWhyDesk: "A quick question, answer any time: why do you think Tín won't let box 47 be shredded?",
    ptSave: "Save",
    ptSkip: "Skip",
    ptTitle: "Timings (copy and send to whoever asked)",
    ptMarks: { slip: "Slip appears", firstOk: "First right line", "ok:A": "1996 province line done", "post:group": "Asked the ferry group", "ok:E": "Name line done", "ok:B": "Year she left done", "ok:C": "Delivery place done", "slip:full": "Slip complete", delivered: "Pressed Send it off" },
    minutes: (m) => `min ${m}`,
    ptWrongs: "Wrong tries per line",
    ptHints: "Asked Ông Thuận",
    ptWhyLabel: "Why fill in the slip",
  },
};

/** The interface string `key` in the current language (functions are returned as is, to be called). */
export function t(key) {
  return DICT[LANG][key] ?? DICT.vi[key];
}

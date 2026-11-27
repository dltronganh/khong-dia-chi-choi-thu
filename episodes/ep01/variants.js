// Short-text version of the opening (up to the moment the slip appears), Vietnamese. js/variants.js lays it over
// content.js. Version B shows these words alone; version C shows the same words with grey panels.
// Letter lines are excerpts: every piece between "…" stands word for word in the full letter (tests check it).
const T = (t, text) => ({ t, text });
const P = (id) => ({ t: "panel", id });
// Said just above the first button, so the player knows the act is theirs and why (not part of the told story).
const LEAD = "Tới lượt bạn: hộp buộc dây đang nằm sát máy xay.";
// Before keeping the box: says it is what Tín does, not a choice that can go wrong (there is no other path).
const KEEP_LEAD = "Tín không đưa cho chị. Bấm để Tín giữ hộp lại.";
// Chị Hằng names the forwarding slip before it is on screen, so she says when it comes: after the box is read.
const SLIP_SAID = "Vậy em điền phiếu chuyển tiếp. Đọc hết hộp đi rồi chị đưa phiếu, chị ký thì nó lên xe. Thứ Sáu chưa xong là xay.";

export const SHORT = {
  // The opening in four beats, one screen and one button each. The player lifts the box in the first one; Tín then
  // refuses, in words, to hand it to the shredder, and Chị Hằng names the price. `lines`: [who, text]; `act`: the
  // button that moves on from that beat (default "Tiếp").
  intro: [
    { panel: "cart", act: "Nhấc hộp buộc dây ra", lead: LEAD, lines: [
      ["", "Phòng sau trung tâm bưu điện: chỗ cất bưu kiện không phát được."],
      ["Chị Hằng, quản lý", "Thứ Sáu dời trung tâm. Hộp nào còn là vào máy xay."],
    ] },
    { panel: "lift", lines: [["", "Bạn là Tín. Đây là hộp số 47."]] },
    { panel: "refuse", lines: [
      ["Chị Hằng", "Ba mươi năm không ai nhận. Đưa chị bỏ vô máy."],
      ["Tín", "Không. Nhãn còn ghi người nhận mà chị."],
    ] },
    { panel: "van", lines: [["Chị Hằng", SLIP_SAID]] },
  ],
  // Version B only (no panels): the player does the refusing, and Tín's reason comes with something he does with the
  // label, said in words. Version C keeps the four beats above.
  introB: [
    { act: "Nhấc hộp buộc dây ra", lead: LEAD, lines: [
      ["", "Phòng sau trung tâm bưu điện: chỗ cất bưu kiện không phát được."],
      ["Chị Hằng, quản lý", "Thứ Sáu dời trung tâm. Hộp nào còn là vào máy xay."],
    ] },
    { lines: [["", "Bạn là Tín. Đây là hộp số 47."]] },
    { act: "Giữ hộp lại", lead: KEEP_LEAD, lines: [["Chị Hằng", "Ba mươi năm không ai nhận. Đưa chị bỏ vô máy."]] },
    { lines: [
      ["", "Bạn ôm hộp lùi ra, lật cái nhãn rách, chỉ vào dòng người nhận."],
      ["Tín", "Không. Nhãn còn ghi người nhận mà chị. Em sẽ tự đưa nó tới tận tay người ấy."],
    ] },
    { lines: [["Chị Hằng", SLIP_SAID]] },
  ],
  bubbles: [["clerk", 1]],
  // Already said in the opening, or said again by the button it names: these wait as read, so the phone shows no count.
  seenAtStart: [["boss", 2], ["clerk", 2]],
  // He shows up with a reason: he logged this very box, and he is the one to ask when stuck (the hint button).
  clerkFirst: "Ông Thuận đây, hồi trước ông giữ phòng sau, chính ông nhập kho hộp 47. Kẹt chỗ nào cháu cứ hỏi ông.",
  todo: {
    0: "Mở hộp, đọc nhãn: vì sao nó bị trả về?",
    1: "Đọc thư trong hộp: ai đang chờ?",
    // The year in full: "96" in the handwritten note was misread.
    2: "Năm 1996 còn tỉnh Hậu Giang không? Tra bảng \"Tỉnh cũ, tỉnh mới\" trên bàn.",
  },
  // Says in print which words on the label matter (the province, the year sent), so the handwriting is not read alone.
  // Nothing about what is not needed yet: the ledger comes to the desk later (`lit`).
  labelLast: "Tín: \"Trả về vì tỉnh không đúng: nhãn ghi tỉnh Hậu Giang, gửi năm 1996.\"",
  // The ledger comes to the desk once the first line is right: the story then reads from it ("the last line in the ledger").
  lit: { ledger: ["ok:A"] },
  // How to write on the slip, shown once at the top of a sheet that has a dotted word, until the first line is written.
  howTo: "Chạm một chữ có gạch chấm, rồi bấm \"Ghi\" để ghi vào dòng đang điền.",
  letter: [
    [
      // The two sentences of the writer stand together, nothing in between, so "the one who writes" and "the one who
      // let go" read as one person (a line of narration between them blurred that).
      P("writing"), T("brother", "Cháu là đứa viết thư hộ cả xóm. Ra Giêng năm 93, ở sân ga, xóm cháu lạc mất một thằng bé chừng ba tuổi."),
      P("apart"), T("brother", "Lúc ấy đông quá, cháu tuột tay nó."),
      // The pause on the year (Tín reads it again) and what "Ra Giêng" means, said as a month so it reads as no name.
      T("meta", "Tín đọc lại chỗ \"Ra Giêng năm 93\": tháng Giêng năm 93, vừa ăn Tết xong."),
    ],
    [
      P("glass"), T("brother", "Người ta kể có một bà bán nước cho nó uống nước, rồi dắt nó đi đâu đó cho khỏi chen, giao cho ai thì không ai biết."),
      T("brother", "Cháu hỏi mãi ở ga mới biết bà đã theo con gái về bán ở bến phà Cần Thơ. Tỉnh thì cháu ghi theo tấm bản đồ cũ treo ở nhà cháu, không biết có đúng không."),
    ],
    [
      P("giver"), T("brotherBold", "Nếu bà còn nhớ đã gửi nó cho ai, bà nhắn về giúp cháu."),
      // One line kept in the writer's own hand, so Tín's remark on the letter L sits next to the handwriting it is about.
      T("meta", "Một dòng đúng nét chữ người viết:"),
      T("brotherHand", "Lúc ấy đông quá, cháu tuột tay nó."),
      T("meta", "Tín: \"Ai viết chữ L mà thắt nơ thế này.\""),
    ],
  ],
  // Sentences of the whole letter left out of the excerpts on purpose: none of them carries a clue (tests check that
  // every other sentence of the letter stands in the excerpts).
  letterLeftOut: [
    "Kính gửi bà bán nước,",
    "Từ hôm ấy cả xóm không biết nó ở đâu.",
    "Cả xóm góp gửi bà cái khăn với gói kẹo, cảm ơn bà đã cho nó uống nước.",
    "Cháu chữ xấu, bà đọc thông cảm.",
    "Cháu, đứa viết thư hộ.",
  ],
  // The player ends the letter; the note says so once every part is read.
  // One act on the button; clipping the slip is told right after, in the slip's own moment.
  fold: "Gấp thư lại",
  foldTodo: "Đọc xong thư rồi. Bấm \"Gấp thư lại\".",
  // What the slip's three stages are, said on the desk when it first shows (the labels on the slip itself, no answer).
  stagesSaid: "Ba chặng theo đường bà đi: 1996 ở bến phà → lúc bà rời bến → bây giờ, 2026.",
  slipPanel: "slip",
  // Only the moment itself: how to write comes later, on the sheet where the dotted words are (howTo).
  arrive: [
    // The letter's question is hers to answer; what Tín takes on is the box reaching her.
    ["Tín", "Câu hỏi trong thư là để bà trả lời. Việc của mình là đưa hộp tới tận tay bà."],
    ["", "Chị Hằng đưa phiếu chuyển tiếp. Tín kẹp phiếu lên hộp, thay cho nhãn cũ."],
    // Why the lookup comes next: the slip's first line decides whether the box reaches her (no province named).
    ["Tín", "Muốn hộp tới tay bà thì dòng đầu phiếu phải ghi đúng tỉnh của bến phà ấy vào năm gửi, 1996. Sai tỉnh là hộp lại bị trả về."],
    // Said as the ask button first shows under the slip: who he is and what asking him gives (never an answer).
    ["Ông Thuận, người giữ kho cũ", "Phiếu này ông điền mấy chục năm rồi. Kẹt dòng nào cháu bấm \"Hỏi ông Thuận\", ông chỉ chỗ cần nhìn."],
  ],
  // The province table is called a table ("bảng"), so it is not mixed up with the forwarding slip ("phiếu").
  provincesTitle: "Bảng \"Tỉnh cũ, tỉnh mới\"",
  // Chị Hằng's note sits right under the table's title (it was easy to skip at the foot): her words as they are, only where it is said.
  yearNote: "Chị Hằng viết tay ở đầu bảng: Đọc theo NĂM GỬI trên dấu bưu điện, không phải năm nay!",
  // Before the table shows for the first time, Tín asks the player to guess. Any answer opens the table; nothing is
  // scored or written on the slip. Once the line is right, Tín says how the guess went.
  guess: {
    line: "A",
    ask: "Trước khi tra, bạn đoán thử: năm 1996 còn tỉnh Hậu Giang không? Đoán sai cũng chẳng sao, bảng sẽ nói.",
    options: [["yes", "Còn"], ["no", "Không còn"], ["unsure", "Chưa biết, xem bảng luôn"]],
    said: { yes: "Bạn đoán: còn. Xem bảng nói sao.", no: "Bạn đoán: không còn. Xem bảng nói sao.", unsure: "Chưa đoán. Xem bảng nói sao." },
    ack: {
      yes: "Đoán hụt rồi, mà giờ thì biết: năm 1996 đã không còn tỉnh Hậu Giang.",
      no: "Đoán trúng: năm 1996 đã không còn tỉnh Hậu Giang. Giờ thì biết chắc.",
      unsure: "Giờ thì biết: năm 1996 đã không còn tỉnh Hậu Giang.",
    },
  },
  // What each panel shows, for screen readers: never more than the picture.
  alt: {
    cart: "Xe đẩy chất hộp, cạnh một máy xay giấy. Hộp buộc dây nằm trên cùng, gần máy nhất.",
    lift: "Một người ôm cái hộp buộc dây đi xa khỏi máy xay. Trên xe đẩy hở một chỗ.",
    refuse: "Một người giữ cái hộp buộc dây sát bên mình, phía xa. Bên phải, một người khác đứng chìa bàn tay mở về phía cái hộp. Phía sau người ấy là máy xay.",
    van: "Xe tải mở cửa sau, trong thùng còn đúng một chỗ trống. Cái hộp buộc dây đứng ngoài, có tờ phiếu.",
    writing: "Một bàn tay viết thư. Tay áo có sọc.",
    apart: "Bàn tay ở tay áo sọc xoè ra, trống không. Một đứa bé bị đám đông cuốn đi, tay còn với lại.",
    glass: "Một bà đội nón, bên bàn nước, đưa ly cho một đứa bé.",
    giver: "Bà đội nón dắt đứa bé. Tay kia của nó được một bàn tay từ ngoài khung nắm lấy; không thấy người ấy.",
    slip: "Hộp buộc dây trên bàn, kẹp tờ phiếu còn trống. Phía sau, xe đẩy các hộp khác đứng cạnh máy xay.",
  },
};

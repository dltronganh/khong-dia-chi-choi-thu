// Episode 1 content: parcel no. 47 for "bà Ga".
// Answers, near misses, story beats on a correct line, hints and the ending are NOT here: they are encoded in
// answers.js (tools/encode_answers.ps1). FACTS holds every number that appears in more than one place; tests check
// the texts agree with it.
//
// The loop (three-stage slip): the slip appears after the letter; each stage opens when the one before is done.
// Story flags (js/flow.js): start, read:<object>, read:letter:<part>, slip, seen:<thread>, lookup:<entry>,
// read:photoBack, ok:<line>, stage:2, post:group (the player posts in the ferry group), stage:3, slip:full (every line
// right), delivered (the player pressed "Send").

export const FACTS = {
  postmark: "14-12-96",        // send date on the label
  ledger47: "28/12/1996",      // date parcel 47 was entered in the ledger
  ferryLast: "24.4.2010",      // Cần Thơ bridge opening day; the ferry stopped a few days later (28/4/2010), same year
  ferryYear: 2010,
  photoYear: 2011,             // first Tết at the new place
  trainKm: 7,                  // Đà Lạt – Trại Mát tourist train, about 7 km
};

const T = (t, text) => ({ t, text });

export const EP = {
  id: "ep01",
  storageKey: "kdc.ep01.v2",
  codePrefix: "KDC2-",
  subtitle: "Bưu kiện số 47",
  intro: [
    "Bưu kiện số 47 đã nằm chờ ba mươi năm.",
    "Bên trong có một lá thư kể chuyện một thằng bé lạc ở sân ga.",
    "Bạn là Tín. Sáng nay bạn vừa lôi nó ra khỏi đống đồ chờ đem huỷ.",
  ],
  boxTag: "CHỜ XAY GIẤY — thứ Sáu",
  // Tín's sticky note "Việc bây giờ": the last entry whose flags are all set. Points where to look, never the answer.
  // `target`: where the note's button goes (an object, "phone:<thread>", or "act:<action>"; js/loop.js todoEntry).
  todo: [
    { need: [], target: "label", text: "Bưu kiện bị trả về vì nhãn ghi sai tỉnh. Mở hộp, đọc nhãn." },
    { need: ["read:label"], target: "letter", text: "Trong hộp còn lá thư. Đọc xem ai đang chờ." },
    { need: ["slip"], target: "provinces", text: "Nhãn ghi tỉnh Hậu Giang. Năm 1996 còn tỉnh ấy không? Tra tờ \"Tỉnh cũ, tỉnh mới\" trên bàn." },
    { need: ["stage:2"], target: "act:post:group", text: "Giờ bà còn bán ở bến phà không? Đăng câu hỏi vào nhóm bến phà \"Hội chờ phà năm xưa\" trong Điện thoại." },
    { need: ["stage:2", "post:group"], target: "phone:group", text: "Cô Tư trong nhóm \"Hội chờ phà năm xưa\" còn nhớ bà. Đọc xem người ở bến gọi bà là gì, bà rời bến năm nào." },
    { need: ["stage:3"], target: "phone:group", text: "Bà ngồi đâu mỗi sáng? Lật mặt sau tấm hình cô Tư gửi trong nhóm \"Hội chờ phà năm xưa\"." },
    { need: ["stage:3", "read:photoBack"], target: "calendar", text: "Bà tả chỗ ngồi là \"ba ngọn núi đứng trên một mái nhà\". Trên bàn có tờ lịch toàn nhà ga: lật xem." },
    { need: ["slip:full"], target: "act:send", text: "Phiếu đủ dòng rồi. Bấm \"Gửi đi\" để chị Hằng ký." },
    { need: ["delivered"], target: "ending", text: "Sáng mai lên xe." },
  ],
  deskTitle: "Cái bàn trong phòng sau",
  // Objects on the desk besides the parcel. Each lights up when the story gives a reason (`lit` flag); before that it is
  // dim but can still be opened.
  desk: ["provinces", "ledger", "calendar"],
  dimLine: "Chưa cần tới.",

  objects: {
    box: {
      kind: "box", title: "Hộp bưu kiện số 47", sub: "Hộp giấy nhỏ, buộc dây",
      blocks: [T("meta", "Hộp nhỏ, giấy ngả vàng, mấy góc đã mềm nhũn. Bên trong có mấy thứ.")],
      children: ["label", "letter", "gift", "twig"],
    },
    label: {
      kind: "doc", title: "Nhãn bưu kiện", sub: "Dán trên nắp hộp",
      blocks: [
        T("meta", "Người nhận:"),
        T("brother", "Bà bán nước, ngày trước bán ở sân ga"),
        T("smudge", "[chỗ này nước loang, không đọc được tên ga]"),
        T("brother", "nay bán ở bến phà Cần Thơ, tỉnh Hậu Giang."),
        T("meta", "Dấu bưu điện nơi gửi: [nhoè] " + FACTS.postmark),
        T("stamp", "TRẢ LẠI. Không phát được: không số nhà; tỉnh không đúng."),
        T("meta", "Người gửi:"),
        T("brother", "Đứa viết thư hộ cả xóm,"),
        T("brother", "viết hộ cô Hai bán xôi, xóm"),
        T("smudge", "[phần còn lại nước loang, không đọc được]"),
        T("pencil", "Bút chì ở góc nhãn: 47"),
        T("meta", "Tín: \"Tỉnh không đúng? Trên bàn có tờ ‘Tỉnh cũ, tỉnh mới’ chị Hằng in. Còn số 47 viết bút chì là số trong sổ nhập kho của ông Thuận.\""),
      ],
      terms: ["bến phà Cần Thơ", "Hậu Giang", FACTS.postmark, "số 47", "bà bán nước"],
    },
    letter: {
      kind: "letter", title: "Lá thư trong hộp", sub: "Giấy học trò, chữ to",
      // Read in three parts. The slip appears after the last one, so the reason to fill it comes first.
      parts: [
        [
          T("brother", "Kính gửi bà bán nước,"),
          T("brother", "Cháu là đứa viết thư hộ cả xóm. Ra Giêng năm 93, ở sân ga, xóm cháu lạc mất một thằng bé chừng ba tuổi. Lúc ấy đông quá, cháu tuột tay nó."),
          // Tín stops for a beat at the year, then moves on. Nothing is explained.
          T("meta", "Tín dừng ở chữ \"năm 93\". Đọc lại dòng ấy một lần nữa."),
        ],
        [
          T("brother", "Người ta kể có một bà bán nước cho nó uống nước, rồi dắt nó đi đâu đó cho khỏi chen, giao cho ai thì không ai biết. Từ hôm ấy cả xóm không biết nó ở đâu."),
          T("brother", "Cháu hỏi mãi ở ga mới biết bà đã theo con gái về bán ở bến phà Cần Thơ. Tỉnh thì cháu ghi theo tấm bản đồ cũ treo ở nhà cháu, không biết có đúng không."),
        ],
        [
          T("brother", "Cả xóm góp gửi bà cái khăn với gói kẹo, cảm ơn bà đã cho nó uống nước."),
          T("brotherBold", "Nếu bà còn nhớ đã gửi nó cho ai, bà nhắn về giúp cháu."),
          T("brother", "Cháu chữ xấu, bà đọc thông cảm. Cháu, đứa viết thư hộ."),
          T("meta", "Tín: \"Ai viết chữ L mà thắt nơ thế này.\""),
        ],
      ],
      terms: ["ra Giêng năm 93"],
    },
    gift: {
      kind: "doc", title: "Cái khăn và gói kẹo", sub: "Quà cảm ơn",
      blocks: [T("p", "Một cái khăn mới, còn nguyên nếp gấp. Một gói kẹo đã chảy dính vào giấy gói.")],
      terms: [],
    },
    twig: {
      kind: "egg", title: "Cành khô buộc ở dây", sub: "Nhỏ, dễ bỏ qua",
      blocks: [T("p", "Một cành khô ai đó buộc vào dây hộp. Ở đốt cuối có một cái chồi bé tí, vẫn còn xanh."), T("meta", "Tín: \"Lạ thật.\"")],
      terms: [],
    },
    ledger: { kind: "ledger", title: "Sổ nhập kho", sub: "Sổ của ông Thuận. Tra theo từ khoá", lit: "read:label", terms: [] },
    // Lit by the label or by the slip: a player who reads the letter first is sent here by the sticky note too.
    provinces: { kind: "provinces", title: "Tờ \"Tỉnh cũ, tỉnh mới\"", sub: "Chị Hằng in khi dời trung tâm", lit: ["read:label", "slip"], terms: [] },
    calendar: { kind: "calendar", title: "Lịch treo tường 2026", sub: "\"Những nhà ga\"", lit: ["read:photoBack", "ok:C"], terms: [] },
  },

  // Words the player can tap in any document or message to write them on the open slip line of the same kind.
  // Longer phrases win ("bến phà Cần Thơ" is one tap, a decoy for the province line).
  taps: {
    province: ["bến phà Cần Thơ", "thành phố Cần Thơ", "tỉnh Cần Thơ", "Cần Thơ", "Hậu Giang", "Sóc Trăng", "Nghệ Tĩnh", "Nghệ An", "Hà Tĩnh", "Lâm Đồng", "Đắk Nông", "Bình Thuận"],
    name: ["bà bán nước", "bà Ga", "chị Ga", "cô Hai"],
    year: [FACTS.ferryLast, "1996"],
    station: ["ga Hà Nội", "ga Hải Phòng", "ga Huế", "ga Nha Trang", "ga Đà Lạt", "ga Sài Gòn", "Trại Mát", "Đà Lạt"],
  },

  ledger: {
    placeholder: "Tên tỉnh, tên nơi, món đồ, số bưu kiện…",
    cover: [T("hand", "SỔ NHẬP KHO. Ghi: số, ngày nhập kho, gửi ai, vì sao trả, đã làm gì. Ai mượn sổ thì trả."), T("meta", "Ô tra không cần gõ dấu.")],
    empty: "Không thấy dòng nào. Ông Thuận ghi theo tên nơi, tên tỉnh, tên món đồ, số bưu kiện.",
    // Shown only after delivery: the reply letter Tín files on the last page (text in answers.js, ending.ledgerLine).
    afterDelivery: { id: "2026", no: null, date: "2026", keys: ["2026", "giữ lại", "bà Ga", "Ga", "thư trả lời", "trả lời", "thư", "viết thư hộ", "không địa chỉ"], terms: [] },
    entries: [
      { id: "12", no: 12, date: "03/9/1992", lines: ["Lá thư tình gửi một xã \"tỉnh Nghệ Tĩnh\". Nghệ Tĩnh tách từ 12/8/1991 thành Nghệ An và Hà Tĩnh; xã ấy nay thuộc Hà Tĩnh. Sửa nhãn, gửi lại. Mong là còn kịp. —T."],
        keys: ["12", "Nghệ Tĩnh", "Nghệ An", "Hà Tĩnh", "thư tình", "thư"], terms: ["Nghệ Tĩnh", "Hà Tĩnh"] },
      { id: "19", no: 19, date: "11/3/1993", lines: ["Một bộ răng giả, không tên người nhận. Ai mất thì tự biết. Nghề gì mà lắm chuyện. —T."], keys: ["19", "răng giả", "răng"], terms: [] },
      { id: "26", no: 26, date: "20/7/1994", lines: ["Con gà trống gỗ sơn đỏ, nhãn ướt mất chữ. Không ai nhận. Để trên nóc tủ cho vui. —T."], keys: ["26", "gà trống", "gà", "gỗ"], terms: [] },
      { id: "33", no: 33, date: "05/4/1995", lines: [
        "Chậu lan, người gửi dặn \"gửi theo tàu hoả lên ga Đà Lạt\". Không có tàu khách đường dài lên ga ấy. Chuyển sang xe khách. Lan tới nơi thì héo.",
        "Năm ngoái tôi lên đó một lần: nhà ga có ba cái chóp mái nhọn như ba quả núi. Đẹp lắm. —T."],
        keys: ["33", "Đà Lạt", "tàu", "tàu hoả", "Trại Mát", "lan", "ga", "chóp mái", "núi"], terms: ["ga Đà Lạt", "Trại Mát"] },
      { id: "47", no: 47, date: FACTS.ledger47, lines: [
        "Bưu kiện gửi \"bà bán nước\", bến phà Cần Thơ (bờ phía thành phố Cần Thơ), nhãn ghi tỉnh Hậu Giang.",
        "Bị trả: không số nhà; tỉnh không đúng. Hậu Giang đã tách từ cuối 1991. Người gửi ghi theo bản đồ cũ, địa chỉ người gửi nước loang.",
        "Tra bảng tỉnh, sửa nhãn, gửi lại sau Tết. Hỏi bên bến phà xem có bà nào bán nước. Thế nào cũng có người nhớ. —T."],
        keys: ["47", "Hậu Giang", "Cần Thơ", "bến phà", "phà", "bà bán nước", "bán nước", "nước", "1996"], terms: ["Hậu Giang", "Cần Thơ"] },
      { id: "1997", no: null, date: "06/01/1997", lines: ["(Nét chữ khác) Từ 1/1/1997 tỉnh tách, trung tâm đổi tên, dời sang chỗ mới. Ông Thuận nhận điều động. Các bưu kiện chờ gửi lại, trong đó có số 47, chuyển vào phòng sau, chờ ông về xử lý."],
        keys: ["1997", "điều động", "gửi lại", "phòng sau", "chuyển", "Thuận", "ông Thuận"], terms: [] },
    ],
  },

  calendar: {
    cover: [T("p", "Lịch treo tường 2026: \"Những nhà ga\". Sáu tờ, mỗi tờ hai tháng một nhà ga, tranh khối giản lược."), T("meta", "Tỉnh ghi theo tên sau 1/7/2025.")],
    // Pinned at the top once the photo's back has been read, so the player does not have to remember it.
    pinned: [T("meta", "Tín ghim lên đầu lịch:"), T("hand", "\"nơi ba ngọn núi đứng trên một mái nhà\""), T("hand", "\"tàu chạy có bảy cây số rồi quay về\"")],
    stations: [
      { name: "Ga Hà Nội (Hà Nội)", shape: "hanoi", text: "Khánh thành 1902. Hai khu đón khách, phía Lê Duẩn và phía Trần Quý Cáp. Người Hà Nội quen gọi ga Hàng Cỏ." },
      { name: "Ga Hải Phòng (Hải Phòng)", shape: "haiphong", text: "Đón tàu từ 1902. Kiến trúc Pháp." },
      { name: "Ga Huế (Huế)", shape: "hue", text: "Sơn màu hồng. Đồng hồ hơn trăm năm ở mặt chính vẫn chạy đúng giờ. Bên sông An Cựu." },
      { name: "Ga Nha Trang (Khánh Hòa)", shape: "nhatrang", text: "Khánh thành 1936." },
      { name: "Ga Đà Lạt (Lâm Đồng)", shape: "dalat", text: "Xây 1932–1938. Ba chóp mái nối liền, người ta hay ví với dáng núi Langbiang. Không còn tàu đường dài; tàu du lịch Đà Lạt – Trại Mát chạy khoảng " + FACTS.trainKm + " km." },
      { name: "Ga Sài Gòn (TP Hồ Chí Minh)", shape: "saigon", text: "Ga hiện nay đón khách từ 1983." },
    ],
    terms: ["ga Hà Nội", "ga Hải Phòng", "ga Huế", "ga Nha Trang", "ga Đà Lạt", "ga Sài Gòn", "Trại Mát", "Lâm Đồng", "Khánh Hòa"],
  },

  provinces: {
    head: [T("p", "TRÍCH: TỈNH CŨ, TỈNH MỚI (những tên hay gặp trong phòng sau)"), T("meta", "Dán nhãn thùng theo tên tỉnh MỚI. Nhãn cũ ghi tên nào thì tra bảng.")],
    cols: ["Mốc", "Tên trên nhãn cũ", "Đổi thành"],
    // Front: the splits, with the 2004 row as a fair decoy. Back: the 2025 mergers (used at the end).
    rows: [
      ["12/8/1991", "Nghệ Tĩnh", "Nghệ An, Hà Tĩnh"],
      ["26/12/1991", "Hậu Giang", "Cần Thơ, Sóc Trăng"],
      ["1/1/2004", "tỉnh Cần Thơ", "thành phố Cần Thơ, tỉnh Hậu Giang (lập lại)"],
    ],
    foot: [T("hand", "Chị Hằng viết tay ở cuối tờ: Đọc theo NĂM GỬI trên dấu bưu điện, không phải năm nay!")],
    backTitle: "Mặt sau: đợt nhập tỉnh 1/7/2025",
    back: [
      ["1/7/2025", "thành phố Cần Thơ, Sóc Trăng, Hậu Giang", "thành phố Cần Thơ"],
      ["1/7/2025", "Lâm Đồng, Đắk Nông, Bình Thuận", "Lâm Đồng"],
    ],
    terms: ["Cần Thơ", "Sóc Trăng", "Hậu Giang", "Lâm Đồng", "Nghệ An", "Hà Tĩnh"],
  },

  clerkThread: "clerk",
  clerk: {
    name: "Ông Thuận",
    ask: "Ông ơi, cháu kẹt dòng \"{field}\".",
    again: "Ông nói rồi đấy. ",
    reworded: "Ông nói cách khác nhé. ",
  },

  threads: [
    // The first two messages of the boss and of the clerk also show as bubbles on the desk, from the first second.
    { id: "boss", name: "Chị Hằng (quản lý)", when: [{ flag: "start" }], messages: [
      { from: "Chị Hằng", text: "Tín ơi, thứ Sáu dời trung tâm. Cái gì còn trong phòng sau là đem xay giấy hết." },
      { from: "Chị Hằng", text: "Hộp nào có phiếu chuyển tiếp chị ký thì được lên xe đi giao. Em vừa lôi hộp 47 ra, vậy em điền phiếu cho nó đi." },
      { from: "me", when: [{ flag: "stage:2" }], text: "Một cái hộp bé tí mà cũng phải có phiếu." },
      { from: "Chị Hằng", when: [{ flag: "stage:2" }], text: "Chị vừa pha ấm trà, ra uống đi." },
      { from: "me", when: [{ flag: "stage:2" }], text: "Em không uống trà. Đắng." },
    ] },
    { id: "clerk", name: "Ông Thuận (người ghi sổ, nghỉ hưu)", when: [{ flag: "start" }], messages: [
      { from: "Ông Thuận", text: "Ông Thuận đây, người giữ phòng sau hồi trước, giờ nghỉ hưu rồi. Sổ nhập kho trên bàn là sổ của ông." },
      { from: "Ông Thuận", text: "Kẹt dòng nào trên phiếu thì cháu bấm nút \"Hỏi ông Thuận\" ở đáy màn hình. Ông chỉ chỗ nhìn, không nói đáp án." },
    ] },
    { id: "watch", name: "Tiệm sửa đồng hồ", when: [{ flag: "stage:2" }], messages: [
      { from: "Tiệm đồng hồ", text: "Cái đồng hồ đeo tay cháu gửi sửa xong rồi. Thay dây mới, máy lau dầu. Rảnh thì ghé lấy." },
      { from: "me", text: "Dạ. Đưa cái hộp này về đúng chỗ của nó rồi em ghé." },
    ] },
    // The ferry group: Tín's question waits as a draft until the player presses the post button (`post` flag);
    // every reply follows it. `marks`: a small tag next to a sender who moves the story on.
    { id: "group", name: "Hội chờ phà năm xưa", sub: "Nhóm bến phà Cần Thơ ngày trước", post: "post:group",
      marks: { "Cô Tư vé số": "nhớ bà" }, when: [{ flag: "stage:2" }], messages: [
      { from: "me", when: [{ flag: "post:group" }], text: "Chào cả nhà. Cháu tìm một bà bán nước ở bến phà Cần Thơ, khoảng năm 1996. Trước đó bà bán ở sân ga. Ai còn nhớ bà không ạ? Cháu có bưu kiện gửi bà." },
      { from: "Ảnh bìa nhóm", when: [{ flag: "post:group" }], text: "Bến phà Cần Thơ, ngày cầu Cần Thơ thông xe: " + FACTS.ferryLast + ". Mấy hôm sau phà ngừng hẳn.", terms: [FACTS.ferryLast] },
      { from: "Chú Ba xe ôm", when: [{ flag: "post:group" }], text: "Hồi đó bến có cả chục người bán nước, kiếm sao ra." },
      { from: "Cô Tư vé số", when: [{ flag: "post:group" }], text: "Bà Ga hả! Bà hay kể hồi bán nước ngoài ga hoài, nên tụi tui kêu là bà Ga.", terms: ["bà Ga"] },
      { from: "Cô Tư vé số", when: [{ flag: "ok:E" }], text: "Mà cậu tìm bả chi?" },
      { from: "me", when: [{ flag: "ok:E" }], text: "Có lá thư của bà, gửi từ năm 96." },
      { from: "Cô Tư vé số", when: [{ flag: "ok:E" }], text: "Trời đất. Bả bán tới bữa chuyến phà cuối. Bả nói: phà ngừng thì tôi đi." },
      { from: "Chú Ba xe ôm", when: [{ flag: "ok:E" }], text: "Bữa cầu khánh thành, phà kéo còi muốn đứt ruột. Chạy thêm mấy bữa rồi thôi." },
      { from: "Cô Tư vé số", when: [{ flag: "stage:3" }], text: "Khoan, để tui lục. Bả có gửi hình về, hồi Tết đầu tiên ở chỗ mới." },
      { from: "Cô Tư vé số", when: [{ flag: "stage:3" }],
        photo: "dalat", caption: "Ảnh cũ, đã ngả màu.",
        back: "Tết " + FACTS.photoYear + ". Gửi Tư. Chỗ mới lạnh. Sáng nào chị cũng ra đây ngồi coi tàu. Tàu chạy có bảy cây số rồi quay về, chẳng lạc ai. Chị Ga.",
        backTerms: [String(FACTS.photoYear), "chị Ga", "bảy cây số"] },
      { from: "Cô Tư vé số", when: [{ flag: "stage:3" }],
        text: "Chỗ bả ngồi mỗi sáng đó, bả kêu là \"nơi ba ngọn núi đứng trên một mái nhà\". Tui hỏi chỗ nào, bả cười, nói: đố đó." },
      { from: "Cô Tư vé số", when: [{ flag: "stage:3" }],
        text: "Con gái út của bả mới đăng hình tuần rồi: bả vẫn ngồi đúng cái ghế đó, sáng nào cũng ra." },
    ] },
  ],

  slip: {
    title: "Phiếu chuyển tiếp — bưu kiện 47",
    // Shown with the slip the moment it appears, right after the letter.
    arrive: [
      ["Tín", "Câu hỏi trong thư chỉ bà ấy trả lời được. Thứ Sáu là nó vào máy xay."],
      ["", "Tín kẹp phiếu chuyển tiếp lên hộp. Không sửa nhãn cũ nữa: phiếu này thay cho nhãn."],
      ["", "Cách điền: dòng đang điền nằm ở đáy màn hình. Chạm vào một chữ có gạch chấm trong giấy tờ hay tin nhắn, rồi bấm \"Ghi\" để ghi chữ đó vào dòng."],
      ["", "Điền đúng hết các dòng thì hiện nút \"Gửi đi\". Bấm nút ấy, chị Hằng ký, hộp được lên xe."],
    ],
    notYet: "Chưa có phiếu. Đọc hết lá thư trong hộp đã.",
    recipient: "Bà bán nước, ngày trước bán ở sân ga",
    recipientLabel: "Người nhận",
    stages: [
      { label: "1996 · bến phà", lines: ["A"] },
      { label: "rời bến", lines: ["E", "B"] },
      { label: "2026", lines: ["C", "D"] },
    ],
    // kind = which tappable words fill it (taps above); auto = filled by the story when the line before is right.
    fields: [
      { id: "A", short: "Tỉnh của người nhận", label: "Tỉnh của người nhận (theo năm gửi)", kind: "province", placeholder: "tên tỉnh" },
      { id: "E", short: "Tên người quen gọi bà", label: "Tên người quen gọi bà", kind: "name", placeholder: "tên gọi" },
      { id: "B", short: "Năm bà rời bến phà", label: "Năm bà rời bến phà", kind: "year", placeholder: "năm", numeric: true },
      { id: "C", short: "Nơi giao", label: "Nơi giao bây giờ (bà đang ở đâu)", kind: "station", placeholder: "nơi giao" },
      { id: "D", short: "Tỉnh nơi giao", label: "Tỉnh nơi giao (tên hiện nay)", kind: "province", auto: true },
    ],
  },

  shelf: {
    empty: "Kệ còn trống.",
    delivered: "Cái khăn và gói kẹo: đã về tay bà Ga, sau ba mươi năm.",
    eggLabel: "Cành lộc:",
  },
};

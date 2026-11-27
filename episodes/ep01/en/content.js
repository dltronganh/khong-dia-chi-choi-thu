// Episode 1 content, English version: parcel no. 47 for "Bà Ga".
// Written afresh in English rather than translated line by line; same facts, same answers, same structure.
// Vietnamese personal names and place names are kept as they are, with their accents.
// Answers, story beats, hints and the ending are NOT here: they are encoded in answers.js (tools/encode_answers.ps1 -Lang en).
// Every number shared with the Vietnamese version comes from FACTS there, so both versions always agree.
import { FACTS } from "../content.js";

export { FACTS };

const T = (t, text) => ({ t, text });

export const EP = {
  id: "ep01",
  lang: "en",
  storageKey: "kdc.ep01.en.v2",
  codePrefix: "KDC2E-",
  subtitle: "Parcel no. 47",
  intro: [
    "Parcel no. 47 has been waiting thirty years.",
    "Inside is a letter about a little boy lost at a station.",
    "You are Tín. This morning you pulled it off the pile for the shredder.",
  ],
  // A short guide to Vietnamese forms of address, shown on the intro and in the notebook.
  nameNote: [
    "Names are kept in Vietnamese. The word in front of a name shows age and respect:",
    "Bà = an old lady, granny · Ông = an old man · Cô = a woman, auntie · Chú = a man, uncle · Chị = a woman a bit older than you.",
    "Tết = Lunar New Year.",
  ],
  boxTag: "FOR THE SHREDDER — Friday",
  // Tín's sticky note "Right now": the last entry whose flags are all set. Points where to look, never the answer.
  // The group's name holds an answer word (Cần Thơ), so notes say "the ferry group"; the phone list shows both names.
  // `target`: where the note's button goes (an object, "phone:<thread>", or "act:<action>"; js/loop.js todoEntry).
  todo: [
    { need: [], target: "label", text: "The parcel came back because the label has the wrong province. Open the box, read the label." },
    { need: ["read:label"], target: "letter", text: "There's a letter in the box too. Read it: who's waiting for this?" },
    { need: ["slip"], target: "provinces", text: "The label says Hậu Giang province. Was that still a province in 1996? Check the \"Old provinces, new provinces\" sheet on the desk." },
    { need: ["stage:2"], target: "act:post:group", text: "Is she still selling at the ferry landing? Post a question in the ferry group on the phone." },
    { need: ["stage:2", "post:group"], target: "phone:group", text: "Cô Tư in the ferry group remembers her. Read what the ferry people called her, and when she left." },
    { need: ["stage:3"], target: "phone:group", text: "Where does she sit every morning? Turn over the photo Cô Tư posted in the ferry group." },
    { need: ["stage:3", "read:photoBack"], target: "calendar", text: "She calls her spot \"where three mountains share one roof\". The calendar on the desk is all stations: have a look." },
    { need: ["slip:full"], target: "act:send", text: "Every line on the slip is filled in. Tap \"Send it off\" for Chị Hằng to sign." },
    { need: ["delivered"], target: "ending", text: "On the van tomorrow morning." },
  ],
  deskTitle: "The desk in the back room",
  desk: ["provinces", "ledger", "calendar"],
  dimLine: "Not needed yet.",

  objects: {
    box: {
      kind: "box", title: "Parcel no. 47", sub: "A small cardboard box, tied with string",
      blocks: [T("meta", "The cardboard has gone yellow and soft at the corners. There are a few things inside.")],
      children: ["label", "letter", "gift", "twig"],
    },
    label: {
      kind: "doc", title: "Parcel label", sub: "Stuck on the lid",
      blocks: [
        T("meta", "To:"),
        T("brother", "The old lady who sells drinks. She used to sell them at the station"),
        T("smudge", "[a water stain here: the station's name is gone]"),
        T("brother", "and now sells them at the Cần Thơ ferry landing, Hậu Giang province."),
        T("meta", "Postmark: [smudged] " + FACTS.postmark),
        T("stamp", "RETURN TO SENDER. Undeliverable: no house number; wrong province."),
        T("meta", "From:"),
        T("brother", "The one who writes letters for the whole hamlet,"),
        T("brother", "written on behalf of Cô Hai, who sells sticky rice, from the hamlet of"),
        T("smudge", "[the rest is water-stained and can't be read]"),
        T("pencil", "In pencil in the corner: 47"),
        T("meta", "Tín: \"Wrong province? There's Chị Hằng's ‘Old provinces, new provinces’ sheet on the desk. And that pencilled 47 is a number in Ông Thuận's storeroom ledger.\""),
      ],
      terms: ["Cần Thơ ferry landing", "Hậu Giang", FACTS.postmark, "no. 47", "the drinks seller"],
    },
    letter: {
      kind: "letter", title: "The letter in the parcel", sub: "Lined school paper, large handwriting",
      // Read in three parts. The slip appears after the last one, so the reason to fill it comes first.
      parts: [
        [
          T("brother", "To the lady who sells drinks,"),
          T("brother", "I am the one in our hamlet who writes everybody's letters. Just after Tết in '93, our hamlet lost a little boy at the station. He was about three. The crowd was terrible and his hand slipped out of mine."),
          // Tín stops for a beat at the year, then moves on. Nothing is explained.
          T("meta", "Tín stops at \"'93\". He reads that line again."),
        ],
        [
          T("brother", "People told us an old lady selling drinks gave him something to drink and led him out of the crush. Nobody knows who she left him with. We have not seen him since."),
          T("brother", "I asked around that station for a long time. In the end someone told me you had gone with your daughter to sell drinks at the Cần Thơ ferry landing. I copied the province off the old map on our wall. I hope it is right."),
        ],
        [
          T("brother", "Everyone in the hamlet chipped in what they could for this scarf and these sweets, to thank you for the drink you gave him."),
          T("brotherBold", "If you remember who you left him with, please write back to us."),
          T("brother", "Forgive my poor handwriting. From the one who writes the letters."),
          T("meta", "Tín: \"Who writes an L with a little bow tied in it?\""),
        ],
      ],
      terms: ["just after Tết in '93"],
    },
    gift: {
      kind: "doc", title: "The scarf and the sweets", sub: "A thank-you present",
      blocks: [T("p", "A new scarf, still in its shop folds. A bag of sweets that has melted into the wrapper.")],
      terms: [],
    },
    twig: {
      kind: "egg", title: "A dry twig on the string", sub: "Small, easy to miss",
      blocks: [T("p", "Someone tied a dry twig to the string round the parcel. At the last joint there is one tiny bud, still green."), T("meta", "Tín: \"Huh. Odd.\"")],
      terms: [],
    },
    ledger: { kind: "ledger", title: "Storeroom ledger", sub: "Ông Thuận's book. Search it by keyword", lit: "read:label", terms: [] },
    // Lit by the label or by the slip: a player who reads the letter first is sent here by the sticky note too.
    provinces: { kind: "provinces", title: "\"Old provinces, new provinces\"", sub: "A sheet Chị Hằng printed for the move", lit: ["read:label", "slip"], terms: [] },
    calendar: { kind: "calendar", title: "Wall calendar 2026", sub: "\"Railway stations\"", lit: ["read:photoBack", "ok:C"], terms: [] },
  },

  // Words the player can tap in any document or message to write them on the open slip line of the same kind.
  taps: {
    province: ["Cần Thơ ferry landing", "Cần Thơ city", "Cần Thơ province", "Cần Thơ", "Hậu Giang", "Sóc Trăng", "Nghệ Tĩnh", "Nghệ An", "Hà Tĩnh", "Lâm Đồng", "Đắk Nông", "Bình Thuận"],
    name: ["the old lady who sells drinks", "Bà Ga", "Chị Ga", "Cô Hai"],
    year: [FACTS.ferryLast, "1996"],
    station: ["Hà Nội station", "Hải Phòng station", "Huế station", "Nha Trang station", "Đà Lạt station", "Sài Gòn station", "Trại Mát", "Đà Lạt"],
  },

  ledger: {
    placeholder: "A province, place, item or parcel number…",
    cover: [T("hand", "STOREROOM LEDGER. For every parcel: number, date in, who it's for, why it came back, what was done. If you borrow this book, bring it back."), T("meta", "Search in English or Vietnamese. Accents not needed.")],
    empty: "Nothing found. Ông Thuận filed things by place, province, item and parcel number.",
    // Shown only after delivery: the reply letter Tín files on the last page (text in answers.js, ending.ledgerLine).
    afterDelivery: { id: "2026", no: null, date: "2026", keys: ["2026", "kept", "keep", "Bà Ga", "Ga", "reply", "reply letter", "letter", "letter writer", "no address", "giữ lại", "thư trả lời"], terms: [] },
    entries: [
      { id: "12", no: 12, date: "03/9/1992", lines: ["A love letter for a commune in \"Nghệ Tĩnh province\". Nghệ Tĩnh was split on 12/8/1991 into Nghệ An and Hà Tĩnh; that commune is in Hà Tĩnh now. Label corrected, sent off again. Hope it's not too late. —T."],
        keys: ["12", "Nghệ Tĩnh", "Nghệ An", "Hà Tĩnh", "love letter", "love", "letter", "thư tình"], terms: ["Nghệ Tĩnh", "Hà Tĩnh"] },
      { id: "19", no: 19, date: "11/3/1993", lines: ["A set of false teeth, no name. Whoever lost them will know. Funny old job. —T."], keys: ["19", "false teeth", "teeth", "dentures", "răng giả"], terms: [] },
      { id: "26", no: 26, date: "20/7/1994", lines: ["A wooden rooster painted red. The label got soaked and is blank. Nobody claimed it, so it lives on top of the cupboard now. Makes me smile. —T."], keys: ["26", "rooster", "chicken", "wooden", "wood", "gà trống"], terms: [] },
      { id: "33", no: 33, date: "05/4/1995", lines: [
        "A potted orchid. The sender wanted it to go \"by train up to Đà Lạt station\". No long-distance trains go to that station any more, so it went by coach. The orchid arrived wilted.",
        "I went up there myself last year. The station has three pointed roof peaks, like three mountains side by side. Lovely. —T."],
        keys: ["33", "Đà Lạt", "station", "railway", "train", "Trại Mát", "orchid", "flower", "roof", "peaks", "mountain", "mountains", "ga", "chóp mái"], terms: ["Đà Lạt station", "Trại Mát"] },
      { id: "47", no: 47, date: FACTS.ledger47, lines: [
        "Parcel for \"the old lady who sells drinks\", Cần Thơ ferry landing (on the Cần Thơ city side of the river). Label says Hậu Giang province.",
        "Came back: no house number, wrong province. Hậu Giang had already been split up at the end of 1991; the sender went by an old map. The sender's address has washed out.",
        "To do: check the province table, correct the label, send it again after Tết. Ask at the landing whether anyone knows the old lady who sells drinks. Someone will. —T."],
        keys: ["47", "Hậu Giang", "Cần Thơ", "ferry landing", "ferry", "drinks seller", "drinks", "drink", "water", "old lady", "bến phà", "bà bán nước", "1996"], terms: ["Hậu Giang", "Cần Thơ"] },
      { id: "1997", no: null, date: "06/01/1997", lines: ["(Different handwriting) From 1/1/1997 the provinces split again, and the centre gets a new name and moves. Ông Thuận has been transferred. Parcels waiting to go out again, no. 47 among them, moved to the back room until he can see to them."],
        keys: ["1997", "transfer", "transferred", "moved", "move", "back room", "send again", "Thuận", "Ông Thuận"], terms: [] },
    ],
  },

  calendar: {
    cover: [T("p", "Wall calendar 2026: \"Railway stations\". Six pages, one station for every two months, drawn in simple blocks."), T("meta", "Provinces are given by their names after 1/7/2025.")],
    // Pinned at the top once the photo's back has been read, so the player does not have to remember it.
    pinned: [T("meta", "Tín has pinned to the top:"), T("hand", "\"where three mountains share one roof\""), T("hand", "\"It only goes seven kilometres and comes back\"")],
    stations: [
      { name: "Hà Nội station (Hà Nội)", shape: "hanoi", text: "Opened 1902. Two entrance halls, one on Lê Duẩn street and one on Trần Quý Cáp street. Locals still call it Hàng Cỏ station." },
      { name: "Hải Phòng station (Hải Phòng)", shape: "haiphong", text: "Trains since 1902. French-style building." },
      { name: "Huế station (Huế)", shape: "hue", text: "Painted pink, beside the An Cựu river. The clock on its front is over a hundred years old and still keeps time." },
      { name: "Nha Trang station (Khánh Hòa)", shape: "nhatrang", text: "Opened 1936." },
      { name: "Đà Lạt station (Lâm Đồng)", shape: "dalat", text: "Built 1932–1938. Three roof peaks joined together, often said to look like Langbiang mountain. No long-distance trains now; a tourist train runs from Đà Lạt to Trại Mát and back, about " + FACTS.trainKm + " km each way." },
      { name: "Sài Gòn station (Hồ Chí Minh City)", shape: "saigon", text: "The present building has taken passengers since 1983." },
    ],
    terms: ["Hà Nội station", "Hải Phòng station", "Huế station", "Nha Trang station", "Đà Lạt station", "Sài Gòn station", "Trại Mát", "Lâm Đồng", "Khánh Hòa"],
  },

  provinces: {
    head: [T("p", "OLD PROVINCES, NEW PROVINCES (the names you'll see most in the back room)"), T("meta", "Whatever an old label says, look it up here. Crates for the move get the NEW name.")],
    cols: ["Date", "Name on an old label", "Became"],
    rows: [
      ["12/8/1991", "Nghệ Tĩnh", "Nghệ An, Hà Tĩnh"],
      ["26/12/1991", "Hậu Giang", "Cần Thơ, Sóc Trăng"],
      ["1/1/2004", "Cần Thơ province", "Cần Thơ city, Hậu Giang province (brought back)"],
    ],
    foot: [T("hand", "Chị Hằng has scribbled at the bottom: Go by the YEAR IT WAS POSTED (see the postmark), not by this year!")],
    backTitle: "On the back: the mergers of 1/7/2025",
    back: [
      ["1/7/2025", "Cần Thơ city, Sóc Trăng, Hậu Giang", "Cần Thơ city"],
      ["1/7/2025", "Lâm Đồng, Đắk Nông, Bình Thuận", "Lâm Đồng"],
    ],
    terms: ["Cần Thơ", "Sóc Trăng", "Hậu Giang", "Lâm Đồng", "Nghệ An", "Hà Tĩnh"],
  },

  clerkThread: "clerk",
  clerk: {
    name: "Ông Thuận",
    ask: "Ông Thuận, I'm stuck on \"{field}\".",
    again: "As I said. ",
    reworded: "Let me put it another way. ",
  },

  threads: [
    // The first two messages of the boss and of the clerk also show as bubbles on the desk, from the first second.
    { id: "boss", name: "Chị Hằng (your boss)", when: [{ flag: "start" }], messages: [
      { from: "Chị Hằng", text: "Tín, we move on Friday. Whatever is still in the back room by then gets pulped." },
      { from: "Chị Hằng", text: "Any box with a forwarding slip I've signed goes out on the van. You've just rescued box 47, so fill in a slip for it." },
      { from: "me", when: [{ flag: "stage:2" }], text: "A whole slip. For one tiny parcel." },
      { from: "Chị Hằng", when: [{ flag: "stage:2" }], text: "I've just made a pot of tea. Come and have a cup." },
      { from: "me", when: [{ flag: "stage:2" }], text: "I don't drink tea. Too bitter." },
    ] },
    { id: "clerk", name: "Ông Thuận (retired clerk, kept the ledger)", when: [{ flag: "start" }], messages: [
      { from: "Ông Thuận", text: "Thuận here. I ran that back room, years ago. Retired now. The ledger on the desk is mine." },
      { from: "Ông Thuận", text: "Stuck on a line of the slip? Tap \"Ask Ông Thuận\" at the bottom of the screen, lad. I'll tell you where to look, not what to write." },
    ] },
    { id: "watch", name: "Watch repair shop", when: [{ flag: "stage:2" }], messages: [
      { from: "Watch shop", text: "Your watch is ready. New strap, cleaned and oiled. Pop in when you're free." },
      { from: "me", text: "Thanks. I'll come and get it once this parcel's gone where it belongs." },
    ] },
    // The ferry group: Tín's question waits as a draft until the player presses the post button (`post` flag);
    // every reply follows it. `marks`: a small tag next to a sender who moves the story on.
    { id: "group", name: "Old Cần Thơ ferry (group)", sub: "People from the old Cần Thơ ferry landing", post: "post:group",
      marks: { "Cô Tư (lottery tickets)": "remembers her" }, when: [{ flag: "stage:2" }], messages: [
      { from: "me", when: [{ flag: "post:group" }], text: "Hi all. Does anyone remember an old lady who sold drinks at the Cần Thơ ferry landing around 1996? She used to sell at a station before that. I've got a parcel for her." },
      { from: "Group cover photo", when: [{ flag: "post:group" }], text: "Cần Thơ ferry landing on the day Cần Thơ bridge opened: " + FACTS.ferryLast + ". A few days later the ferry stopped for good.", terms: [FACTS.ferryLast] },
      { from: "Chú Ba (motorbike taxi)", when: [{ flag: "post:group" }], text: "There were a dozen people selling drinks at that landing. Good luck." },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "post:group" }], text: "Bà Ga! She never stopped talking about her old pitch at the station. Ga means station, so that's what we all called her: Bà Ga.", terms: ["Bà Ga"] },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "ok:E" }], text: "So why are you after her?" },
      { from: "me", when: [{ flag: "ok:E" }], text: "I've got a letter for her. Posted in '96." },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "ok:E" }], text: "Goodness. She sold drinks right up to the very last ferry. She always said: when the ferry goes, I go." },
      { from: "Chú Ba (motorbike taxi)", when: [{ flag: "ok:E" }], text: "The day the bridge opened, the ferry sounded its horn like its heart was breaking. It ran a few more days, then that was it." },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "stage:3" }], text: "Wait, let me dig. She sent me a photo once. Her first Tết in the new place." },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "stage:3" }],
        photo: "dalat", caption: "An old photo, faded.",
        back: "Tết " + FACTS.photoYear + ". For Tư. It's cold in the new place. Every morning I come out, sit here and watch the train. It only goes seven kilometres and comes back. Never loses anyone. Chị Ga.",
        backTerms: [String(FACTS.photoYear), "Chị Ga", "seven kilometres"] },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "stage:3" }],
        text: "That spot where she sits every morning, she called it \"where three mountains share one roof\". I asked her where that was. She just laughed and said it was a riddle." },
      { from: "Cô Tư (lottery tickets)", when: [{ flag: "stage:3" }],
        text: "Her youngest daughter posted a picture only last week. She's still on that same bench, every morning." },
    ] },
  ],

  slip: {
    title: "Forwarding slip — parcel 47",
    // Shown with the slip the moment it appears, right after the letter.
    arrive: [
      ["Tín", "Only she can answer the letter's question. And on Friday this goes in the shredder."],
      ["", "Tín clips a forwarding slip to the box. No more fixing the old label: this slip replaces it."],
      ["", "How to fill it in: the line you're on sits at the bottom of the screen. Tap a word with a dotted underline in any paper or message, then tap \"Write it\" to put it on that line."],
      ["", "Once every line is right, a \"Send it off\" button appears. Tap it: Chị Hằng signs, and the box goes on the van."],
    ],
    notYet: "No slip yet. Read the letter in the box to the end first.",
    recipient: "The old lady who sells drinks, who used to sell them at the station",
    recipientLabel: "To",
    stages: [
      { label: "1996 · ferry", lines: ["A"] },
      { label: "left the ferry", lines: ["E", "B"] },
      { label: "2026", lines: ["C", "D"] },
    ],
    fields: [
      { id: "A", short: "Recipient's province", label: "Recipient's province (as of the posting year)", kind: "province", placeholder: "province" },
      { id: "E", short: "The name people knew her by", label: "The name people knew her by", kind: "name", placeholder: "name" },
      { id: "B", short: "Year she left the ferry landing", label: "Year she left the ferry landing", kind: "year", placeholder: "year", numeric: true },
      { id: "C", short: "Deliver to", label: "Deliver to (where she is now)", kind: "station", placeholder: "place" },
      { id: "D", short: "Province of delivery", label: "Province of delivery (current name)", kind: "province", auto: true },
    ],
  },

  shelf: {
    empty: "The shelf is still empty.",
    delivered: "The scarf and the sweets: back in Bà Ga's hands, thirty years late.",
    eggLabel: "Twigs in bud:",
  },
};

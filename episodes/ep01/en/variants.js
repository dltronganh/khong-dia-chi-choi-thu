// Short-text version of the opening, English (see ../variants.js: same structure, same panels).
const T = (t, text) => ({ t, text });
const P = (id) => ({ t: "panel", id });
const LEAD = "Your move: the tied box is right next to the shredder.";
const KEEP_LEAD = "Tín isn't handing it over. Tap to have Tín keep the box.";
const SLIP_SAID = "Then fill in a forwarding slip yourself. Read through the box and I'll give you the slip; I sign, it goes on the van. Not done by Friday, it's shredded.";

export const SHORT = {
  intro: [
    { panel: "cart", act: "Lift out the tied box", lead: LEAD, lines: [
      ["", "The post centre's back room, where undeliverable parcels end up."],
      ["Chị Hằng, the manager", "We move out on Friday. Any box still here goes in the shredder."],
    ] },
    { panel: "lift", lines: [["", "You are Tín. This is box 47."]] },
    { panel: "refuse", lines: [
      ["Chị Hằng", "Thirty years and nobody came for it. Give it here, in it goes."],
      ["Tín", "No. The label still says who it's for."],
    ] },
    { panel: "van", lines: [["Chị Hằng", SLIP_SAID]] },
  ],
  introB: [
    { act: "Lift out the tied box", lead: LEAD, lines: [
      ["", "The post centre's back room, where undeliverable parcels end up."],
      ["Chị Hằng, the manager", "We move out on Friday. Any box still here goes in the shredder."],
    ] },
    { lines: [["", "You are Tín. This is box 47."]] },
    { act: "Keep the box", lead: KEEP_LEAD, lines: [["Chị Hằng", "Thirty years and nobody came for it. Give it here, in it goes."]] },
    { lines: [
      ["", "You step back with the box, turn the torn label over and point at the addressee line."],
      ["Tín", "No. The label still says who it's for. I'll get it into their hands myself."],
    ] },
    { lines: [["Chị Hằng", SLIP_SAID]] },
  ],
  bubbles: [["clerk", 1]],
  seenAtStart: [["boss", 2], ["clerk", 2]],
  clerkFirst: "Ông Thuận here. I ran the back room years ago; I logged box 47 in myself. If you get stuck, ask me.",
  todo: {
    0: "Open the box and read the label: why was it sent back?",
    1: "Read the letter in the box: who is waiting?",
    2: "Was Hậu Giang still a province in 1996? Check the \"Old provinces, new provinces\" table on the desk.",
  },
  labelLast: "Tín: \"Sent back for the wrong province: the label says Hậu Giang, posted in 1996.\"",
  lit: { ledger: ["ok:A"] },
  howTo: "Tap a word with a dotted underline, then \"Write it\" to put it on the line you are filling in.",
  letter: [
    [
      P("writing"), T("brother", "I am the one in our hamlet who writes everybody's letters. Just after Tết in '93, our hamlet lost a little boy at the station. He was about three."),
      P("apart"), T("brother", "The crowd was terrible and his hand slipped out of mine."),
      T("meta", "Tín goes back to \"Just after Tết in '93\" and reads it again."),
    ],
    [
      P("glass"), T("brother", "People told us an old lady selling drinks gave him something to drink and led him out of the crush. Nobody knows who she left him with."),
      T("brother", "I asked around that station for a long time. In the end someone told me you had gone with your daughter to sell drinks at the Cần Thơ ferry landing. I copied the province off the old map on our wall. I hope it is right."),
    ],
    [
      P("giver"), T("brotherBold", "If you remember who you left him with, please write back to us."),
      // One line kept in the writer's own hand, so Tín's remark on the letter L sits next to the handwriting it is about.
      T("meta", "One line as the writer wrote it:"),
      T("brotherHand", "The crowd was terrible and his hand slipped out of mine."),
      T("meta", "Tín: \"Who writes an L with a little bow tied in it?\""),
    ],
  ],
  // Sentences of the whole letter left out of the excerpts on purpose: none of them carries a clue (tests check that
  // every other sentence of the letter stands in the excerpts).
  letterLeftOut: [
    "To the lady who sells drinks,",
    "We have not seen him since.",
    "Everyone in the hamlet chipped in what they could for this scarf and these sweets, to thank you for the drink you gave him.",
    "Forgive my poor handwriting.",
    "From the one who writes the letters.",
  ],
  fold: "Fold the letter",
  foldTodo: "You've read the letter. Tap \"Fold the letter\".",
  stagesSaid: "Three stages along her road: 1996 at the ferry → when she left it → now, 2026.",
  slipPanel: "slip",
  arrive: [
    ["Tín", "The question in the letter is hers to answer. My job is to get this box into her hands."],
    ["", "Chị Hằng hands over the forwarding slip. Tín clips it to the box, in place of the old label."],
    ["Tín", "For the box to reach her, the slip's first line needs the province that ferry was in the year it was posted, 1996. Get it wrong and the box comes back again."],
    // Said as the ask button first shows under the slip: who he is and what asking him gives (never an answer).
    ["Ông Thuận, the old storeman", "I've filled in these slips for decades. Stuck on a line? Tap \"Ask Ông Thuận\" and I'll show you where to look."],
  ],
  provincesTitle: "\"Old provinces, new provinces\" table",
  // Chị Hằng's note sits right under the table's title (it was easy to skip at the foot): her words as they are, only where it is said.
  yearNote: "Chị Hằng has scribbled at the top: Go by the YEAR IT WAS POSTED (see the postmark), not by this year!",
  guess: {
    line: "A",
    ask: "Before you look it up, have a guess: was Hậu Giang still a province in 1996? A wrong guess is fine, the table will tell.",
    options: [["yes", "Still was"], ["no", "Not any more"], ["unsure", "No idea, show the table"]],
    said: { yes: "Your guess: still was. Let's see what the table says.", no: "Your guess: not any more. Let's see what the table says.", unsure: "No guess. Let's see what the table says." },
    ack: {
      yes: "Missed that guess, but now we know: by 1996 there was no Hậu Giang province any more.",
      no: "Good guess: by 1996 there was no Hậu Giang province any more. Now we know for sure.",
      unsure: "Now we know: by 1996 there was no Hậu Giang province any more.",
    },
  },
  alt: {
    cart: "A trolley of boxes beside a paper shredder. The box tied with string is on top, nearest the machine.",
    lift: "Someone carries the tied box away from the shredder. There is a gap on the trolley.",
    refuse: "Someone holds the tied box close, on their far side. On the right, someone else stands holding an open hand out towards the box. The shredder is behind them.",
    van: "A van with its back doors open and exactly one empty space inside. The tied box stands outside, with a slip.",
    writing: "A hand writing a letter. The sleeve has striped cuffs.",
    apart: "The hand from the striped sleeve, open and empty. A child is swept away in the crowd, one arm reaching back.",
    glass: "A lady in a hat, beside a drinks table, holds out a glass to a child.",
    giver: "The lady in the hat leads the child. The child's other hand is taken by a hand coming in from outside the frame; we never see who.",
    slip: "The tied box on the desk with a blank slip clipped to it. Behind, the trolley of other boxes stands by the shredder.",
  },
};

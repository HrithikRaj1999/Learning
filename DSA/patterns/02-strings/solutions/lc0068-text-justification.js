/*
Text Justification (LC 68)

Pack words into lines of exactly maxWidth characters.
  - greedily fit as many words per line as possible
  - spread the extra spaces EVENLY between words
  - if they do not divide evenly, the LEFT gaps get one more
  - the LAST line is left justified, single spaces, padded on the right
  - a line with only one word is also left justified

  words = ["This","is","an","example","of","text","justification."]
  maxWidth = 16
    -> [ "This    is    an",
         "example  of text",
         "justification.  " ]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Two separate jobs, and mixing them is what makes this problem feel hard:
      1. PACKING - which words go on which line
      2. PADDING - how to distribute spaces inside one line
  I solve packing greedily, then pad each line independently.
- Packing rule: keep adding words while
      (total characters) + (number of words - 1 minimum spaces) <= maxWidth
  The "-1" is because n words need n-1 gaps of at least one space.
- Padding rule for a normal line with g = wordCount - 1 gaps and
  extra = maxWidth - totalWordLength spaces to give out:
      every gap gets  floor(extra / g)
      the first (extra % g) gaps get one MORE
  That is exactly "left gaps get the surplus".
- Two lines break the rule and are left justified instead:
  the last line, and any line holding a single word (g = 0, so dividing
  would crash).

- The ladder:
    1. pack, then build each line by pushing spaces one at a time until
       the width is reached                                O(n * maxWidth)
    2. pack, then compute base and surplus per gap and     O(total output)
       build each line directly

- Traps:
    - division by zero when a line has one word. Guard it first.
    - the last line is always single-spaced, even if it is full.
    - the surplus goes to the LEFT gaps, not the right.
    - every returned line must be exactly maxWidth long, including the
      last one, which is right-padded.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
PACKING, words = ["This","is","an","example","of","text","justification."]
maxWidth = 16

  line 1 try "This"                    letters 4,  gaps 0, needs 4  <= 16 ok
         add "is"                      letters 6,  gaps 1, needs 7  <= 16 ok
         add "an"                      letters 8,  gaps 2, needs 10 <= 16 ok
         add "example"                 letters 15, gaps 3, needs 18 > 16 STOP
         line 1 = ["This","is","an"]

  line 2 "example"                     letters 7,  gaps 0, needs 7  ok
         add "of"                      letters 9,  gaps 1, needs 10 ok
         add "text"                    letters 13, gaps 2, needs 15 ok
         add "justification."          letters 27, gaps 3, needs 30 > 16 STOP
         line 2 = ["example","of","text"]

  line 3 = ["justification."]          the last line

PADDING line 1 = ["This","is","an"], maxWidth = 16

  totalWordLength = 4 + 2 + 2 = 8
  gaps  = 3 - 1 = 2
  extra = 16 - 8 = 8 spaces to distribute

  base    = floor(8 / 2) = 4      every gap gets 4
  surplus = 8 % 2 = 0             no gap gets a bonus

  "This" + "    " + "is" + "    " + "an"
   4        4       2      4        2   = 16   OK
  -> "This    is    an"

PADDING line 2 = ["example","of","text"], maxWidth = 16

  totalWordLength = 7 + 2 + 4 = 13
  gaps  = 2
  extra = 16 - 13 = 3

  base    = floor(3 / 2) = 1      every gap gets 1
  surplus = 3 % 2 = 1             the FIRST 1 gap gets one more

  gap 0 -> 1 + 1 = 2 spaces       (index 0 < surplus 1, so bonus)
  gap 1 -> 1 spaces               (index 1 >= surplus, no bonus)

  "example" + "  " + "of" + " " + "text"
   7           2      2      1     4   = 16   OK
  -> "example  of text"
            ^^
            the wider gap is on the LEFT, as required

LAST LINE, ["justification."], maxWidth = 16
  left justified: join with single spaces -> "justification."  (14 chars)
  pad right to 16 -> "justification.  "

SINGLE WORD LINE, ["word"], maxWidth = 10
  gaps = 0, so base = extra / 0 would crash.
  Guard: treat it exactly like the last line -> "word      "

  INVARIANT: every line returned is exactly maxWidth characters long.
  That is the single assertion worth checking on the whiteboard.
*/

// ============================================================
// 3) BRUTE FORCE - PACK, THEN ADD SPACES ONE AT A TIME
// ============================================================
/*
- Build an array of gap widths all set to 1, then walk left to right adding
  one space at a time, wrapping around, until the width is reached.
    Time  : O(total output)   Space : O(maxWidth)
- Slower and clumsier, but it makes the "left gaps get more" rule obvious
  because the surplus is literally handed out from the left.
*/
function fullJustifyRoundRobin(words, maxWidth) {
  if (words.length === 0) return [];

  const lines = packLines(words, maxWidth);
  const result = [];

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    const isLastLine = l === lines.length - 1;

    if (isLastLine || line.length === 1) {
      result.push(leftJustify(line, maxWidth));
      continue;
    }

    // start every gap at one space, then hand out the rest from the left
    const gaps = new Array(line.length - 1).fill(1);
    let used = totalLength(line) + gaps.length;
    let gapIndex = 0;

    while (used < maxWidth) {
      gaps[gapIndex]++;
      used++;
      gapIndex = (gapIndex + 1) % gaps.length;
    }

    const pieces = [];
    for (let i = 0; i < line.length; i++) {
      pieces.push(line[i]);
      if (i < gaps.length) pieces.push(" ".repeat(gaps[i]));
    }

    result.push(pieces.join(""));
  }

  return result;
}

// ============================================================
// 4) OPTIMAL - PACK GREEDILY, THEN BASE + SURPLUS PER GAP
// ============================================================
/*
- Compute each gap's width directly instead of looping space by space.
    Time  : O(total output)   Space : O(total output)
*/
function fullJustify(words, maxWidth) {
  if (words.length === 0) return [];

  const lines = packLines(words, maxWidth);
  const result = [];

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    const isLastLine = l === lines.length - 1;

    // the last line and any single-word line are left justified
    // the single-word guard also stops a divide by zero below
    if (isLastLine || line.length === 1) {
      result.push(leftJustify(line, maxWidth));
      continue;
    }

    const gapCount = line.length - 1;
    const spacesToShare = maxWidth - totalLength(line);

    // every gap gets this many, and the leftmost few get one extra
    const base = Math.floor(spacesToShare / gapCount);
    const surplus = spacesToShare % gapCount;

    const pieces = [];
    for (let i = 0; i < line.length; i++) {
      pieces.push(line[i]);

      if (i < gapCount) {
        // gaps on the left absorb the remainder
        const width = i < surplus ? base + 1 : base;
        pieces.push(" ".repeat(width));
      }
    }

    result.push(pieces.join(""));
  }

  return result;
}

function packLines(words, maxWidth) {
  const lines = [];
  let current = [];
  let currentLetters = 0;

  for (let i = 0; i < words.length; i++) {
    // n words need at least n-1 spaces between them
    const minimumWidth = currentLetters + words[i].length + current.length;

    if (current.length > 0 && minimumWidth > maxWidth) {
      lines.push(current);
      current = [];
      currentLetters = 0;
    }

    current.push(words[i]);
    currentLetters = currentLetters + words[i].length;
  }

  if (current.length > 0) lines.push(current);

  return lines;
}

function leftJustify(line, maxWidth) {
  const joined = line.join(" ");
  // pad the right so the line still measures exactly maxWidth
  return joined + " ".repeat(maxWidth - joined.length);
}

function totalLength(line) {
  let sum = 0;
  for (let i = 0; i < line.length; i++) sum = sum + line[i].length;
  return sum;
}

// ============================================================
// QUICK CHECK
// ============================================================
const words1 = ["This", "is", "an", "example", "of", "text", "justification."];
console.log(fullJustify(words1, 16));
// [ "This    is    an", "example  of text", "justification.  " ]

const words2 = ["What", "must", "be", "acknowledgment", "shall", "be"];
console.log(fullJustify(words2, 16));
// [ "What   must   be", "acknowledgment  ", "shall be        " ]

console.log(fullJustify(["a"], 5)); // [ "a    " ]  single word
console.log(fullJustify([], 10)); // []          empty
console.log(fullJustify(["ab", "cd"], 5)); // [ "ab cd" ]  last line

// every line must be exactly maxWidth
const out = fullJustify(words1, 16);
let allExact = true;
for (let i = 0; i < out.length; i++) {
  if (out[i].length !== 16) allExact = false;
}
console.log(allExact); // true

console.log(fullJustifyRoundRobin(words1, 16));
// same three lines
console.log(fullJustifyRoundRobin(words2, 16));

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY: O(total output characters) time and space for both versions.
  There is no clever algorithm here - it is a specification problem.
- SPLIT IT INTO TWO JOBS AND IT STOPS BEING HARD:
    packing (greedy: how many words fit) and padding (how to spread the
    spaces on one line). I would say this before writing anything, because
    trying to do both in one loop is what makes people fail this question.
- THE PACKING TEST:
    currentLetters + nextWordLength + currentWordCount <= maxWidth.
    The word count IS the minimum number of spaces needed, which is a neat
    way to avoid tracking gaps separately.
- THE PADDING FORMULA:
    base = floor(extra / gaps), surplus = extra % gaps, and the first
    `surplus` gaps each get one more. That is exactly the "left is wider"
    rule the problem states.
- THE TWO SPECIAL LINES:
    the last line, and any line with one word. Both are left justified and
    right padded. The single-word case must be checked FIRST, because
    gaps = 0 would be a divide by zero.
- THE CHECK I WOULD RUN ON THE WHITEBOARD:
    assert every output line has length exactly maxWidth. It catches almost
    every bug in this problem in one line.
- FOLLOW-UPS:
    Rearrange Spaces Between Words (LC 1592, the same distribute-evenly
    idea), Reverse Words in a String (LC 151), Word Wrap DP (the version
    that minimises total raggedness instead of packing greedily).
*/

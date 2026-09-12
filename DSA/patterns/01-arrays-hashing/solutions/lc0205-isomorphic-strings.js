/*
Isomorphic Strings (LC 205)

Is there a one-to-one letter mapping that turns s into t?
Order is kept. No two different letters may map to the same letter.

  s = "egg",   t = "add"    -> true   (e->a, g->d)
  s = "foo",   t = "bar"    -> false  (o->a and o->r, impossible)
  s = "badc",  t = "baba"   -> false  (d->b and b->b, two letters share b)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A mapping must be consistent in BOTH directions. That is the whole
  problem, and the only real trap.
    forward : s[i] must always map to the same t[i]
    backward: t[i] must always come from the same s[i]
- One map alone passes "badc" -> "baba", which is wrong. So I keep two.
- A slicker version: instead of storing letters, store the LAST INDEX each
  letter was seen at. Two strings are isomorphic exactly when those
  last-seen positions match at every step.

- The ladder:
    1. one map only                     O(n) but WRONG - shows the trap
    2. two maps, forward and backward   O(n) time, O(1) space
    3. two last-seen index arrays       O(n) time, O(1) space, one map free

- Traps:
    - different lengths are instantly false.
    - a letter may map to itself, that is allowed ("ab" -> "ab" is true).
    - the "last seen index" arrays must start at 0 with a 1-based marker,
      because index 0 is a real position.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
TWO MAP view, s = "badc", t = "baba"    (the case one map gets wrong)

  forward {} , backward {}

  i=0  b -> b   forward has b? no. backward has b? no.
                forward = { b:b }   backward = { b:b }
  i=1  a -> a   both empty for a
                forward = { b:b, a:a }   backward = { b:b, a:a }
  i=2  d -> b   forward has d? no.
                backward has b? YES, and it points to s letter 'b', not 'd'
                -> two different s letters both want to become 'b'
                -> return false
                        ^
                        exactly what a single forward map would miss

TRUE case, s = "egg", t = "add"

  i=0  e -> a   forward = { e:a }        backward = { a:e }
  i=1  g -> d   forward = { e:a, g:d }   backward = { a:e, d:g }
  i=2  g -> d   forward has g -> d, matches t[2] = d  OK
                backward has d -> g, matches s[2] = g  OK
  end -> true

LAST SEEN INDEX view, s = "foo", t = "bar"
  store position+1 so that 0 means "never seen"

  i=0  f,b   lastS[f] = 0, lastT[b] = 0   equal (both unseen)
             lastS[f] = 1, lastT[b] = 1
  i=1  o,a   lastS[o] = 0, lastT[a] = 0   equal
             lastS[o] = 2, lastT[a] = 2
  i=2  o,r   lastS[o] = 2, lastT[r] = 0   2 != 0  -> false
                          ^        ^
                          o repeats, r does not - the shapes differ

  INVARIANT: two strings have the same "shape" exactly when, at every
  index, both characters were last seen at the same earlier position.
*/

// ============================================================
// 3) BRUTE FORCE - ONE MAP ONLY (AND WHY IT IS WRONG)
// ============================================================
/*
- Map s[i] to t[i] and check consistency going forward only.
    Time  : O(n)   Space : O(1)
- It is fast but INCORRECT. I keep it here because naming the counter
  example ("badc" / "baba") is what the interviewer is listening for.
*/
function isIsomorphicOneMapWrong(s, t) {
  if (s.length !== t.length) return false;

  const forward = new Map();

  for (let i = 0; i < s.length; i++) {
    if (forward.has(s[i])) {
      if (forward.get(s[i]) !== t[i]) return false;
    } else {
      // nothing stops two different s letters landing on the same t letter
      forward.set(s[i], t[i]);
    }
  }

  return true;
}

// ============================================================
// 4) BETTER - TWO MAPS, BOTH DIRECTIONS
// ============================================================
/*
- Forward proves the mapping is a function; backward proves it is one-to-one.
    Time  : O(n)   Space : O(1)   (at most 256 entries)
- This is the answer I would actually write in an interview.
*/
function isIsomorphicTwoMaps(s, t) {
  if (s.length !== t.length) return false;

  const forward = new Map(); // s letter -> t letter
  const backward = new Map(); // t letter -> s letter

  for (let i = 0; i < s.length; i++) {
    const from = s[i];
    const to = t[i];

    // this s letter already committed to a different t letter
    if (forward.has(from) && forward.get(from) !== to) return false;

    // this t letter is already claimed by a different s letter
    if (backward.has(to) && backward.get(to) !== from) return false;

    forward.set(from, to);
    backward.set(to, from);
  }

  return true;
}

// ============================================================
// 5) OPTIMAL - LAST SEEN POSITIONS (THE ONE TO WRITE)
// ============================================================
/*
- Compare the "shape" of the two strings directly: at every index the two
  characters must have been last seen at the same earlier position.
    Time  : O(n)   Space : O(1)   (two fixed 256-slot arrays)
- Stores integers instead of characters and needs no Map at all.
*/
const CHARSET_SIZE = 256;

function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;

  // 0 means "never seen"; a real position is stored as index + 1
  const lastSeenS = new Array(CHARSET_SIZE).fill(0);
  const lastSeenT = new Array(CHARSET_SIZE).fill(0);

  for (let i = 0; i < s.length; i++) {
    const codeS = s.charCodeAt(i);
    const codeT = t.charCodeAt(i);

    // the two characters must repeat at exactly the same rhythm
    if (lastSeenS[codeS] !== lastSeenT[codeT]) return false;

    lastSeenS[codeS] = i + 1;
    lastSeenT[codeT] = i + 1;
  }

  return true;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(isIsomorphic("egg", "add")); // true
console.log(isIsomorphic("foo", "bar")); // false
console.log(isIsomorphic("badc", "baba")); // false  the two-way trap
console.log(isIsomorphic("paper", "title")); // true
console.log(isIsomorphic("", "")); // true   empty
console.log(isIsomorphic("ab", "a")); // false  length guard

console.log(isIsomorphicTwoMaps("badc", "baba")); // false
console.log(isIsomorphicTwoMaps("paper", "title")); // true
console.log(isIsomorphicOneMapWrong("badc", "baba")); // true  <- the bug

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    one map (wrong)   O(n) time, O(1) space
    two maps          O(n) time, O(1) space
    last-seen arrays  O(n) time, O(1) space, integers only
- WHY TWO DIRECTIONS ARE NEEDED:
    isomorphic means a BIJECTION. A forward map only proves each s letter
    has one image; it does not stop two s letters sharing an image.
    "badc" -> "baba" is the counter example I would name straight away.
- WHY LAST-SEEN POSITIONS WORK:
    a bijection preserves the repetition pattern exactly. Two strings are
    isomorphic if and only if their repeat rhythms line up at every index.
- THE REAL TRAP:
    storing the raw index. Index 0 is a valid position but also the "unseen"
    default, so I store index + 1 and keep 0 as the sentinel.
- FOLLOW-UPS:
    Word Pattern (LC 290, same bijection between words and characters),
    Group Anagrams (LC 49, canonical keys),
    Find and Replace Pattern (LC 890, isomorphic against a list).
*/
